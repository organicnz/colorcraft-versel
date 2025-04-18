import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ServiceForm } from "../_components/ServiceForm";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const dynamic = "force-dynamic";

export default async function NewServicePage() {
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
  
  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Add New Service</h1>
        <p className="text-muted-foreground mt-1">
          Create a new service to offer to your clients
        </p>
      </div>
      
      <ServiceForm />
    </div>
  );
} 