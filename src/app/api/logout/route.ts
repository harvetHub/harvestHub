import { NextResponse } from "next/server";
import { supabaseServerClient } from "@/utils/supabase/server";

export async function POST() {
  const { error } = await supabaseServerClient.auth.signOut();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(
    { message: "User logged out successfully" },
    { status: 200 }
  );
}
