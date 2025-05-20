import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "./lib/auth"

export async function middleware(request: NextRequest) {
  // Get URL path
  const path = request.nextUrl.pathname;
  
  // Protected routes that require authentication
  const isProtectedRoute = 
    path.startsWith("/dashboard") ||
    path.startsWith("/invoices") ||
    path.startsWith("/email-templates") ||
    path.startsWith("/clients") ||
    path.startsWith("/automation") ||
    path.startsWith("/analytics") ||
    path.startsWith("/settings");
  
  if (isProtectedRoute) {
    // Get the token from the cookies
    const token = request.cookies.get("auth_token")?.value;

    // If there's no token, redirect to login
    if (!token) {
      // Create the URL manually without using constructor
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Verify the token
    const payload = await verifyToken(token);

    // If the token is invalid, redirect to login
    if (!payload) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Continue with the request
  return NextResponse.next()
}
