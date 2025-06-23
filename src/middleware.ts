import { type NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Temporarily disabled to debug 404 loop.
  return NextResponse.next();
}

export const config = {
  matcher: [
    // We keep the matcher to avoid running on static files,
    // but the middleware itself does nothing.
    "/((?!api|_next/static|_next/image|favicon.ico|images|sitemap.xml|robots.txt).*)"
  ],
};
