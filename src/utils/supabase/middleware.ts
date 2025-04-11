import { type NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "./server";

export const updateSession = async (request: NextRequest) => {
  try {
    const response = NextResponse.next();

    // Use the custom supabaseServer instance
    const supabase = supabaseServer;

    // Refresh session if expired
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    console.log("Middleware session:", session); // Debugging session data
    console.log("Middleware error:", error); // Debugging errors

    // Define protected routes
    const protectedRoutes = [
      "/dashboard",
      "/inventory",
      "/orders",
      "/products",
      "/users",
    ];

    // Redirect to login if accessing a protected route without authentication
    if (
      protectedRoutes.some((route) =>
        request.nextUrl.pathname.startsWith(route)
      ) &&
      (!session || error)
    ) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    // Redirect authenticated users from the login page to the dashboard
    if (request.nextUrl.pathname === "/admin" && session) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return response;
  } catch (err) {
    console.error("Error in middleware:", err);

    // Handle errors (e.g., missing environment variables)
    return NextResponse.next();
  }
};
