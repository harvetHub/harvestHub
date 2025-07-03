import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/utils/supabase/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  // Filters
  const limit = parseInt(searchParams.get("limit") || "10");
  const status = searchParams.get("status");
  const dateFrom = searchParams.get("date_from");
  const dateTo = searchParams.get("date_to");

  // Fetch orders with filters
  let query = supabaseServer
    .from("orders")
    .select("*")
    .limit(limit);

  if (status) {
    query = query.eq("status", status);
  }
  if (dateFrom) {
    query = query.gte("created_at", dateFrom);
  }
  if (dateTo) {
    query = query.lte("created_at", dateTo);
  }

  const { data: orders, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  if (!orders || orders.length === 0) {
    return NextResponse.json({ items: [] }, { status: 200 });
  }

  // Fetch all order_items for the fetched orders
  const orderIds = orders.map((order) => order.order_id);
  const { data: orderItems, error: itemsError } = await supabaseServer
    .from("order_items")
    .select("*")
    .in("order_id", orderIds);

  if (itemsError) {
    return NextResponse.json({ error: itemsError.message }, { status: 400 });
  }

  // Fetch all products for the items
  const productIds = (orderItems || []).map((item) => item.product_id);
  const { data: products, error: productsError } = await supabaseServer
    .from("products")
    .select("product_id, name, image_url")
    .in("product_id", productIds);

  if (productsError) {
    return NextResponse.json({ error: productsError.message }, { status: 400 });
  }

  // Map products by product_id for quick lookup
  const productMap = new Map(
    (products || []).map((prod) => [prod.product_id, prod])
  );

  // Attach order_items (with product details) to each order as productList
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const itemsByOrderId: Record<string, any[]> = {};
  (orderItems || []).forEach((item) => {
    const product = productMap.get(item.product_id);
    const itemWithProduct = {
      ...item,
      name: product?.name ?? null,
      image_url: product?.image_url ?? null,
    };
    if (!itemsByOrderId[item.order_id]) itemsByOrderId[item.order_id] = [];
    itemsByOrderId[item.order_id].push(itemWithProduct);
  });

  const ordersWithItems = orders.map((order) => ({
    ...order,
    productList: itemsByOrderId[order.order_id] || [],
  }));

  return NextResponse.json({ items: ordersWithItems }, { status: 200 });
}