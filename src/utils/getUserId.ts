import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";


// Helper to get user id from HTTP-only cookie
export async function getUserId(req: NextRequest) {
  const cookie = req.cookies.get("auth-token")?.value;
  if (!cookie) return null;
  try {
    const decoded = jwt.verify(cookie, process.env.JWT_SECRET as string) as { id: string };
    return decoded.id;
  } catch {
    return null;
  }
}