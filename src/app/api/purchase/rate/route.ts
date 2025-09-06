import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/utils/supabase/server";

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

    // Try to resolve user from Supabase server auth session
    let userId: string | null = null;
    try {
      // supabaseServer.auth.getUser() returns { data: { user }, error } in many setups
      // adjust if your supabase util exposes a different method
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const userRes: any = await supabaseServer.auth.getUser?.();
      if (userRes?.data?.user?.id) userId = userRes.data.user.id;
    } catch {
      // ignore and fallback to body-provided user (if any)
    }

    // fallback: accept user_id in body (useful for server-to-server calls). Prefer session-derived user.
    if (!userId && body.user_id) userId = body.user_id;

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const payload = {
      user_id: userId,
      product_id,
      order_id: order_id,
      rating: parsedRating,
      review_text: review_text ?? null,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabaseServer.from("reviews").insert([payload]).select().single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, review: data }, { status: 201 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 });
  }
}