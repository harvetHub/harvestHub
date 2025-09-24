import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/utils/supabase/server";

// simple UUID v4 validator
const isValidUUID = (id?: string | null) =>
  typeof id === "string" &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

/**
 * Safer admin delete:
 * - First attempt to delete the DB row in `users` (so FK constraints block deletion)
 * - Only if DB delete succeeds, delete the Auth user via Supabase Admin API
 *
 * This avoids the situation where Auth is removed but DB row remains due to FK constraints.
 */
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get("user_id");

    if (!isValidUUID(user_id)) {
      return NextResponse.json(
        { error: "Valid user_id (UUID) is required." },
        { status: 400 }
      );
    }

    // 1) Attempt to delete DB record first. This will fail if there are FK constraints.
    const { data: dbDeleted, error: dbError } = await supabaseServer
      .from("users")
      .delete()
      .eq("user_id", user_id)
      .select();

    if (dbError) {
      // Common case: foreign key violation or other DB constraint blocking delete
      return NextResponse.json(
        {
          error: "Failed to delete DB user. Child rows or FK constraints may exist.",
          details: dbError.message,
          hint:
            "Either remove/cleanup referencing rows or alter FK to ON DELETE CASCADE / SET NULL. Admin delete aborted to avoid orphaning auth user.",
        },
        { status: 409 }
      );
    }

    if (!dbDeleted || (Array.isArray(dbDeleted) && dbDeleted.length === 0)) {
      // No DB row deleted — user not found in users table
      return NextResponse.json(
        { error: "User not found in database." },
        { status: 404 }
      );
    }

    // 2) DB deletion succeeded — now delete Supabase Auth user
    const { error: authError } = await supabaseServer.auth.admin.deleteUser(
      user_id as string
    );

    if (authError) {
      // DB row already removed; surface auth error so admin can act.
      return NextResponse.json(
        {
          error: "DB user deleted but failed to delete auth user.",
          details: authError.message,
          hint: "Auth user may need manual removal from Supabase dashboard or retry the admin delete.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "User deleted from database and auth.",
      deleted_db_rows: dbDeleted,
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Unexpected error" },
      { status: 500 }
    );
  }
}