import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import ServiceForm from "../_components/ServiceForm";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function NewServicePage() {
  const supabase = await createClient();

  // Check if user is logged in
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/auth/signin");
  }

  // Get user role
  const { data: userWithRole } = await supabase
    .from("users")
    .select("role")
    .eq("id", session.user.id)
    .single();

  // Ensure only admins can access
  if (!userWithRole || userWithRole.role !== "admin") {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Add New Service</h1>
      <ServiceForm />
    </div>
  );
}
