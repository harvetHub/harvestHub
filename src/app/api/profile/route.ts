import { supabase } from "@/utils/supabase/client";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// Helper to get user id from HTTP-only cookie
async function getUserId(req: NextRequest) {
  const cookie = req.cookies.get("auth-token")?.value;
  if (!cookie) return null;

  try {
    const decoded = jwt.verify(cookie, process.env.JWT_SECRET as string) as { id: string };
    return decoded.id;
  } catch {
    return null;
  }
}

// GET /api/profile - Fetch user profile
export async function GET(req: NextRequest) {
  const userId = await getUserId(req);
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("user_id", userId)
    .single();

 

  if (error || !data) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}

// PUT /api/profile - Update user profile
export async function PUT(req: NextRequest) {
  const userId = await getUserId(req);
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const updates = await req.json();

  const { data, error } = await supabase
    .from("users")
    .update(updates)
    .eq("user_id", userId)
    .select()
    .single();



  if (error || !data) {
    return NextResponse.json({ message: "Failed to update profile" }, { status: 400 });
  }

  return NextResponse.json({ message: "Profile updated", user: data });
}