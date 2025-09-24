import { NextResponse } from "next/server";
import { supabaseServer } from "@/utils/supabase/server";

export async function GET() {
    const { data, error } = await supabaseServer.rpc("get_order_statuses");
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ statuses: data ?? [] });
}
