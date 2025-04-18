import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCircle, PlusCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ServicesTable } from "./_components/ServicesTable";

export const dynamic = "force-dynamic";

export default async function ServicesDashboardPage() {
  const supabase = createServerComponentClient({ cookies });
  
  // Check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect("/auth/signin");
  }
  
  // Check if user is admin
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("role")
    .eq("id", session.user.id)
    .single();
  
  if (userError || !userData || userData.role !== "admin") {
    return (
      <div className="max-w-5xl mx-auto py-8 px-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You don't have permission to access this page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  // Fetch services
  const { data: services, error: servicesError } = await supabase
    .from("services")
    .select("*")
    .order("created_at", { ascending: false });
  
  if (servicesError) {
    return (
      <div className="max-w-5xl mx-auto py-8 px-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load services: {servicesError.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Services Management</h1>
        <Link href="/dashboard/services-dash/new">
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add New Service
          </Button>
        </Link>
      </div>
      
      {services && services.length > 0 ? (
        <ServicesTable services={services} />
      ) : (
        <div className="text-center py-12 border rounded-md bg-muted/20">
          <p className="text-muted-foreground mb-4">No services found.</p>
          <Link href="/dashboard/services-dash/new">
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Your First Service
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
} 