import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  // Validate input
  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 }
    );
  }

  // Authenticate the user
  const { data, error } = await supabaseServer.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // Set the session cookies
  const { session } = data;
  if (session) {
    const response = NextResponse.json(
      { message: "User logged in successfully", user: session.user },
      { status: 200 }
    );

    // Set Supabase session cookies
    supabaseServer.auth.setSession({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
    });

    return response;
  }

  return NextResponse.json(
    { error: "Failed to create a session" },
    { status: 500 }
  );
}
