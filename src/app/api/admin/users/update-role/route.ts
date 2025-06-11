import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// Force dynamic handling for this API route
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check if the user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized: You must be logged in" }, { status: 401 });
    }

    // Check if the user is an admin
    const { data: currentUser, error: currentUserError } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (currentUserError || !currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin privileges required" }, { status: 403 });
    }

    // Parse the request body
    const body = await request.json();
    const { userId, role } = body;

    if (!userId || !role) {
      return NextResponse.json({ error: "Bad Request: Missing required fields" }, { status: 400 });
    }

    // Verify the role is valid
    const validRoles = ["admin", "contributor", "customer"];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: "Bad Request: Invalid role" }, { status: 400 });
    }

    // Prevent updating own role
    if (userId === user.id) {
      return NextResponse.json(
        { error: "Forbidden: Cannot change your own role" },
        { status: 403 }
      );
    }

    // Update the user's role
    const { error: updateError } = await supabase.from("users").update({ role }).eq("id", userId);

    if (updateError) {
      console.error("Error updating user role:", updateError);
      return NextResponse.json({ error: "Failed to update user role" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "User role updated successfully" });
  } catch (error) {
    console.error("Error in update-role API route:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
