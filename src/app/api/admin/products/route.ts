import { NextRequest, NextResponse } from "next/server";
import { supabaseServerClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate required fields
    const { name, description, price, image_url, product_type, sku } = body;
    if (
      !name ||
      !description ||
      !price ||
      !image_url ||
      !product_type ||
      !sku
    ) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    // Insert the new product into the database
    const { data, error } = await supabaseServerClient.from("products").insert([
      {
        name,
        description,
        price,
        image_url,
        product_type,
        sku,
        stock_quantity: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { message: "Product added successfully.", product: data },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    console.log(JSON.stringify(body, null, 2));

    // Validate required fields
    const {
      product_id,
      name,
      description,
      price,
      image_url,
      product_type,
      sku,
      stock_quantity,
    } = body;
    if (
      !product_id ||
      !name ||
      !description ||
      !price ||
      !image_url ||
      !product_type ||
      !sku
    ) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    // Update the product in the database
    const { data, error } = await supabaseServerClient
      .from("products")
      .update({
        name,
        description,
        price,
        image_url,
        product_type,
        sku,
        stock_quantity,
        updated_at: new Date().toISOString(),
      })
      .eq("product_id", +product_id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { message: "Product updated successfully.", product: data },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
