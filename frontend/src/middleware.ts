import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Izuzimanje statičkih resursa i javnih mrežnih vodova
  const { pathname } = request.nextUrl;
  if (
    pathname.startsWith("/_next") || 
    pathname.startsWith("/api") || 
    pathname === "/login" || 
    pathname === "/register"
  ) {
    return NextResponse.next();
  }

  // Provera postojanja sesije preko klijentskog kolačića (Cookie)
  const token = request.cookies.get("token")?.value;

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Konfiguracija ruter presretača nad celim dashboard prstenom
export const config = {
  matcher: ["/dashboard/:path*", "/"],
};
