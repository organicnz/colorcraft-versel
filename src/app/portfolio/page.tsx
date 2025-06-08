import { createClient } from "@/lib/supabase/server";
import { PortfolioItem } from "@/components/portfolio/PortfolioItem";
import HeroSection from "@/components/shared/HeroSection";
import EditableContent from "@/components/shared/EditableContent";

export default async function PortfolioPage() {
  const supabase = createClient();

  // Fetch only published portfolio projects
  const { data: projects } = await supabase
    .from("portfolio")
    .select("*")
    .eq("is_published", true) // Only show published projects
    .order("created_at", { ascending: false });

  // Fetch editable content
  const { data: content } = await supabase
    .from("site_content")
    .select("*")
    .eq("id", "portfolio_intro")
    .single();

  const portfolioContent = content || {
    id: "portfolio_intro",
    title: "Our Portfolio",
    content: {
      text: "<p>Browse through our collection of furniture transformation projects. Each piece tells a story of renewal and creativity.</p>",
    },
  };

  return (
    <div className="container py-12">
      <HeroSection
        title="Our Portfolio"
        description="Browse our collection of completed furniture transformations"
        imageSrc="/images/portfolio-hero.jpg"
      />

      <div className="my-12">
        <EditableContent
          id="portfolio_intro"
          initialContent={{
            title: portfolioContent.title,
            content: portfolioContent.content.text,
          }}
        />
      </div>

      {projects && projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <PortfolioItem key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Published Projects Yet</h3>
          <p className="text-gray-600">
            Check back soon to see our latest furniture transformations!
          </p>
        </div>
      )}
    </div>
  );
}
