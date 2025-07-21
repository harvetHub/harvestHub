import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/utils/supabase/client";
import { getUserId } from "@/utils/getUserId";


// GET /api/cart/list - Fetch all cart items for the authenticated user
export async function GET(req: NextRequest) {
  const userId = await getUserId(req);
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Fetch cart items (only product_id, quantity, etc.)
  const { data: cartItems, error: cartError } = await supabase
    .from("shopping_cart")
    .select("*")
    .eq("user_id", userId);

  if (cartError) {
    return NextResponse.json({ message: "Failed to fetch cart", error: cartError }, { status: 400 });
  }

  if (!cartItems || cartItems.length === 0) {
    return NextResponse.json({ cart: [] });
  }

  // Fetch product details for all product_ids in the cart
  const productIds = cartItems.map((item) => item.product_id);

  const { data: products, error: prodError } = await supabase
    .from("products")
    .select("product_id, name, price, image_url, stocks")
    .in("product_id", productIds);

  if (prodError) {
    return NextResponse.json({ message: "Failed to fetch products", error: prodError }, { status: 400 });
  }

  // Merge product details into cart items
  const cartWithDetails = cartItems.map((cartItem) => {
    const product = products.find((p) => p.product_id === cartItem.product_id);
    return {
      ...cartItem,
      name: product?.name ?? null,
      price: product?.price ?? null,
      image_url: product?.image_url ?? null,
      stocks: product?.stocks ?? null,
    };
  });

  return NextResponse.json({ cart: cartWithDetails });
}