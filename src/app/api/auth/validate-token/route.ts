import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function GET(req: NextRequest) {
  // 1) Fast path: validate our custom auth-token cookie
  const token = req.cookies.get("auth-token")?.value;
  if (token && JWT_SECRET) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      return NextResponse.json({ user: decoded, refreshed: false }, { status: 200 });
    } catch {
      // fall through to refresh attempt
    }
  }

  // 2) Attempt to refresh via Supabase refresh token (if available)
  const refreshToken = req.cookies.get("supabase-refresh-token")?.value;
  if (!refreshToken || !SUPABASE_URL || !SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const tokenUrl = `${SUPABASE_URL.replace(/\/$/, "")}/auth/v1/token`;
    const res = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        apikey: SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Refresh failed" }, { status: 401 });
    }

    const data = await res.json().catch(() => null);
    const user = data?.user ?? null;
    if (!user) {
      return NextResponse.json({ error: "Invalid refresh response" }, { status: 401 });
    }

    // 3) Issue a new auth-token JWT (server-side) to keep existing flows working
    if (!JWT_SECRET) {
      return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
    }
    const newAuthToken = jwt.sign(
      { id: user.id, email: user.email, role: user?.user_metadata?.role ?? null },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 4) Return response and set rotated cookies (access + refresh + auth-token)
    const response = NextResponse.json({ user, refreshed: true }, { status: 200 });

    if (data?.access_token) {
      response.cookies.set("supabase-access-token", data.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: Number(data.expires_in) || 3600,
      });
    }

    // rotate refresh token if provided, otherwise keep existing (but set if returned)
    if (data?.refresh_token) {
      response.cookies.set("supabase-refresh-token", data.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        // keep a longer lifetime; you may customize this
        maxAge: 14 * 24 * 60 * 60,
      });
    }

    // set our custom auth-token so subsequent fast-path checks succeed
    response.cookies.set("auth-token", newAuthToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60,
    });

    return response;
  } catch (err) {
    console.error("validate-token refresh error:", err);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
