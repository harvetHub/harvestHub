import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/utils/supabase/client";
import { getUserId } from "@/utils/getUserId";

export async function PATCH(req: NextRequest) {
  const userId = await getUserId(req);
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { product_id } = await req.json();
  if (!product_id) {
    return NextResponse.json({ message: "Product ID is required." }, { status: 400 });
  }

  const { error } = await supabase
    .from("shopping_cart")
    .delete()
    .eq("user_id", userId)
    .eq("product_id", product_id);

  if (error) {
    return NextResponse.json({ message: "Failed to remove item", error }, { status: 400 });
  }
  return NextResponse.json({ message: "Item removed from cart" });
}