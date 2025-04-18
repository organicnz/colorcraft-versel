import { createPublicClient } from "@/utils/supabase/public";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Portfolio | Color & Craft",
  description: "View our finished furniture restoration and painting projects",
};

export default async function PortfolioPage() {
  let projects = [];
  let error = null;

  try {
    const supabase = createPublicClient();
    
    const { data, error: fetchError } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (fetchError) {
      error = fetchError;
      console.error("Error fetching projects:", error);
    } else {
      projects = data || [];
    }
  } catch (err) {
    console.error("Failed to fetch projects:", err);
    error = err;
  }

  return (
    <main className="container py-12 md:py-20">
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Portfolio</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Browse through our completed furniture painting and restoration projects
        </p>
      </section>

      {projects.length === 0 && !error && (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">No portfolio projects available at the moment.</p>
        </div>
      )}

      {error && (
        <div className="text-center py-12 bg-muted/30 rounded-lg p-8">
          <h3 className="text-xl font-medium mb-2">Temporarily Unavailable</h3>
          <p className="text-muted-foreground mb-4">
            We're currently updating our portfolio. Please check back soon or contact us directly.
          </p>
          <Button asChild>
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="overflow-hidden">
            <div className="aspect-video relative overflow-hidden">
              {project.after_images && project.after_images[0] ? (
                <Image
                  src={project.after_images[0]}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <p className="text-muted-foreground">No image available</p>
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <h2 className="text-xl font-bold mb-2 line-clamp-1">{project.title}</h2>
              <p className="text-muted-foreground line-clamp-2 mb-4">
                {project.brief_description || project.description}
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link href={`/portfolio/${project.id}`}>View Project</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
} 