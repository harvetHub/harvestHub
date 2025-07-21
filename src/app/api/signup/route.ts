import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
  const { username, email, password, mobileNumber, address } = await req.json();

  // Perform server-side validation if needed
  if (!username || !email || !password || !mobileNumber || !address) {
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

  const { data, error } = await supabaseServer.auth.signUp({
    email,
    password,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const { user } = data;

  // Save the additional user data in your database
  const { error: insertError } = await supabaseServer.from("users").insert([
    {
      user_id: user?.id,
      username: username,
      name: {
        first_name: "",
        last_name: "",
        middle_name: "",
      },
      email: email,
      mobile_number: mobileNumber,
      address: address,
      created_at: new Date().toISOString(),
    },
  ]);

  if (insertError) {
    // If there is an error inserting user data, delete the user from auth
    if (user?.id) {
      await supabaseServer.auth.admin.deleteUser(user.id);
    }

    return NextResponse.json({ error: insertError.message }, { status: 400 });
  }

  return NextResponse.json(
    { message: "User signed up successfully" },
    { status: 200 }
  );
}
