import { createClient } from "@/lib/supabase/server";
import { getPortfolioProjects } from "@/services/portfolio.service";
import PortfolioItem from "@/components/portfolio/PortfolioItem";
import PortfolioTabs from "@/components/portfolio/PortfolioTabs";

// Force dynamic rendering for authentication checks
export const dynamic = 'force-dynamic';

export default async function PortfolioPage() {
  const supabase = await createClient();

  // Check if user is admin
  let isAdmin = false;

  try {
    const { data: { session } } = await supabase.auth.getSession();

    if (session) {
      const { data: userData } = await supabase
        .from("users")
        .select("role")
        .eq("id", session.user.id)
        .single();

      isAdmin = userData?.role === "admin";
    }
  } catch (error) {
    console.error("Error checking user session:", error);
    // Continue as non-admin user
  }

  // If admin, show tabs with different views
  if (isAdmin) {
    return <PortfolioTabs />;
  }

  // For public users, get only published portfolio items using the service
  // This ensures proper array parsing of before_images and after_images
  const projects = await getPortfolioProjects({});

  // Filter to only published projects for public view
  const publishedProjects = projects.filter(project => project.status === 'published');

  return (
    <div className="container py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Our Portfolio</h1>
        <p className="text-lg text-gray-600">
          Browse our collection of completed furniture transformations
        </p>
      </div>

      {publishedProjects && publishedProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {publishedProjects.map((project) => (
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
