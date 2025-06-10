import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/utils/supabase/client";
import { getUserId } from "@/utils/getUserId";

// POST /api/cart/add - Add product to shopping_cart
export async function POST(req: NextRequest) {
  const userId = await getUserId(req);
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { product_id, quantity } = await req.json();

  if (!product_id || !quantity) {
    return NextResponse.json({ message: "Product ID and quantity are required." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("shopping_cart")
    .insert([
      {
        user_id: userId,
        product_id,
        quantity,
        added_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ message: "Failed to add to cart", error }, { status: 400 });
  }

  return NextResponse.json({ message: "Product added to cart", cart: data });
}