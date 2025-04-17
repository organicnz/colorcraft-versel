import { redirect } from "next/navigation";

export const metadata = {
  title: "Services Management",
  description: "Manage your services",
};

// This page now redirects to the services management path to avoid route conflicts
export default function ServicesPage() {
  redirect("/dashboard/services-management");
} 