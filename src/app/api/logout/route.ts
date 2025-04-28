import { NextResponse } from "next/server";
import { supabaseServer } from "@/utils/supabase/server";

export async function POST() {
  const { error } = await supabaseServer.auth.signOut();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(
    { message: "User logged out successfully" },
    { status: 200 }
  );
}
