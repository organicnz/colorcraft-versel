import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { getServiceById } from "@/actions/servicesActions";
import { ServiceForm } from "@/app/(dashboard)/services-management/_components/ServiceForm";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Edit Service",
  description: "Update an existing service",
};

export const dynamic = "force-dynamic";

type EditServicePageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditServicePage({ params }: EditServicePageProps) {
  // Await params since they're now a Promise in Next.js 15
  const { id } = await params;
  const supabase = await createClient();

  // Get current session (middleware already checks auth, but we need user info)
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/auth/signin");
  }

  // Fetch the service
  const { data: service, error } = await getServiceById(id);

  if (error || !service) {
    return (
      <div className="container py-10">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error || "Service not found"}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Edit Service</h1>
        <p className="text-muted-foreground mt-2">Update the details of your service</p>
      </div>
      <div className="bg-card p-6 rounded-lg shadow-sm">
        <ServiceForm initialData={service} isEditing={true} />
      </div>
    </div>
  );
}
