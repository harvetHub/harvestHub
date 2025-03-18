import { NextRequest, NextResponse } from "next/server";
import { supabaseServerClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  // Perform server-side validation if needed
  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 }
    );
  }

  // Authenticate the user with Supabase
  const { data, error } = await supabaseServerClient.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // Check if the user has the admin role
  const user = data.user;
  if (user && user.user_metadata.role === "admin") {
    return NextResponse.json(
      { message: "Admin logged in successfully", data },
      { status: 200 }
    );
  }

  return NextResponse.json({ error: "Access denied" }, { status: 403 });
}
