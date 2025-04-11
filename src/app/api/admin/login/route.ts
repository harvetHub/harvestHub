import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/utils/supabase/server";

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
  const { data, error } = await supabaseServer.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // Check if the user has the admin role
  const { user, session } = data;
  if (user && user.user_metadata.role === "admin") {
    const response = NextResponse.json(
      { message: "Admin logged in successfully", user },
      { status: 200 }
    );

    // Set session cookies
    if (session) {
      response.cookies.set("sb-access-token", session.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });
      response.cookies.set("sb-refresh-token", session.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });
    }

    return response;
  }

  return NextResponse.json({ error: "Access denied" }, { status: 403 });
}
