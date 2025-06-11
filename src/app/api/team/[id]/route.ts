import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getTeamMemberById, updateTeamMember, deleteTeamMember } from "@/services/team.service";
import type { UpdateTeamMemberData } from "@/types/team";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

async function checkAdminAuth() {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    return { authorized: false, status: 401, message: "Unauthorized" };
  }

  const { data: user } = await supabase
    .from("users")
    .select("role")
    .eq("id", session.user.id)
    .single();

  if (!user || user.role !== "admin") {
    return { authorized: false, status: 403, message: "Forbidden" };
  }

  return { authorized: true };
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const member = await getTeamMemberById(id);

    if (!member) {
      return NextResponse.json({ error: "Team member not found" }, { status: 404 });
    }

    return NextResponse.json(member);
  } catch (error) {
    console.error("Error fetching team member:", error);
    return NextResponse.json({ error: "Failed to fetch team member" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const authCheck = await checkAdminAuth();
    if (!authCheck.authorized) {
      return NextResponse.json({ error: authCheck.message }, { status: authCheck.status });
    }

    const { id } = await params;
    const data = await request.json();

    // Validate that the team member exists
    const existingMember = await getTeamMemberById(id);
    if (!existingMember) {
      return NextResponse.json({ error: "Team member not found" }, { status: 404 });
    }

    const updateData: UpdateTeamMemberData = {
      id,
      ...data,
    };

    const updatedMember = await updateTeamMember(updateData);

    return NextResponse.json(updatedMember);
  } catch (error) {
    console.error("Error updating team member:", error);
    return NextResponse.json({ error: "Failed to update team member" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const authCheck = await checkAdminAuth();
    if (!authCheck.authorized) {
      return NextResponse.json({ error: authCheck.message }, { status: authCheck.status });
    }

    const { id } = await params;

    // Validate that the team member exists
    const existingMember = await getTeamMemberById(id);
    if (!existingMember) {
      return NextResponse.json({ error: "Team member not found" }, { status: 404 });
    }

    await deleteTeamMember(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting team member:", error);
    return NextResponse.json({ error: "Failed to delete team member" }, { status: 500 });
  }
}
