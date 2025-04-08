import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/utils/supabase/server";

// GET: Fetch all inventory logs or logs for a specific product
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("product_id");

  try {
    let query = supabaseServer.from("inventory_logs").select("*");

    if (productId) {
      query = query.eq("product_id", productId);
    }

    const { data: logs, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ logs }, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Create a new inventory log
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { product_id, change_quantity } = body;

    if (!product_id || !change_quantity) {
      return NextResponse.json(
        { error: "Product ID and change quantity are required." },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseServer.from("inventory_logs").insert([
      {
        product_id,
        change_quantity,
      },
    ]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { message: "Inventory log created successfully.", log: data },
      { status: 201 }
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Delete an inventory log by ID
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const logId = searchParams.get("log_id");

  if (!logId) {
    return NextResponse.json(
      { error: "Log ID is required for deletion." },
      { status: 400 }
    );
  }

  try {
    const { data, error } = await supabaseServer
      .from("inventory_logs")
      .delete()
      .eq("log_id", logId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { message: "Inventory log deleted successfully.", log: data },
      { status: 200 }
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
