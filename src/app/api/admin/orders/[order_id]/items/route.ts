import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/utils/supabase/server";

export async function GET(
  req: NextRequest,
  context: { params: { order_id: string } }
) {
  // Await params in case it's a Promise (for Next.js 14+ compatibility)
  const { order_id } = await context.params;

  if (!order_id || typeof order_id !== "string" || order_id.trim() === "") {
    return NextResponse.json({ error: "Order ID is required." }, { status: 400 });
  }

  // Fetch order items
  const { data: items, error } = await supabaseServer
    .from("order_items")
    .select("*")
    .eq("order_id", order_id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  if (!items || items.length === 0) {
    return NextResponse.json({ items: [] }, { status: 200 });
  }

  // Get all unique product_ids from items
  const productIds = items.map((item) => item.product_id);

  // Fetch product details for these product_ids
  const { data: products, error: prodError } = await supabaseServer
    .from("products")
    .select("product_id, name, stocks")
    .in("product_id", productIds);

  if (prodError) {
    return NextResponse.json({ error: prodError.message }, { status: 400 });
  }

  // Create a map for quick lookup
  const productMap = new Map(
    (products || []).map((prod) => [prod.product_id, prod])
  );

  // Append name and image_url to each item
  const itemsWithProductDetails = items.map((item) => {
    const product = productMap.get(item.product_id);
    return {
      ...item,
      name: product?.name ?? null,
      stocks: product?.stocks ?? null,
    };
  });

  return NextResponse.json({ items: itemsWithProductDetails }, { status: 200 });
}