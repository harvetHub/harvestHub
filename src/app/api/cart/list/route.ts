import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/utils/supabase/client";
import { getUserId } from "@/utils/getUserId";


// GET /api/cart/list - Fetch all cart items for the authenticated user
export async function GET(req: NextRequest) {
  const userId = await getUserId(req);
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("shopping_cart")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    return NextResponse.json({ message: "Failed to fetch cart", error }, { status: 400 });
  }

  return NextResponse.json({ cart: data });
}