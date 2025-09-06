import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

/**
 * Extracts user id from a JWT stored in an HTTP-only cookie named "auth-token".
 * Returns user id string or null if not present / invalid.
 */
export async function getUserId(req: NextRequest): Promise<string | null> {
  const cookie = req.cookies.get("auth-token")?.value;
  return getUserIdFromCookie(cookie);
}

/**
 * Pure helper that verifies a cookie value and returns the decoded id.
 * Exported so it can be used in server-side contexts that don't have NextRequest.
 */
export function getUserIdFromCookie(cookieValue?: string | null): string | null {
  if (!cookieValue) return null;
  try {
    const decoded = jwt.verify(cookieValue, process.env.JWT_SECRET as string) as { id?: string } | null;
    if (!decoded) return null;
    // prefer `id` property; adjust if your token uses a different claim
    // (e.g. sub, user_id) — update accordingly
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (decoded as any).id ?? null;
  } catch {
    return null;
  }
}