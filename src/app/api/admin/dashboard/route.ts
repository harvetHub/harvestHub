import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/utils/supabase/server";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: NextRequest) {
  try {
    // Total Sales
    const { data: salesData, error: salesError } = await supabaseServer
      .from("orders")
      .select("total_amount")
      .eq("status", "released");

    // Total Orders
    const { count: ordersCount, error: ordersError } = await supabaseServer
      .from("orders")
      .select("*", { count: "exact", head: true });

    // Total Products
    const { count: productsCount, error: productsError } = await supabaseServer
      .from("products")
      .select("*", { count: "exact", head: true });

    // Total Users
    const { count: usersCount, error: usersError } = await supabaseServer
      .from("users")
      .select("*", { count: "exact", head: true });

    // Fetch all released orders with date and amount
    const { data: releasedOrders, error: releasedOrdersError } = await supabaseServer
      .from("orders")
      .select("order_date, total_amount")
      .eq("status", "released");

    if (releasedOrdersError) {
      return NextResponse.json(
        { error: releasedOrdersError.message },
        { status: 400 }
      );
    }

    // Group by month in JS
    const monthlySalesMap: Record<string, number> = {};
    (releasedOrders || []).forEach(order => {
      if (!order.order_date) return;
      const date = new Date(order.order_date);
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`; // e.g. "2025-07"
      monthlySalesMap[month] = (monthlySalesMap[month] || 0) + (order.total_amount || 0);
    });

    // Convert to array for chart
    const monthlySales = Object.entries(monthlySalesMap).map(([name, sales]) => ({ name, sales }));

    // Get sorted months for chart display
    const months = Object.keys(monthlySalesMap).sort();

    if (salesError || ordersError || productsError || usersError ) {
      return NextResponse.json(
        { error: salesError?.message || ordersError?.message || productsError?.message || usersError?.message },
        { status: 400 }
      );
    }

    // Calculate total sales
    const totalSales = salesData?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;

    return NextResponse.json({
      totalSales,
      totalOrders: ordersCount || 0,
      totalProducts: productsCount || 0,
      totalUsers: usersCount || 0,
      monthlySales,
      months, // <-- Add months array for frontend chart display
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}