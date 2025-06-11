import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  console.warn(`🔍 [Middleware] Processing request to: ${pathname}`);

  const { supabase, response } = createClient(request);

  // Get the session to check authentication
  const {
    data: { session },
  } = await supabase.auth.getSession();

  console.warn(
    `🔍 [Middleware] Session status for ${pathname}: ${session ? `authenticated (${session.user.email})` : "not authenticated"}`
  );

  // Handle the portfolio-cards redirect
  if (request.nextUrl.pathname === "/portfolio-cards") {
    console.warn(`🔄 [Middleware] Redirecting /portfolio-cards to /portfolio`);
    return NextResponse.redirect(new URL("/portfolio", request.url));
  }

  // Handle the CRM redirect if needed
  if (request.nextUrl.pathname === "/crm") {
    console.warn(`🔄 [Middleware] Redirecting /crm to /dashboard/crm`);
    return NextResponse.redirect(new URL("/dashboard/crm", request.url));
  }

  // Handle the admin redirect
  if (request.nextUrl.pathname === "/admin") {
    console.warn(`🔄 [Middleware] Redirecting /admin to /dashboard/admin`);
    return NextResponse.redirect(new URL("/dashboard/admin", request.url));
  }

  // Protect dashboard routes
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    if (!session) {
      console.warn(
        `🚫 [Middleware] Blocking access to ${pathname} - not authenticated, redirecting to signin`
      );
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }

    console.warn(`✅ [Middleware] Allowing access to ${pathname} - user authenticated`);

    // Check user role for admin routes
    if (
      request.nextUrl.pathname.startsWith("/dashboard/admin") ||
      request.nextUrl.pathname.includes("/services-dash") ||
      request.nextUrl.pathname.includes("/portfolio-dash") ||
      request.nextUrl.pathname.includes("/services-management")
    ) {
      console.warn(`🔍 [Middleware] Checking admin role for ${pathname}`);

      try {
        const { data: userData } = await supabase
          .from("users")
          .select("role")
          .eq("id", session.user.id)
          .single();

        if (!userData || userData.role !== "admin") {
          console.warn(
            `🚫 [Middleware] Blocking admin access to ${pathname} - user role: ${userData?.role || "none"}`
          );
          return NextResponse.redirect(new URL("/dashboard", request.url));
        }

        console.warn(`✅ [Middleware] Allowing admin access to ${pathname} - user is admin`);
      } catch (error) {
        console.error(`💥 [Middleware] Error checking user role for ${pathname}:`, error);
        return NextResponse.redirect(new URL("/auth/signin", request.url));
      }
    }
  }

  // Protect account routes
  if (request.nextUrl.pathname.startsWith("/account")) {
    if (!session) {
      console.warn(
        `🚫 [Middleware] Blocking access to ${pathname} - not authenticated, redirecting to signin`
      );
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }

    console.warn(`✅ [Middleware] Allowing access to ${pathname} - user authenticated`);
  }

  console.warn(`✅ [Middleware] Request completed for ${pathname}`);
  // Return the response to continue the request
  return response;
}

// Define which paths this middleware will run on
export const config = {
  matcher: ["/portfolio-cards", "/crm", "/admin", "/dashboard/:path*", "/account/:path*"],
};
