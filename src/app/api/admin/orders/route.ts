import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/utils/supabase/server";

// GET: Fetch all orders or a specific order by ID
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("order_id");

  try {
    let query = supabaseServer.from("orders").select("*, users!inner(name)");

    if (orderId) {
      query = query.eq("order_id", orderId);
    }

    const { data: orders, error: ordersError } = await query;

    if (ordersError) {
      return NextResponse.json({ error: ordersError.message }, { status: 400 });
    }

    // Map orders to include the full customer name
    const ordersWithCustomerNames = orders.map((order) => {
      const name = order.users?.name || {};
      const customerName = `${name.first || ""} ${name.middle || ""} ${
        name.last || ""
      }`.trim();

      return {
        ...order,
        customer_name: customerName || "N/A",
      };
    });

    return NextResponse.json(
      { orders: ordersWithCustomerNames },
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
    const { order_id, total_amount, shipping_method, status, payment_status } =
      body;

    if (!order_id) {
      return NextResponse.json(
        { error: "Order ID is required for updating." },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseServer
      .from("orders")
      .update({
        total_amount,
        shipping_method,
        status,
        payment_status,
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
