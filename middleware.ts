import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const isAuthenticated = !!token;

  // Get the pathname of the request
  const path = req.nextUrl.pathname;

  // Define routes that require authentication
  const protectedRoutes = ["/dashboard"];

  // Define routes that are only for guests (non-authenticated users)
  const authRoutes = ["/login", "/register"];

  // Check if the path starts with a protected route
  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route)
  );

  // Check if the path starts with an auth route
  const isAuthRoute = authRoutes.some((route) => path === route);

  // If the route is protected and the user is not authenticated, redirect to login
  if (isProtectedRoute && !isAuthenticated) {
    const url = new URL("/login", req.url);
    url.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(url);
  }

  // If the route is for non-authenticated users only and the user is authenticated, redirect to dashboard
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Otherwise, continue
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all protected routes
    "/dashboard/:path*",
    // Match auth routes
    "/login",
    "/register",
  ],
};
