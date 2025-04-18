import { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ServicesTable } from "./_components/ServicesTable";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { PlusCircle } from "lucide-react";

export const metadata = {
  title: "Services Management",
  description: "Manage your service offerings",
};

export default async function ServicesManagementPage() {
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
  
  // Fetch services
  const { data: services, error: servicesError } = await supabase
    .from("services")
    .select("*")
    .order("created_at", { ascending: false });
  
  if (servicesError) {
    console.error("Error fetching services:", servicesError);
  }
  
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Services Management"
        text="Manage and organize your service offerings"
      >
        <Button asChild>
          <Link href="/services-dash/new" className="flex items-center">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Service
          </Link>
        </Button>
      </DashboardHeader>
      
      <div className="grid gap-8">
        {!services || services.length === 0 ? (
          <div className="text-center py-12 border rounded-md bg-muted/30">
            <h2 className="text-xl font-medium mb-2">No services added yet</h2>
            <p className="text-muted-foreground mb-4">
              Add your first service to display on your website.
            </p>
            <Button asChild>
              <Link href="/services-dash/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Your First Service
              </Link>
            </Button>
          </div>
        ) : (
          <ServicesTable services={services} />
        )}
      </div>
    </DashboardShell>
  );
} 