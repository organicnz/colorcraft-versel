import { createClient } from "@/lib/supabase/server";
import PortfolioItem from "@/components/portfolio/PortfolioItem";

export default async function PortfolioPage() {
  const supabase = createClient();

  // Fetch only published portfolio projects
  const { data: projects } = await supabase
    .from("portfolio")
    .select("*")
    .eq("is_published", true) // Only show published projects
    .order("created_at", { ascending: false });

  return (
    <div className="container py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Our Portfolio</h1>
        <p className="text-lg text-gray-600">
          Browse our collection of completed furniture transformations
        </p>
      </div>

      {projects && projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <PortfolioItem key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Published Projects Yet
          </h3>
          <p className="text-gray-600">
            Check back soon to see our latest furniture transformations!
          </p>
        </div>
      )}
    </div>
  );
}
