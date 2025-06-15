import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/utils/supabase/server";
import { uploadImageToStorage } from "@/utils/uploadImageToStorage";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // Extract fields from the form data
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const product_type = formData.get("product_type") as string;
    const sku = formData.get("sku") as string;
    const imageBlob = formData.get("image_url") as Blob;

    // Validate required fields
    if (
      !name ||
      !description ||
      !price ||
      !product_type ||
      !sku ||
      !imageBlob
    ) {
      return NextResponse.json(
        { error: "All fields are required, including an image." },
        { status: 400 }
      );
    }

    // Upload the image to Supabase Storage
    const fileName = `products/${Date.now()}_${sku}.jpg`;
    const bucketName = "product-images"; // Replace with your Supabase bucket name
    const image_url = await uploadImageToStorage(
      imageBlob,
      fileName,
      bucketName
    );

    // Insert the new product into the database
    const { data, error } = await supabaseServer.from("products").insert([
      {
        name,
        description,
        price,
        image_url,
        product_type,
        sku,
        stocks: 0,
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred." },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const formData = await req.formData();

    // Extract fields from the form data
    const product_id = formData.get("product_id") as string;
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const product_type = formData.get("product_type") as string;
    const sku = formData.get("sku") as string;
    // const stocks = parseInt(formData.get("stocks") as string, 10);
    const imageBlob = formData.get("image_url") as Blob;

    // Validate required fields
    if (
      !product_id ||
      !name ||
      !description ||
      !price ||
      !product_type ||
      !sku
    ) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    let image_url = null;

    // If a new image is provided, upload it to Supabase Storage
    if (imageBlob) {
      const fileName = `products/${Date.now()}_${sku}.jpg`;
      const bucketName = "product-images"; // Replace with your Supabase bucket name
      image_url = await uploadImageToStorage(imageBlob, fileName, bucketName);
    }

    // Update the product in the database
    const { data, error } = await supabaseServer
      .from("products")
      .update({
        name,
        description,
        price,
        ...(image_url && { image_url }), // Only update image_url if a new image was uploaded
        product_type,
        sku,
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const product_id = searchParams.get("product_id");

    if (!product_id) {
      return NextResponse.json(
        { error: "Product ID is required." },
        { status: 400 }
      );
    }

    // Delete the product from the database
    const { data, error } = await supabaseServer
      .from("products")
      .delete()
      .eq("product_id", +product_id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { message: "Product deleted successfully.", product: data },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
