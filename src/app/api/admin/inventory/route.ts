import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/utils/supabase/server";

// GET: Fetch inventory items with pagination and filtering
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const productType = searchParams.get("product_type");
  const searchTerm = searchParams.get("search_term");
  const offset = (page - 1) * limit;

  let query = supabaseServer
    .from("products")
    .select("*", { count: "exact" })
    .range(offset, offset + limit - 1);

  if (searchTerm) {
    query = query.ilike("name", `%${searchTerm}%`);
  } else if (productType) {
    query = query.eq("product_type", productType);
  }

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({
    products: data,
    total: count,
    page,
    limit,
  });
}

// PUT: Modify stock quantity for a specific product and log the changes
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, quantity } = body;

    if (!id || quantity === undefined) {
      return NextResponse.json(
        { error: "Product ID and quantity are required." },
        { status: 400 }
      );
    }

    // Fetch the current stock quantity for the product
    const { data: currentProduct, error: fetchError } = await supabaseServer
      .from("products")
      .select("stocks")
      .eq("product_id", id)
      .single();

    if (fetchError) {
      return NextResponse.json(
        { error: fetchError.message || "Failed to fetch current stock." },
        { status: 400 }
      );
    }

    const currentStock = currentProduct?.stocks || 0;
    const changeQuantity = quantity - currentStock; // Calculate the change in stock

    // Update the stock quantity in the database
    const { data: updatedProduct, error: updateError } = await supabaseServer
      .from("products")
      .update({ stocks: quantity })
      .eq("product_id", id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 400 });
    }

    // Log the stock change in the inventory_logs table
    const { error: logError } = await supabaseServer
      .from("inventory_logs")
      .insert({
        product_id: id,
        change_quantity: changeQuantity,
      });

    if (logError) {
      return NextResponse.json(
        { error: logError.message || "Failed to log inventory change." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: "Stock quantity updated and logged successfully.",
        product: updatedProduct,
      },
      { status: 200 }
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
