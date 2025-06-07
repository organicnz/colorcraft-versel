import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServiceById } from "@/actions/servicesActions";
import { ServiceForm } from "@/app/(dashboard)/services-management/_components/ServiceForm";

export const metadata: Metadata = {
  title: "Edit Service",
  description: "Update an existing service",
};

export default async function EditServicePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  
  // Fetch the service data
  const { data: service, error } = await getServiceById(id);
  
  if (error || !service) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Edit Service</h1>
        <p className="text-muted-foreground mt-2">
          Update the details for {service.title}
        </p>
      </div>
      
      <ServiceForm initialData={service} isEditing={true} />
    </div>
  );
} 