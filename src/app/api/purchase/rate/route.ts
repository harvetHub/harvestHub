import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/utils/supabase/server";
import { getUserId } from "@/utils/getUserId";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { product_id, rating, review_text, order_id } = body;

    

    // basic validation
    if (!product_id) {
      return NextResponse.json({ error: "product_id is required" }, { status: 400 });
    }
    const parsedRating = Number(rating);
    if (!parsedRating || parsedRating < 1 || parsedRating > 5) {
      return NextResponse.json({ error: "rating must be a number between 1 and 5" }, { status: 400 });
    }

    const userId = await getUserId(req);

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const payload = {
      user_id: userId,
      product_id: Number(product_id),
      order_id: order_id ?? null,
      rating: parsedRating,
      review_text: review_text ?? null,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabaseServer.from("reviews").insert([payload]).select().single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Flip is_rated to true on matching order_items row(s)
    let updateResult = null;
    try {
      const matchObj: Record<string, unknown> = { product_id: payload.product_id };
      // only include order_id in the match if provided (not null/undefined)
      if (payload.order_id != null) matchObj.order_id = payload.order_id;

      const { data: updateData, error: updateError } = await supabaseServer
        .from("order_items")
        .update({ is_rated: true })
        .match(matchObj);

      if (updateError) {
        // log but don't fail the whole request
        console.error("Failed to update order_items.is_rated:", updateError);
      } else {
        updateResult = updateData;
      }
    } catch (err) {
      console.error("Error updating order_items.is_rated:", err);
    }

    return NextResponse.json({ success: true, review: data, updatedOrderItems: updateResult }, { status: 201 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 });
  }
}