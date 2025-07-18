import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import PortfolioForm from "@/components/forms/PortfolioForm";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditPortfolioPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (!project) {
    notFound();
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Edit Project</h1>
      <PortfolioForm />
    </div>
  );
} 