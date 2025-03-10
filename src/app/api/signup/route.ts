import { NextRequest, NextResponse } from "next/server";
import { supabaseServerClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
  const { username, email, password, mobileNumber, address, role } =
    await req.json();

  // Perform server-side validation if needed
  if (!username || !email || !password || !mobileNumber || !address || !role) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 }
    );
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json(
      { error: "Invalid email format" },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseServerClient.auth.signUp({
    email,
    password,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const { user } = data;

  // Save the additional user data in your database
  const { error: insertError } = await supabaseServerClient
    .from("user")
    .insert([
      {
        user_id: user?.id,
        username,
        name: {
          first_name: "",
          last_name: "",
        },
        email,
        password_hash: password, // Assuming you want to store the password hash
        mobile_number: mobileNumber,
        address,
        role,
        created_at: new Date().toISOString(),
      },
    ]);

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 400 });
  }

  return NextResponse.json(
    { message: "User signed up successfully" },
    { status: 200 }
  );
}
