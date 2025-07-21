import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/utils/supabase/client";
import { getUserId } from "@/utils/getUserId";

// GET /api/cart/count - Get cart item count for authenticated user
export async function GET(req: NextRequest) {
  const userId = await getUserId(req);
  if (!userId) {
    return NextResponse.json({ count: 0, message: "Unauthorized" }, { status: 401 });
  }

  const { count, error } = await supabase
    .from("shopping_cart")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  if (error) {
    return NextResponse.json({ count: 0, message: "Failed to fetch count", error }, { status: 400 });
  }

  return NextResponse.json({ count });
}