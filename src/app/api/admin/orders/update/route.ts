/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/utils/supabase/server";

// PUT: Update an existing order
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { order_id, total_amount, shipping_method, status, payment_status, updated_by } = body;

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

    // Update the order
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

    const { error: logError } = await supabaseServer
      .from("order_status_logs")
      .insert([
        {
          order_id,
          status,
          payment_status: newPaymentStatus,
          created_at: new Date().toISOString(),
          updated_by: updated_by ?? null,
        },
      ]);

    if (logError) {
      return NextResponse.json({ error: logError.message }, { status: 400 });
    }

    return NextResponse.json(
      { message: "Order updated successfully.", order: data },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}