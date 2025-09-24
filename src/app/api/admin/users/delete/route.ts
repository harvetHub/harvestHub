import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/utils/supabase/server";

// simple UUID v4 validator
const isValidUUID = (id?: string | null) =>
  typeof id === "string" &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get("user_id");

    if (!isValidUUID(user_id)) {
      return NextResponse.json({ error: "Valid user_id (UUID) is required." }, { status: 400 });
    }

    // 1) Delete user from Supabase Auth (requires service-role key client)
    const { error: authError } = await supabaseServer.auth.admin.deleteUser(user_id as string);
    if (authError) {
      return NextResponse.json({ error: authError.message || "Failed to delete auth user." }, { status: 400 });
    }

    // 2) If auth delete succeeded, remove DB record(s)
    
    const { data, error: dbError } = await supabaseServer
      .from("users")
      .delete()
      .eq("user_id", user_id);

    if (dbError) {
      // Auth is already deleted — surface the DB error
      return NextResponse.json(
        { error: "Auth deleted but failed to delete DB record.", details: dbError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "User deleted from auth and database.",
      deleted_rows: data ?? null,
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Unexpected error" }, { status: 500 });
  }
}