import { NextRequest, NextResponse } from "next/server";
import { supabaseServerClient } from "@/utils/supabase/server";

export async function GET() {
  const { data, error } = await supabaseServerClient.from("users").select("*");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ users: data }, { status: 200 });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, role } = body;

  if (!name || !email || !role) {
    return NextResponse.json(
      { error: "All fields are required." },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseServerClient
    .from("users")
    .insert([{ name, email, role }]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ message: "User added successfully.", user: data });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, name, email, role } = body;

  if (!id || !name || !email || !role) {
    return NextResponse.json(
      { error: "All fields are required." },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseServerClient
    .from("users")
    .update({ name, email, role })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({
    message: "User updated successfully.",
    user: data,
  });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const user_id = searchParams.get("user_id");

  if (!user_id) {
    return NextResponse.json(
      { error: "User ID is required." },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseServerClient
    .from("users")
    .delete()
    .eq("id", user_id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({
    message: "User deleted successfully.",
    user: data,
  });
}
