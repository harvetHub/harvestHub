import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/utils/supabase/client";
import { getUserId } from "@/utils/getUserId";
import { OrderItem } from "@/lib/definitions";

// POST /api/cart/checkout - Place an order for the current user's cart
export async function POST(req: NextRequest) {
  const userId = await getUserId(req);
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { cartItems, deliveryOption, totalCost } = await req.json();

  if (!cartItems || cartItems.length === 0) {
    return NextResponse.json({ message: "Cart is empty" }, { status: 400 });
  }

  // Create a new order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert([
      {
        user_id: userId,
        total_amount: totalCost,
        shipping_method: deliveryOption,
        status: "pending",
        payment_status: "unpaid",
        order_date: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (orderError || !order) {
    return NextResponse.json({ message: "Failed to create order", error: orderError }, { status: 400 });
  }

  // Insert order items
  const orderItems = cartItems.map((item: OrderItem ) => ({
    order_id: order.order_id,
    product_id: item.product_id,
    quantity: item.quantity,
    price: item.price,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemsError) {
    return NextResponse.json({ message: "Failed to add order items", error: itemsError }, { status: 400 });
  }

  // Optionally: Clear the user's cart
  await supabase
    .from("shopping_cart")
    .delete()
    .eq("user_id", userId);

  return NextResponse.json({ message: "Order placed successfully", order_id: order.order_id });
}