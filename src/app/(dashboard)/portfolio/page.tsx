import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import PortfolioTable from "./_components/PortfolioTable";

export const metadata = {
  title: "Portfolio Management",
  description: "Manage your portfolio projects",
};

export default async function PortfolioManagementPage() {
  const supabase = createClient();
  
  // Get the current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/login");
  }
  
  // Check if the user is an admin or contributor
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();
  
  if (userError || !userData || (userData.role !== "admin" && userData.role !== "contributor")) {
    redirect("/dashboard");
  }
  
  // Fetch projects
  const { data: projects, error: projectsError } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });
  
  if (projectsError) {
    console.error("Error fetching projects:", projectsError);
  }
  
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Portfolio Management"
        text="Manage and organize your portfolio projects"
      />
      
      <div className="grid gap-8">
        <PortfolioTable projects={projects || []} />
      </div>
    </DashboardShell>
  );
} 