import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusIcon } from "lucide-react";
import PortfolioTable from "../_components/PortfolioTable";
import { getPortfolioProjects } from "@/services/portfolio.service";
import type { Project } from "@/types/database.types";

// Force dynamic rendering due to Supabase auth using cookies
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Manage Portfolio | Dashboard",
  description: "Manage your portfolio projects",
};

export default async function DashboardPortfolioManagePage() {
  let projects: Project[] = [];
  let error: string | null = null;

  try {
    projects = await getPortfolioProjects({
      orderBy: [
        { column: "is_featured", ascending: false },
        { column: "completion_date", ascending: false },
      ],
    }) as Project[];
  } catch (err) {
    console.error("Error in dashboard portfolio page:", err);
    error = "Failed to load portfolio projects. Please try again.";
  }

  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Portfolio Projects</h1>
        <Button
          asChild
          className="bg-[#3ECF8E] hover:bg-[#38BC81] text-white border border-[#3ECF8E]/30 transition-all duration-300 hover:shadow-lg"
        >
          <Link href="/portfolio-dash/new">
            <PlusIcon className="mr-2 h-4 w-4" />
            Add New Project
          </Link>
        </Button>
      </div>

      {error ? (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-6">{error}</div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12 border rounded-md bg-muted/30">
          <h2 className="text-xl font-medium mb-2">No portfolio projects yet</h2>
          <p className="text-muted-foreground mb-4">
            Add your first project to showcase in your portfolio.
          </p>
          <Button
            asChild
            className="bg-[#3ECF8E] hover:bg-[#38BC81] text-white border border-[#3ECF8E]/30 transition-all duration-300 hover:shadow-lg"
          >
            <Link href="/portfolio-dash/new">
              <PlusIcon className="mr-2 h-4 w-4" />
              Add Your First Project
            </Link>
          </Button>
        </div>
      ) : (
        <PortfolioTable projects={projects} />
      )}
    </div>
  );
}
