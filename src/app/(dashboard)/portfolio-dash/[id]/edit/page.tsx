import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import PortfolioForm from "../../_components/PortfolioForm";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export const dynamic = "force-dynamic";

type EditProjectPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  // Await params since they're now a Promise in Next.js 15
  const { id } = await params;
  const supabase = await createClient();
  
  // Get current session (middleware already checks auth, but we need user info)
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect("/auth/signin");
  }
  
  // Fetch project data
  const { data: project, error } = await supabase
    .from("portfolio")
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