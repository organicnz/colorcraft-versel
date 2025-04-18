import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import PortfolioForm from "../../_components/PortfolioForm";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export const dynamic = "force-dynamic";

interface EditProjectPageProps {
  params: {
    id: string;
  };
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const { id } = params;
  const supabase = createServerComponentClient({ cookies });
  
  // Check if user is logged in
  const { data: { session } } = await supabase.auth.getSession();
  
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
  
  // Fetch project data
  const { data: project, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();
    
  if (error || !project) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error?.message || "Project not found"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Edit Project: {project.title}</h1>
      <PortfolioForm initialData={project} isEditing={true} />
    </div>
  );
} 