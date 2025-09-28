import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/utils/supabase/server";
import { uploadImageToStorage } from "@/utils/uploadImageToStorage";

const STATUS_VALUES = new Set([
  "available",
  "out_of_stock",
  "coming_soon",
  "preorder",
  "discontinued",
]);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // Extract fields from the form data
    const name = (formData.get("name") as string | null) ?? "";
    const description = (formData.get("description") as string | null) ?? "";
    const priceRaw = formData.get("price") as string | null;
    const product_type = (formData.get("product_type") as string | null) ?? "";
    const sku = (formData.get("sku") as string | null) ?? "";
    const imageBlob = formData.get("image_url") as Blob | null;
    const status = (formData.get("status") as string | null) ?? undefined;
    const status_message = (formData.get("status_message") as string | null) ?? null;

    const price = priceRaw ? parseFloat(priceRaw) : NaN;

    // Validate required fields
    if (!name || !description || Number.isNaN(price) || !product_type || !sku) {
      return NextResponse.json(
        { error: "Required fields: name, description, price, product_type, sku." },
        { status: 400 }
      );
    }

    // Validate status if provided
    if (status && !STATUS_VALUES.has(status)) {
      return NextResponse.json({ error: "Invalid status value." }, { status: 400 });
    }

    // Upload the image to Supabase Storage if provided
    let image_url: string | null = null;
    if (imageBlob) {
      const fileName = `products/${Date.now()}_${sku}.jpg`;
      const bucketName = "product-images";
      image_url = await uploadImageToStorage(imageBlob, fileName, bucketName);
    }

    // Insert the new product into the database
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const insertPayload: any = {
      name,
      description,
      price,
      image_url,
      product_type,
      sku,
      stocks: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (status) insertPayload.status = status;
    if (status_message !== null) insertPayload.status_message = status_message;

    const { data, error } = await supabaseServer.from("products").insert([insertPayload]);

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
      { error: error?.message || "An unexpected error occurred." },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const formData = await req.formData();

    const product_id = formData.get("product_id") as string | null;
    if (!product_id) {
      return NextResponse.json({ error: "product_id is required." }, { status: 400 });
    }
    const idNum = Number(product_id);
    if (Number.isNaN(idNum)) {
      return NextResponse.json({ error: "Invalid product_id." }, { status: 400 });
    }

    const name = (formData.get("name") as string | null) ?? "";
    const description = (formData.get("description") as string | null) ?? "";
    const priceRaw = formData.get("price") as string | null;
    const product_type = (formData.get("product_type") as string | null) ?? "";
    const sku = (formData.get("sku") as string | null) ?? "";
    const imageBlob = formData.get("image_url") as Blob | null;

    // Read raw values for status/status_message so we can detect presence
    const statusValue = formData.get("status");
    const status = statusValue === null ? undefined : String(statusValue);
    const statusMessageValue = formData.get("status_message");
    const status_message = statusMessageValue === null ? null : String(statusMessageValue);

    const price = priceRaw ? parseFloat(priceRaw) : NaN;

    // Validate required fields (still required)
    if (!name || !description || Number.isNaN(price) || !product_type || !sku) {
      return NextResponse.json(
        { error: "Required fields: name, description, price, product_type, sku." },
        { status: 400 }
      );
    }

    // If caller included status field, validate it
    if (formData.has("status") && typeof status !== "undefined" && status !== "") {
      if (!STATUS_VALUES.has(status)) {
        return NextResponse.json({ error: "Invalid status value." }, { status: 400 });
      }
    }

    let image_url: string | null = null;
    if (imageBlob) {
      const fileName = `products/${Date.now()}_${sku}.jpg`;
      const bucketName = "product-images";
      image_url = await uploadImageToStorage(imageBlob, fileName, bucketName);
    }

    // Build update payload. Only include fields that should change.
    // This ensures status/status_message are set when the client included them.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updatePayload: any = {
      name,
      description,
      price,
      product_type,
      sku,
      updated_at: new Date().toISOString(),
    };

    if (image_url) updatePayload.image_url = image_url;

    // If the client sent the "status" key, include it in the update.
    // Allow empty string -> set to NULL in DB, otherwise set the provided enum value.
    if (formData.has("status")) {
      updatePayload.status = status === "" ? null : status;
    }

    // If the client sent the "status_message" key, include it.
    // Accept empty string (will store empty string) or null explicitly.
    if (formData.has("status_message")) {
      updatePayload.status_message = status_message; // null or string
    }

    const { data, error } = await supabaseServer
      .from("products")
      .update(updatePayload)
      .eq("product_id", idNum)
      .select()
      .maybeSingle();

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
      { error: error?.message || "An unexpected error occurred." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const product_id = searchParams.get("product_id");

    if (!product_id) {
      return NextResponse.json({ error: "Product ID is required." }, { status: 400 });
    }

    const idNum = Number(product_id);
    if (Number.isNaN(idNum)) {
      return NextResponse.json({ error: "Invalid product_id." }, { status: 400 });
    }

    // Try hard delete first
    const { error: deleteError } = await supabaseServer
      .from("products")
      .delete()
      .eq("product_id", idNum);

    if (deleteError) {
      // If FK constraint error, fallback to soft delete
      if (deleteError.message.includes("violates foreign key constraint")) {
        const { error: updateError, data: updated } = await supabaseServer
          .from("products")
          .update({
            is_deleted: true,
            deleted_at: new Date().toISOString(),
          })
          .eq("product_id", idNum);

        if (updateError) {
          return NextResponse.json({ error: updateError.message }, { status: 400 });
        }

        return NextResponse.json(
          { message: "Product archived instead of deleted.", product: updated },
          { status: 200 }
        );
      }

      return NextResponse.json({ error: deleteError.message }, { status: 400 });
    }

    return NextResponse.json(
      { message: "Product deleted successfully." },
      { status: 200 }
    );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
