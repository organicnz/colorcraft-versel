import { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ServicesTable } from "./_components/ServicesTable";

export const metadata: Metadata = {
  title: "Services Management",
  description: "Manage your services portfolio",
};

export default async function ServicesManagementPage() {
  const cookieStore = cookies();
  const supabase = await createClient();

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="max-w-5xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold">Services Management</h1>
        <p className="mt-4">Please sign in to manage your services.</p>
      </div>
    );
  }

  // Fetch user role
  const { data: userData } = await supabase.from("users").select("role").eq("id", user.id).single();

  const isAdmin = userData?.role === "admin";

  // Fetch services
  const { data: services, error } = await supabase.from("services").select("*").order("title");

  if (error) {
    console.error("Error fetching services:", error);
    return (
      <div className="max-w-5xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold">Services Management</h1>
        <p className="text-red-500 mt-4">Error loading services. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Services Management</h1>
          <p className="text-muted-foreground mt-2">Manage the services you offer to clients</p>
        </div>

        {isAdmin && (
          <Link href="/dashboard/services-management/new" passHref>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New Service
            </Button>
          </Link>
        )}
      </div>

      {services.length === 0 ? (
        <div className="bg-muted/40 rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium">No services found</h3>
          <p className="text-muted-foreground mt-2">Get started by adding your first service.</p>
          {isAdmin && (
            <Link href="/dashboard/services-management/new" passHref>
              <Button className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Add New Service
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <ServicesTable services={services} isAdmin={isAdmin} />
      )}
    </div>
  );
}
