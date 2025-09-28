import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

/**
 * Get authenticated user id from request.
 *
 * Flow:
 * 1. Try to verify our custom auth-token cookie (fast path).
 * 2. If missing/invalid, try to refresh Supabase session using the
 *    supabase-refresh-token cookie and the Supabase token endpoint.
 *    If refresh succeeds, return the user id from Supabase response.
 *
 * Note: this helper returns the user id for server-side handlers. It
 * does not set cookies on the response — consider creating a dedicated
 * refresh endpoint that also rotates/sets cookies if you want to keep
 * browser cookies in sync.
 */
export async function getUserId(req: NextRequest): Promise<string | null> {
  const jwtSecret = process.env.JWT_SECRET as string | undefined;

  // 1) Try custom auth-token cookie (if you issue one)
  const authCookie = req.cookies.get("auth-token")?.value;
  if (authCookie && jwtSecret) {
    try {
      const decoded = jwt.verify(authCookie, jwtSecret) as { id?: string } | null;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const id = (decoded as any)?.id ?? null;
      if (id) return String(id);
    } catch {
      // fall through to refresh attempt
    }
  }

  // 2) Attempt to refresh via Supabase refresh token (server-side)
  const refreshToken = req.cookies.get("supabase-refresh-token")?.value;
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!refreshToken || !SUPABASE_URL || !SERVICE_ROLE_KEY) {
    return null;
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
      return null;
    }

    const data = await res.json().catch(() => null);
    // Supabase token response includes `user` payload
    const userId = data?.user?.id ?? null;
    if (userId) return String(userId);

    // As a fallback, try decoding returned access_token if present
    const accessToken = data?.access_token;
    if (accessToken) {
      try {
        const decodedAccess = jwt.decode(accessToken) as { sub?: string } | null;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const sub = (decodedAccess as any)?.sub ?? null;
        if (sub) return String(sub);
      } catch {
        // ignore
      }
    }

    return null;
  } catch {
    return null;
  }
}