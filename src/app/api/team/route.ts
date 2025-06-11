import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getTeamMembers, createTeamMember } from "@/services/team.service";
import type { CreateTeamMemberData } from "@/types/team";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const is_featured = searchParams.get("featured");
    const is_active = searchParams.get("active");

    const filters = {
      ...(is_featured !== null && { is_featured: is_featured === "true" }),
      ...(is_active !== null && { is_active: is_active === "true" }),
    };

    const teamMembers = await getTeamMembers(filters);

    return NextResponse.json(teamMembers);
  } catch (error) {
    console.error("Error fetching team members:", error);
    return NextResponse.json({ error: "Failed to fetch team members" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createClient();

    // Check if user is admin
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: user } = await supabase
      .from("users")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const data: CreateTeamMemberData = await request.json();

    // Validate required fields
    if (!data.full_name || !data.position) {
      return NextResponse.json({ error: "Name and position are required" }, { status: 400 });
    }

    const newMember = await createTeamMember(data);

    return NextResponse.json(newMember, { status: 201 });
  } catch (error) {
    console.error("Error creating team member:", error);
    return NextResponse.json({ error: "Failed to create team member" }, { status: 500 });
  }
}
