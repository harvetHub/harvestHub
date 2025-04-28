import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("auth-token");

  // Define protected routes
  const protectedRoutes = [
    "/admin/dashboard",
    "/admin/inventory",
    "/admin/orders",
    "/admin/products",
    "/admin/users",
  ];

  // Check if the route is protected
  if (protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    try {
      // Verify the JWT
      if (!JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
      }
      jwt.verify(token?.value || "", JWT_SECRET);
    } catch (err) {
      console.error("Invalid token:", err);
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/dashboard/:path*",
    "/admin/inventory/:path*",
    "/admin/orders/:path*",
    "/admin/products/:path*",
    "/admin/users/:path*",
  ],
};
