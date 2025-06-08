import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import PortfolioTable from "./_components/PortfolioTable";

export const dynamic = "force-dynamic";

export default async function PortfolioDashboardPage() {
  const supabase = createClient();

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return <div>Please sign in to view this page.</div>;
  }

  const { data: userResponse } = await supabase
    .from("users")
    .select("role")
    .eq("id", session.user.id)
    .single();

  if (!userResponse || userResponse.role !== "admin") {
    return <div>You do not have permission to view this page.</div>;
  }

  const { data: projects, error } = await supabase
    .from("portfolio")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching projects:", error);
    return <div>Error fetching projects. Please try again later.</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Portfolio Projects</h1>
        <Link href="/portfolio-dash/new">
          <Button>Add New Project</Button>
        </Link>
      </div>

      {projects?.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No projects yet. Add your first project!</p>
        </div>
      ) : (
        <PortfolioTable projects={projects || []} />
      )}
    </div>
  );
} 