import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import PortfolioTable from "./_components/PortfolioTable";

export const metadata = {
  title: "Portfolio Management",
  description: "Manage your portfolio projects",
};

// This page now redirects to the portfolio management path to avoid route conflicts
export default function PortfolioPage() {
  redirect("/dashboard/portfolio-management");
} 