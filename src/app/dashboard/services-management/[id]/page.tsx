import { Metadata } from "next";
import { ServiceForm } from "../_components/ServiceForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";

// Force dynamic rendering for this route to allow use of cookies
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Edit Service",
  description: "Update an existing service offering",
};

export default async function EditServicePage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();
  
  // Fetch the service data
  const { data: service, error } = await supabase
    .from("services")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !service) {
    notFound();
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Edit Service</CardTitle>
          <CardDescription>
            Update details for {service.title}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ServiceForm initialData={service} />
        </CardContent>
      </Card>
    </div>
  );
} 