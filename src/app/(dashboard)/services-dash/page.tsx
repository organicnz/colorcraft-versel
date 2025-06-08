import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import ServicesTable from "./_components/ServicesTable";

export const dynamic = "force-dynamic";

export default async function ServicesDashboardPage() {
  const supabase = createClient();
  
  // Check if user is logged in
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect("/auth/signin");
  }
  
  // Get user role
  const { data: userWithRole } = await supabase
    .from("users")
    .select("role")
    .eq("id", session.user.id)
    .single();
    
  // Ensure only admins can access
  if (!userWithRole || userWithRole.role !== "admin") {
    notFound();
  }
  
  // Fetch services
  const { data: services, error } = await supabase
    .from("services")
    .select("*")
    .order("created_at", { ascending: false });
    
  if (error) {
    console.error("Error fetching services:", error);
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Services Dashboard</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          Error loading services. Please try again later.
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Services Dashboard</h1>
        <Link href="/services-dash/new">
          <Button>Add New Service</Button>
        </Link>
      </div>
      
      {services && services.length > 0 ? (
        <ServicesTable services={services} />
      ) : (
        <div className="rounded-md border p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">No services yet</h2>
          <p className="text-muted-foreground mb-4">
            Start by adding your first service to showcase to your clients.
          </p>
          <Link href="/services-dash/new">
            <Button>Add Your First Service</Button>
          </Link>
        </div>
      )}
    </div>
  );
} 