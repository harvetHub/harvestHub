import { NextResponse } from "next/server";
import { supabaseServer } from "@/utils/supabase/server";

export async function POST() {
  const { error } = await supabaseServer.auth.signOut();

  const status = error ? 400 : 200;
  const body = error
    ? { error: error.message }
    : { message: "User logged out successfully" };

  const res = NextResponse.json(body, { status });

  // Clear common auth/session cookies so client is fully signed out
  const cookiesToClear = [
    "auth-token",
    "supabase-access-token",
    "supabase-refresh-token", 
  ];

  cookiesToClear.forEach((name) =>
    res.cookies.set(name, "", {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0,
    })
  );

  return res;
}
