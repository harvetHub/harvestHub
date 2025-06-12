import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/utils/supabase/server";


export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const productType = searchParams.get("product_type");
  const searchTerm = searchParams.get("search_term");
  const isFeatured = searchParams.get("is_featured");
  const isRecommended = searchParams.get("is_recommended");
  const offset = (page - 1) * limit;

  // Initialize the query
  let query = supabaseServer
    .from("products")
    .select("*", { count: "exact" })
    .range(offset, offset + limit - 1);

  // Apply search term filter
  if (searchTerm) {
    query = query.ilike("name", `%${searchTerm}%`);
  }

  // Apply product type filter (skip if "All" is selected)
  if (productType && productType !== "All") {
    query = query.eq("product_type", productType);
  }

  // Apply is_featured filter
  if (isFeatured) {
    query = query.eq("is_featured", isFeatured === "true");
  }

  // Apply is_recommended filter
  if (isRecommended) {
    query = query.eq("is_recommended", isRecommended === "true");
  }

  // Execute the query
  const { data: products, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // Get all product_ids from the current page
  const productIds = products.map((p) => p.product_id);

  // Fetch sold counts for these products from order_items
  const soldMap: Record<string, number> = {};
  if (productIds.length > 0) {
    const { data: soldData, error: soldError } = await supabaseServer
      .from("order_items")
      .select("product_id, quantity");

    if (!soldError && soldData) {
      // Sum quantities per product_id
      soldData.forEach((item) => {
        if (productIds.includes(item.product_id)) {
          soldMap[item.product_id] = (soldMap[item.product_id] || 0) + item.quantity;
        }
      });
    }
  }

  // Append sold count to each product
  const productsWithSold = products.map((product) => ({
    ...product,
    sold: soldMap[product.product_id] || 0,
  }));

  return NextResponse.json({
    products: productsWithSold,
    total: count,
    page,
    limit,
  });
}