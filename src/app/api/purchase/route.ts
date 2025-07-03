import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/utils/supabase/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  // Filters
  const limit = parseInt(searchParams.get("limit") || "10");
  const productId = searchParams.get("product_id");
  const supplierId = searchParams.get("supplier_id");
  const status = searchParams.get("status");
  const dateFrom = searchParams.get("date_from");
  const dateTo = searchParams.get("date_to");

  let query = supabaseServer
    .from("orders")
    .select("*")
    .limit(limit);

  if (productId) {
    query = query.eq("product_id", productId);
  }
  if (supplierId) {
    query = query.eq("supplier_id", supplierId);
  }
  if (status) {
    query = query.eq("status", status);
  }
  if (dateFrom) {
    query = query.gte("created_at", dateFrom);
  }
  if (dateTo) {
    query = query.lte("created_at", dateTo);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ items: data }, { status: 200 });
}