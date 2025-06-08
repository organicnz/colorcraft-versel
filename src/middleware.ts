import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request);

  // Get the session to check authentication
  const {
    data: { session },
  } = await supabase.auth.getSession();

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

  // Protect dashboard routes
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    if (!session) {
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }

    // Check user role for admin routes
    if (
      request.nextUrl.pathname.startsWith("/dashboard/admin") ||
      request.nextUrl.pathname.includes("/services-dash") ||
      request.nextUrl.pathname.includes("/portfolio-dash") ||
      request.nextUrl.pathname.includes("/services-management")
    ) {
      try {
        const { data: userData } = await supabase
          .from("users")
          .select("role")
          .eq("id", session.user.id)
          .single();

        if (!userData || userData.role !== "admin") {
          return NextResponse.redirect(new URL("/dashboard", request.url));
        }
      } catch (error) {
        console.error("Error checking user role:", error);
        return NextResponse.redirect(new URL("/auth/signin", request.url));
      }
    }
  }

  // Protect account routes
  if (request.nextUrl.pathname.startsWith("/account")) {
    if (!session) {
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }
  }

  // Return the response to continue the request
  return response;
}

// Define which paths this middleware will run on
export const config = {
  matcher: ["/portfolio-cards", "/crm", "/admin", "/dashboard/:path*", "/account/:path*"],
};
