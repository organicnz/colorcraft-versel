import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import UserRoleManagement from "./_components/UserRoleManagement";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export const metadata = {
  title: "User Management",
  description: "Manage user roles and permissions",
};

export default async function AdminUsersPage() {
  const supabase = createClient();
  
  // Get the current user
  const { data: { user: currentUser } } = await supabase.auth.getUser();
  
  if (!currentUser) {
    redirect("/auth/signin");
  }
  
  // Check if the current user is an admin
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("role")
    .eq("id", currentUser.id)
    .single();
  
  if (userError || !userData || userData.role !== "admin") {
    redirect("/dashboard");
  }
  
  // Fetch all users
  const { data: users, error: usersError } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false });
  
  if (usersError) {
    console.error("Error fetching users:", usersError);
    // We'll still render the page but with an empty array
  }
  
  return (
    <DashboardShell>
      <DashboardHeader
        heading="User Management"
        text="View and manage user roles and permissions"
      />
      
      <div className="grid gap-8">
        <UserRoleManagement 
          users={users || []} 
          currentUserId={currentUser.id} 
        />
      </div>
    </DashboardShell>
  );
} 