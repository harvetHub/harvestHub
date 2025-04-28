import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/utils/supabase/server";

export async function GET(req: NextRequest, { params }: { params: { id: number } }) {
  const { id } = params;

  const { data, error } = await supabaseServer
    .from("products")
    .select("*")
    .eq("product_id", id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  return NextResponse.json({ product: data });
}