/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
// This route handles the creation, update, and deletion of users
import { uploadImageToStorage } from "@/utils/uploadImageToStorage";
import { supabaseServer } from "@/utils/supabase/server";

// GET: Fetch users with pagination and filtering
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10); // Default to page 1
  const limit = parseInt(searchParams.get("limit") || "10", 10); // Default to 10 items per page
  const searchTerm = searchParams.get("search_term") || ""; // Search term for filtering
  const offset = (page - 1) * limit; // Calculate the offset for pagination

  try {
    // Base query
    let query = supabaseServer
      .from("users")
      .select("*", { count: "exact" }) // Include total count for pagination
      .range(offset, offset + limit - 1)
      .neq("email", "harvest_h101@outlook.com"); // Filter out superadmin

    // Apply search filter
    if (searchTerm) {
      query = query.ilike("name->>first", `%${searchTerm}%`);
    }

    // Execute query
    const { data: users, count, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Return paginated response
    return NextResponse.json(
      {
        users,
        totalItems: count,
        totalPages: Math.ceil((count ?? 0) / limit),
        currentPage: page,
        limit,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred." },
      { status: 500 }
    );
  }
}

// POST: Create a new user
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const address = formData.get("address") as string;
    const mobile_number = formData.get("mobile_number") as string;
    const imageBlob = formData.get("image_url") as Blob; // Retrieve the image blob

    if (!name || !username || !email) {
      return NextResponse.json(
        { error: "Name, username, and email are required." },
        { status: 400 }
      );
    }

    // Check if the email already exists
    const { data: existingUser, error: emailCheckError } = await supabaseServer
      .from("users")
      .select("email")
      .eq("email", email)
      .single();

    if (emailCheckError && emailCheckError.code !== "PGRST116") {
      return NextResponse.json(
        { error: emailCheckError.message },
        { status: 400 }
      );
    }

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already exists. Please use a different email." },
        { status: 400 }
      );
    }

    let uploadedImageUrl = null;

    // If an image is provided, upload it to Supabase Storage
    if (imageBlob) {
      try {
        const fileName = `users/${Date.now()}_${username}.jpg`; // Generate a unique file name
        const bucketName = "user-images"; // Replace with your Supabase bucket name
        uploadedImageUrl = await uploadImageToStorage(
          imageBlob,
          fileName,
          bucketName
        );
      } catch (error: any) {
        console.error("Image upload failed:", error.message);
        return NextResponse.json(
          { error: "Failed to upload image. Please try again." },
          { status: 500 }
        );
      }
    }

    // Insert the new user
    const { data, error } = await supabaseServer.from("users").insert([
      {
        name,
        username,
        email,
        address,
        mobile_number,
        image_url: uploadedImageUrl,
      },
    ]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      message: "User added successfully.",
      user: data,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred." },
      { status: 500 }
    );
  }
}

// PUT: Update an existing user
export async function PUT(req: NextRequest) {
  try {
    const formData = await req.formData();
    const user_id = formData.get("user_id") as string;
    const name = JSON.parse(formData.get("name") as string);
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const address = formData.get("address") as string;
    const mobile_number = formData.get("mobile_number") as string;
    const imageBlob = formData.get("image_url") as Blob; // Retrieve the image blob

    if (!user_id || !name || !username || !email) {
      return NextResponse.json(
        { error: "User ID, name, username, and email are required." },
        { status: 400 }
      );
    }

    // Check if the email already exists for a different user
    const { data: existingUser, error: emailCheckError } = await supabaseServer
      .from("users")
      .select("user_id, email")
      .eq("email", email)
      .neq("user_id", user_id)
      .single();

    if (emailCheckError && emailCheckError.code !== "PGRST116") {
      return NextResponse.json(
        { error: emailCheckError.message },
        { status: 400 }
      );
    }

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already exists. Please use a different email." },
        { status: 400 }
      );
    }

    let uploadedImageUrl = null;

    // If an image is provided, upload it to Supabase Storage
    if (imageBlob) {
      try {
        const fileName = `users/${Date.now()}_${username}.jpg`; // Generate a unique file name
        const bucketName = "user-images"; // Replace with your Supabase bucket name
        uploadedImageUrl = await uploadImageToStorage(
          imageBlob,
          fileName,
          bucketName
        );
      } catch (error: any) {
        console.error("Image upload failed:", error.message);
        return NextResponse.json(
          { error: "Failed to upload image. Please try again." },
          { status: 500 }
        );
      }
    }

    // Update the user
    const { data, error } = await supabaseServer
      .from("users")
      .update({
        name,
        username,
        email,
        address,
        mobile_number,
        ...(uploadedImageUrl && { image_url: uploadedImageUrl }), // Only update image_url if a new image was uploaded
      })
      .eq("user_id", user_id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      message: "User updated successfully.",
      user: data,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred." },
      { status: 500 }
    );
  }
}

// This route handles the deletion of users
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const user_id = searchParams.get("user_id");

  if (!user_id) {
    return NextResponse.json(
      { error: "User ID is required." },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseServer
    .from("users")
    .delete()
    .eq("user_id", user_id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({
    message: "User deleted successfully.",
    user: data,
  });
}
