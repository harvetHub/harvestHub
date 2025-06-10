import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/utils/supabase/client";
import { getUserId } from "@/utils/getUserId";

// PATCH /api/cart/manage - Manage cart: increase, deduct, or delete
export async function PATCH(req: NextRequest) {
  const userId = await getUserId(req);
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { product_id, action, amount = 1 } = await req.json();

  if (!product_id || !action) {
    return NextResponse.json({ message: "Product ID and action are required." }, { status: 400 });
  }

  // Fetch current cart item
  const { data: cartItem, error: fetchError } = await supabase
    .from("shopping_cart")
    .select("*")
    .eq("user_id", userId)
    .eq("product_id", product_id)
    .single();

  if (fetchError || !cartItem) {
    return NextResponse.json({ message: "Cart item not found." }, { status: 404 });
  }

  if (action === "increase") {
    // Increase quantity by amount (default 1)
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
  } else if (action === "deduct") {
    if (cartItem.quantity > 1) {
      // Deduct quantity by 1
      const { data, error } = await supabase
        .from("shopping_cart")
        .update({ quantity: cartItem.quantity - 1 })
        .eq("user_id", userId)
        .eq("product_id", product_id)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ message: "Failed to deduct quantity", error }, { status: 400 });
      }

      return NextResponse.json({ message: "Quantity deducted", cart: data });
    } else {
      // If quantity is 1, remove the item
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
  } else if (action === "delete") {
    // Remove the item regardless of quantity
    const { error } = await supabase
      .from("shopping_cart")
      .delete()
      .eq("user_id", userId)
      .eq("product_id", product_id);

    if (error) {
      return NextResponse.json({ message: "Failed to remove item", error }, { status: 400 });
    }

    return NextResponse.json({ message: "Item removed from cart" });
  } else {
    return NextResponse.json({ message: "Invalid action" }, { status: 400 });
  }
}