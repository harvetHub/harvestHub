import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/utils/supabase/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET; // Ensure this is set in your environment variables
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not set");
}

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  // Perform server-side validation
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
  const { user } = data;
  if (user && user.user_metadata.role === "admin") {
    // Create a JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.user_metadata.role,
      },
      JWT_SECRET as string,
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    // Set the JWT as an HTTP-only cookie
    const response = NextResponse.json(
      { message: "Admin logged in successfully", user },
      { status: 200 }
    );

    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 3600, // 1 hour
    });

    return response;
  }

  return NextResponse.json({ error: "Access denied" }, { status: 403 });
}
