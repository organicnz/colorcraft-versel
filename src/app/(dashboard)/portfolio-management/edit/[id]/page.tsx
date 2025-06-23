import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import PortfolioForm from "@/components/forms/PortfolioForm";

export default async function EditPortfolioPage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!project) {
    notFound();
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Edit Project</h1>
      <PortfolioForm project={project} />
    </div>
  );
} 