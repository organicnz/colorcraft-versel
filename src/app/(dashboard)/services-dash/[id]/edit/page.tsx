import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { ServiceForm } from "../../_components/ServiceForm";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const dynamic = "force-dynamic";

export default async function EditServicePage({
  params
}: {
  params: { id: string }
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
      <div className="max-w-3xl mx-auto py-8 px-4">
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
  const { data: service, error: serviceError } = await supabase
    .from("services")
    .select("*")
    .eq("id", params.id)
    .single();
  
  if (serviceError || !service) {
    notFound();
  }
  
  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Edit Service</h1>
        <p className="text-muted-foreground mt-1">
          Update the details of your service
        </p>
      </div>
      
      <ServiceForm initialData={service} />
    </div>
  );
} 