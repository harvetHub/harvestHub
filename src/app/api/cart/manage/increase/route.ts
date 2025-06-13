import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/utils/supabase/client";
import { getUserId } from "@/utils/getUserId";

export async function PATCH(req: NextRequest) {
  const userId = await getUserId(req);
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { product_id, amount = 1 } = await req.json();
  if (!product_id) {
    return NextResponse.json({ message: "Product ID is required." }, { status: 400 });
  }

  const { data: cartItem, error: fetchError } = await supabase
    .from("shopping_cart")
    .select("*")
    .eq("user_id", userId)
    .eq("product_id", product_id)
    .single();

  if (fetchError || !cartItem) {
    return NextResponse.json({ message: "Cart item not found." }, { status: 404 });
  }

  const { data, error } = await supabase
    .from("shopping_cart")
    .update({ quantity: cartItem.quantity + amount })
    .eq("user_id", userId)
    .eq("product_id", product_id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ message: "Failed to increase quantity", error }, { status: 400 });
  }
  return NextResponse.json({ message: "Quantity increased", cart: data });
}