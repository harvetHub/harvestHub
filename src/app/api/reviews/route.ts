import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/utils/supabase/server";

async function fetchReviewsByProduct(productId: number | string) {
  const pid = typeof productId === "string" ? Number(productId) : productId;
  if (!pid) {
    return { error: "invalid product_id", data: null };
  }

  // select explicit columns to avoid unexpected joins; adjust if you want user data
  const { data, error } = await supabaseServer
    .from("reviews")
    .select("review_id, user_id, product_id, rating, review_text, created_at")
    .eq("product_id", pid)
    .order("created_at", { ascending: false });

  return { error, data };
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("product_id");
    if (!productId) {
      return NextResponse.json({ error: "product_id query param is required" }, { status: 400 });
    }

    const { error, data } = await fetchReviewsByProduct(productId);
     // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (error) return NextResponse.json({ error: (error as any).message ?? error }, { status: 400 });

    return NextResponse.json({ reviews: data ?? [] }, { status: 200 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { product_id } = body;
    if (!product_id) {
      return NextResponse.json({ error: "product_id is required in body" }, { status: 400 });
    }

    const { error, data } = await fetchReviewsByProduct(product_id);
     // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (error) return NextResponse.json({ error: (error as any).message ?? error }, { status: 400 });

    return NextResponse.json({ reviews: data ?? [] }, { status: 200 });
     // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Server error" }, { status: 500 });
  }
}