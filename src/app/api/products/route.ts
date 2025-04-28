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

  let query = supabaseServer
    .from("products")
    .select("*", { count: "exact" })
    .range(offset, offset + limit - 1);

  // Apply search term filter
  if (searchTerm) {
    query = query.ilike("name", `%${searchTerm}%`);
  }

  // Apply product type filter
  if (productType) {
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

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({
    products: data,
    total: count,
    page,
    limit,
  });
}