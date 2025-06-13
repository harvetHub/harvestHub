import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/utils/supabase/server";

// GET: Fetch all orders or a specific order by ID with pagination and filtering
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10); // Default to page 1
  const limit = parseInt(searchParams.get("limit") || "10", 10); // Default to 10 items per page
  const status = searchParams.get("status");
  const searchTerm = searchParams.get("search_term");
  const offset = (page - 1) * limit; // Calculate the offset for pagination

  try {
    // Base query
    let query = supabaseServer
      .from("orders")
      .select("*, users!inner(name)", { count: "exact" }) // Include total count for pagination
      .range(offset, offset + limit - 1); // Fetch only the required range of data

    // Apply filters
    if (status && status !== "All") {
      query = query.eq("payment_status", status);
    }
    if (searchTerm) {
      query = query.ilike("users.name->>first", `%${searchTerm}%`); // Search by customer's first name
    }

    // Execute query
    const { data: orders, count, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Get all unique user_ids from orders
    const userIds = [...new Set(orders.map((order) => order.user_id))];

    // Fetch all user names in one query
    const { data: usersData, error: usersError } = await supabaseServer
      .from("users")
      .select("user_id, name")
      .in("user_id", userIds);

    if (usersError) {
      return NextResponse.json({ error: usersError.message }, { status: 400 });
    }

    // Create a map for quick lookup
    const userMap = new Map(
      (usersData || []).map((user) => [user.user_id, user.name])
    );

    // Map orders to include the full customer name
    const ordersWithCustomerNames = orders.map((order) => {
      const name = userMap.get(order.user_id);

      let customerName = "N/A";
      if (typeof name === "string") {
        customerName = name;
      } else if (name && typeof name === "object") {
        // Join available parts, filter out empty strings
        customerName = [name.first, name.middle, name.last]
          .filter(Boolean)
          .join(" ")
          .trim();
        // If all are missing, fallback to N/A
        if (!customerName) customerName = "N/A";
      }

      return {
        ...order,
        customer_name: customerName,
      };
    });

    // Return paginated response
    return NextResponse.json(
      {
        orders: ordersWithCustomerNames,
        totalItems: count, // Total number of items in the database
        totalPages: Math.ceil((count ?? 0) / limit), // Total number of pages
        currentPage: page, // Current page
        limit, // Items per page
      },
      { status: 200 }
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Create a new order
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { user_id, total_amount, shipping_method, status, payment_status } =
      body;

    if (!user_id || !total_amount) {
      return NextResponse.json(
        { error: "User ID and total amount are required." },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseServer.from("orders").insert([
      {
        user_id,
        total_amount,
        shipping_method,
        status: status || "Pending",
        payment_status: payment_status || "Unpaid",
      },
    ]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { message: "Order created successfully.", order: data },
      { status: 201 }
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT: Update an existing order
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { order_id, total_amount, shipping_method, status, payment_status } = body;

    if (!order_id) {
      return NextResponse.json(
        { error: "Order ID is required for updating." },
        { status: 400 }
      );
    }

    // Determine the new payment status
    let newPaymentStatus = payment_status;
    if (typeof status === "string" && status.toLowerCase() === "released") {
      newPaymentStatus = "paid";
    }

    const { data, error } = await supabaseServer
      .from("orders")
      .update({
        total_amount,
        shipping_method,
        status,
        payment_status: newPaymentStatus,
      })
      .eq("order_id", order_id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { message: "Order updated successfully.", order: data },
      { status: 200 }
    );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Delete an order by ID
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("order_id");

  if (!orderId) {
    return NextResponse.json(
      { error: "Order ID is required for deletion." },
      { status: 400 }
    );
  }

  try {
    const { data, error } = await supabaseServer
      .from("orders")
      .delete()
      .eq("order_id", orderId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { message: "Order deleted successfully.", order: data },
      { status: 200 }
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
