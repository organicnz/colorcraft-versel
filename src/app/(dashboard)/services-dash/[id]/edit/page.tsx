import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import ServiceForm from "../../_components/ServiceForm";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { getServiceById } from "@/actions/servicesActions";

export const dynamic = "force-dynamic";

export default async function EditServicePage({
  params,
}: {
  params: { id: string };
}) {
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
      <div className="container py-10">
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

  // Fetch the service
  const { data: service, error } = await getServiceById(params.id);
  
  if (error || !service) {
    return (
      <div className="container py-10">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error || "Service not found"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Edit Service</h1>
        <p className="text-muted-foreground mt-2">
          Update the details of your service
        </p>
      </div>
      <div className="bg-card p-6 rounded-lg shadow-sm">
        <ServiceForm service={service} />
      </div>
    </div>
  );
} 