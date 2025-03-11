import { NextRequest, NextResponse } from "next/server";
import { supabaseServerClient } from "@/utils/supabase/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const offset = (page - 1) * limit;

  const { data, error, count } = await supabaseServerClient
    .from("products")
    .select("*", { count: "exact" })
    .range(offset, offset + limit - 1);

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
