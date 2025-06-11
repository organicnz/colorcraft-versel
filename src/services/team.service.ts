import { createClient } from "@/lib/supabase/server";
import type {
  TeamMember,
  CreateTeamMemberData,
  UpdateTeamMemberData,
  TeamFilters,
  TeamSortOptions,
} from "@/types/team";

export async function getTeamMembers(
  filters: TeamFilters = {},
  sort: TeamSortOptions = { field: "display_order", direction: "asc" }
): Promise<TeamMember[]> {
  const supabase = await createClient();

  let query = supabase.from("team").select("*");

  // Apply filters
  if (filters.is_featured !== undefined) {
    query = query.eq("is_featured", filters.is_featured);
  }

  if (filters.is_active !== undefined) {
    query = query.eq("is_active", filters.is_active);
  }

  if (filters.position) {
    query = query.ilike("position", `%${filters.position}%`);
  }

  // Apply sorting
  query = query.order(sort.field, { ascending: sort.direction === "asc" });

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching team members:", error);
    throw new Error(`Failed to fetch team members: ${error.message}`);
  }

  return data || [];
}

export async function getFeaturedTeamMembers(): Promise<TeamMember[]> {
  return getTeamMembers(
    { is_featured: true, is_active: true },
    { field: "display_order", direction: "asc" }
  );
}

export async function getTeamMemberById(id: string): Promise<TeamMember | null> {
  const supabase = await createClient();

  const { data, error } = await supabase.from("team").select("*").eq("id", id).single();

  if (error) {
    console.error("Error fetching team member:", error);
    return null;
  }

  return data;
}

export async function createTeamMember(memberData: CreateTeamMemberData): Promise<TeamMember> {
  const supabase = await createClient();

  const { data, error } = await supabase.from("team").insert(memberData).select().single();

  if (error) {
    console.error("Error creating team member:", error);
    throw new Error(`Failed to create team member: ${error.message}`);
  }

  return data;
}

export async function updateTeamMember(memberData: UpdateTeamMemberData): Promise<TeamMember> {
  const supabase = await createClient();

  const { id, ...updateData } = memberData;

  const { data, error } = await supabase
    .from("team")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating team member:", error);
    throw new Error(`Failed to update team member: ${error.message}`);
  }

  return data;
}

export async function deleteTeamMember(id: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.from("team").delete().eq("id", id);

  if (error) {
    console.error("Error deleting team member:", error);
    throw new Error(`Failed to delete team member: ${error.message}`);
  }
}

export async function toggleTeamMemberStatus(id: string, is_active: boolean): Promise<TeamMember> {
  return updateTeamMember({ id, is_active });
}

export async function toggleTeamMemberFeatured(
  id: string,
  is_featured: boolean
): Promise<TeamMember> {
  return updateTeamMember({ id, is_featured });
}

export async function reorderTeamMembers(memberIds: string[]): Promise<void> {
  const supabase = await createClient();

  // Update display_order for each member
  const updates = memberIds.map((id, index) =>
    supabase
      .from("team")
      .update({ display_order: index + 1 })
      .eq("id", id)
  );

  await Promise.all(updates);
}
