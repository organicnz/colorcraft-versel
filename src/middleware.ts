import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const pathname = request.nextUrl.pathname;

  // Create a Supabase client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => request.cookies.get(name)?.value,
        set: (name, value, options) => {
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove: (name, options) => {
          response.cookies.set({
            name,
            value: "",
            ...options,
            maxAge: 0,
          });
        },
      },
    }
  );

  // Get session once
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // For non-authenticated users, handle public routes and protected routes
  if (!session) {
    // Protect dashboard routes
    if (pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }

    // Protect account routes
    if (pathname.startsWith("/account")) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }

    // Handle public portfolio and services routes
    if (pathname === "/portfolio" || pathname.startsWith("/portfolio/")) {
      const targetPath =
        pathname === "/portfolio" ? "/(marketing)/portfolio" : `/(marketing)${pathname}`;
      return NextResponse.rewrite(new URL(targetPath, request.url));
    }

    if (pathname === "/services") {
      return NextResponse.rewrite(new URL("/(marketing)/services", request.url));
    }

    return response;
  }

  // For authenticated users, fetch role information once
  let userRole: string | null = null;

  // Only query user role if necessary (for dashboard/portfolio/services routes)
  const needsRoleCheck =
    pathname.startsWith("/dashboard") || pathname === "/portfolio" || pathname === "/services";

  if (needsRoleCheck) {
    const { data: userData } = await supabase
      .from("users")
      .select("role")
      .eq("id", session.user.id)
      .single();

    userRole = userData?.role || null;
  }

  // Handle admin-specific routes and redirects
  if (pathname.startsWith("/dashboard") && userRole !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // For services, redirect to dashboard version if admin
  if (pathname === "/services" && userRole === "admin") {
    return NextResponse.redirect(new URL("/dashboard/services", request.url));
  }

  // For authenticated users who aren't admins, use marketing routes
  if ((pathname === "/portfolio" || pathname.startsWith("/portfolio/")) && userRole !== "admin") {
    const targetPath =
      pathname === "/portfolio" ? "/(marketing)/portfolio" : `/(marketing)${pathname}`;
    return NextResponse.rewrite(new URL(targetPath, request.url));
  }

  if (pathname === "/services" && userRole !== "admin") {
    return NextResponse.rewrite(new URL("/(marketing)/services", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/account/:path*", "/portfolio", "/portfolio/:path*", "/services"],
};
