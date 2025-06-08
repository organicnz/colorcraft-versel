import { createClient } from "@/lib/supabase/server";
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
  const supabase = createClient();
  
  // Get current session (middleware already checks auth, but we need user info)
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect("/auth/signin");
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