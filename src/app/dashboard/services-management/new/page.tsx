import { Metadata } from "next";
import { ServiceForm } from "@/app/(dashboard)/services-management/_components/ServiceForm";

export const metadata: Metadata = {
  title: "Add New Service",
  description: "Add a new service to your portfolio",
};

export default function NewServicePage() {
  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Add New Service</h1>
        <p className="text-muted-foreground mt-2">Create a new service offering for your clients</p>
      </div>

      <ServiceForm />
    </div>
  );
}
