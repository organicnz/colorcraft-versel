import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import TeamManagementTable from "./_components/TeamManagementTable";
import { getTeamMembers } from "@/services/team.service";

export default async function TeamManagementPage() {
  let teamMembers = [];
  let error = null;

  try {
    teamMembers = await getTeamMembers();
  } catch (err) {
    console.error("Error loading team members:", err);
    error = "Failed to load team members.";
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Team Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage team members displayed on your website
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/team/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Team Member
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-4">
          <div className="text-2xl font-bold">{teamMembers.length}</div>
          <div className="text-muted-foreground">Total Members</div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="text-2xl font-bold">
            {teamMembers.filter((m: any) => m.is_featured).length}
          </div>
          <div className="text-muted-foreground">Featured Members</div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="text-2xl font-bold">
            {teamMembers.filter((m: any) => m.is_active).length}
          </div>
          <div className="text-muted-foreground">Active Members</div>
        </div>
      </div>

      {/* Team Table */}
      <div className="rounded-lg border bg-card">
        <Suspense fallback={<div className="p-8 text-center">Loading team members...</div>}>
          {error ? (
            <div className="p-8 text-center text-red-600">{error}</div>
          ) : (
            <TeamManagementTable initialData={teamMembers} />
          )}
        </Suspense>
      </div>
    </div>
  );
}
