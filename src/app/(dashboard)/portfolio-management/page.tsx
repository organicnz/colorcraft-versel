import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import PortfolioTable from "../portfolio/_components/PortfolioTable";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

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
      >
        <Button asChild>
          <Link href="/dashboard/portfolio/new" className="flex items-center">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Project
          </Link>
        </Button>
      </DashboardHeader>
      
      <div className="grid gap-8">
        <PortfolioTable projects={projects || []} />
      </div>
    </DashboardShell>
  );
} 