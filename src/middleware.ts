import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  // Handle the portfolio-cards redirect
  if (request.nextUrl.pathname === "/portfolio-cards") {
    return NextResponse.redirect(new URL("/portfolio", request.url));
  }

  // Handle the CRM redirect if needed
  if (request.nextUrl.pathname === "/crm") {
    return NextResponse.redirect(new URL("/dashboard/crm", request.url));
  }

  // Handle the admin redirect
  if (request.nextUrl.pathname === "/admin") {
    return NextResponse.redirect(new URL("/dashboard/admin", request.url));
  }

  // Default response
  return NextResponse.next();
}

// Define which paths this middleware will run on
export const config = {
  matcher: ["/portfolio-cards", "/crm", "/admin", "/dashboard/:path*", "/account/:path*"],
};
