import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/utils/supabase/server";

async function fetchReviewsByProduct(productId: number | string) {
  const pid = typeof productId === "string" ? Number(productId) : productId;
  if (!pid) {
    return { error: "invalid product_id", data: null };
  }

  // Fetch reviews
  const { data: reviews, error } = await supabaseServer
    .from("reviews")
    .select("review_id, user_id, product_id, rating, review_text, created_at")
    .eq("product_id", pid)
    .order("created_at", { ascending: false });

  if (error || !reviews || reviews.length === 0) {
    return { error, data: reviews ?? [] };
  }

  // Get unique user_ids
  const userIds = Array.from(new Set(reviews.map((r) => r.user_id).filter(Boolean)));

  // Fetch user profiles in one query
  const userProfiles: Record<string, { image_url: string | null; username: string | null }> = {};
  if (userIds.length > 0) {
    const { data: users } = await supabaseServer
      .from("users")
      .select("user_id, image_url, username")
      .in("user_id", userIds);

    if (users && Array.isArray(users)) {
      users.forEach((u) => {
        userProfiles[u.user_id] = {
          image_url: u.image_url ?? null,
          username: u.username ?? null,
        };
      });
    }
  }

  // Append user info to each review
  const reviewsWithUser = reviews.map((r) => ({
    ...r,
    user_image: userProfiles[r.user_id]?.image_url ?? null,
    user_name: userProfiles[r.user_id]?.username ?? null,
  }));

  return { error: null, data: reviewsWithUser };
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