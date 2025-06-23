import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/middleware";

const isAdminRoute = (pathname: string) =>
  pathname.startsWith("/dashboard/admin") ||
  pathname.startsWith("/services-management") ||
  pathname.startsWith("/portfolio-management");

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { supabase, response } = createClient(request);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Handle vanity URL redirects
  if (pathname === "/portfolio-cards") {
    return NextResponse.redirect(new URL("/portfolio", request.url));
  }
  if (pathname === "/crm") {
    return NextResponse.redirect(new URL("/dashboard/crm", request.url));
  }
  if (pathname === "/admin") {
    return NextResponse.redirect(new URL("/dashboard/admin", request.url));
  }

  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isAccountRoute = pathname.startsWith("/account");
  const isAuthRoute = pathname.startsWith("/auth");

  // Unauthenticated user logic
  if (!session) {
    if (isDashboardRoute || isAccountRoute) {
      const redirectUrl = new URL("/auth/signin", request.url);
      if (pathname !== "/") {
        redirectUrl.searchParams.set("next", pathname);
      }
      return NextResponse.redirect(redirectUrl);
    }
    return response;
  }

  // Authenticated user logic
  if (session) {
    // Redirect from auth routes to the dashboard
    if (isAuthRoute) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    // Handle admin role checks for dashboard routes
    if (isDashboardRoute && isAdminRoute(pathname)) {
      const { data: user } = await supabase
        .from("users")
        .select("role")
        .eq("id", session.user.id)
        .single();
      if (user?.role !== "admin") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (public images)
     * - sitemap.xml, robots.txt (SEO files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|images|sitemap.xml|robots.txt).*)"
  ],
};
