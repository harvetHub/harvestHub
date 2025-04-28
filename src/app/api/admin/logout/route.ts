import { NextResponse } from "next/server";
import { supabaseServer } from "@/utils/supabase/server";

export async function POST() {
  // Create a Supabase client with the request and response

  // Sign out the user
  const { error } = await supabaseServer.auth.signOut();

  if (error) {
    return NextResponse.json(
      { error: "Failed to log out. Please try again." },
      { status: 500 }
    );
  }

  // Clear the auth-token cookie
  const response = NextResponse.json(
    { message: "Logged out successfully" },
    { status: 200 }
  );

  response.cookies.set("auth-token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    expires: new Date(0),
  });

  return response;
}
