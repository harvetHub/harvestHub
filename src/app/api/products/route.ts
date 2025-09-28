import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/utils/supabase/server";

// PRODUCTS + ORDERS GET HANDLER
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Check if this is an orders request (by presence of "status" param)
    const status = searchParams.get("status");
    if (status !== null) {
      // Handle orders logic
      const page = parseInt(searchParams.get("page") || "1");
      const limit = parseInt(searchParams.get("limit") || "15");
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      let query = supabaseServer
        .from("orders")
        .select("*", { count: "exact" })
        .range(from, to);

      // Only filter if status is set and not "All"
      if (status && status.toLowerCase() !== "all") {
        query = query.eq("status", status);
      }

      const { data: orders, error, count } = await query;

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      // Pad results if you want consistent 15 slots
      const paddedOrders = [
        ...orders,
        ...Array(limit - (orders?.length ?? 0)).fill({ placeholder: true }),
      ];

      return NextResponse.json(
        {
          items: paddedOrders,
          total: count,
          page,
          limit,
          totalPages: count ? Math.ceil(count / limit) : 0,
        },
        { status: 200 }
      );
    }

    // Otherwise, handle products logic
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "15");
    const productType = searchParams.get("product_type");
    const searchTerm = searchParams.get("search_term");
    const isFeatured = searchParams.get("is_featured");
    const isRecommended = searchParams.get("is_recommended");
    const offset = (page - 1) * limit;

    // Initialize the query
    let query = supabaseServer
      .from("products")
      .select("*", { count: "exact" })
      .is("is_deleted", false)
      .range(offset, offset + limit - 1);

    // Apply search term filter
    if (searchTerm) {
      query = query.ilike("name", `%${searchTerm}%`);
    }

    // Apply product type filter (skip if "All" is selected)
    if (productType && productType !== "All") {
      query = query.eq("product_type", productType);
    }

    // Apply is_featured filter
    if (isFeatured) {
      query = query.eq("is_featured", isFeatured === "true");
    }

    // Apply is_recommended filter
    if (isRecommended) {
      query = query.eq("is_recommended", isRecommended === "true");
    }

    // Execute the query
    const { data: products, error, count } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Get all product_ids from the current page
    const productIds = products.map((p) => p.product_id);

    // Fetch sold counts for these products from order_items
    const soldMap: Record<string, number> = {};
    if (productIds.length > 0) {
      const { data: soldData, error: soldError } = await supabaseServer
        .from("order_items")
        .select("product_id, quantity");

      if (!soldError && soldData) {
        // Sum quantities per product_id
        soldData.forEach((item) => {
          if (productIds.includes(item.product_id)) {
            soldMap[item.product_id] =
              (soldMap[item.product_id] || 0) + item.quantity;
          }
        });
      }
    }

    // Append sold count to each product
    const productsWithSold = products.map((product) => ({
      ...product,
      sold: soldMap[product.product_id] || 0,
    }));

    // Pad to always fill the limit
    const paddedProducts = [
      ...productsWithSold,
      ...Array(limit - productsWithSold.length).fill({ placeholder: true }),
    ];

    return NextResponse.json(
      {
        products: paddedProducts,
        total: count,
        page,
        limit,
        totalPages: count ? Math.ceil(count / limit) : 0,
      },
      { status: 200 }
    );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
