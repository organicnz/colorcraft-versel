import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Sign out the user
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error signing out:", error);
    }

    // Create response that redirects to home page
    const response = NextResponse.redirect(new URL("/", request.url));

    // Clear any auth-related cookies
    response.cookies.set("sb-access-token", "", {
      maxAge: 0,
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    response.cookies.set("sb-refresh-token", "", {
      maxAge: 0,
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    console.error("Unexpected error during sign out:", error);
    // Even if there's an error, redirect to home page
    return NextResponse.redirect(new URL("/", request.url));
  }
}
