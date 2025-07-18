import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/utils/supabase/server";

// PATCH /api/purchase/manage/cancel
export async function PATCH(req: NextRequest) {
  try {
    const { order_id, reasons } = await req.json();

    if (!order_id || !Array.isArray(reasons) || reasons.length === 0) {
      return NextResponse.json(
        { error: "order_id and at least one reason are required." },
        { status: 400 }
      );
    }

    // Join reasons array into a single string for text column
    const reasonsText = reasons.join(", ");

    // Update the order status to 'rejected' and store reasons as text
    const { error } = await supabaseServer
      .from("orders")
      .update({
        status: "rejected",
        cancel_reason: reasonsText, // Make sure you have a 'cancel_reason' TEXT column in your orders table
      })
      .eq("order_id", order_id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: "Order cancelled successfully." }, { status: 200 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}