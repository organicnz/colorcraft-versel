import { createClient } from "@/lib/supabase/server";
import { getPortfolioProjects } from "@/services/portfolio.service";
import PortfolioItem from "@/components/portfolio/PortfolioItem";
import PortfolioTabs from "@/components/portfolio/PortfolioTabs";
import { Button } from "@/components/ui/button";
import { Plus, Palette, Sparkles } from "lucide-react";
import Link from "next/link";

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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-amber-600 via-orange-600 to-red-500">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-24">
          <div className="text-center text-white">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
                <Palette className="h-12 w-12" />
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
              Our <span className="text-amber-200">Portfolio</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              Discover the artistry behind each furniture transformation.
              From vintage restorations to modern makeovers, every piece tells a story.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white/90 backdrop-blur-md text-orange-600 hover:bg-white hover:shadow-2xl font-semibold px-8 py-3 rounded-full shadow-xl transition-all duration-300 border border-white/50"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Explore Collection
              </Button>
              {isAdmin && (
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white/20 hover:text-white font-semibold px-8 py-3 rounded-full shadow-lg transition-all duration-300"
                >
                  <Link href="/portfolio-dash/new">
                    <Plus className="mr-2 h-5 w-5" />
                    Create New Project
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
        {/* Decorative wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1200 120" className="w-full h-auto text-amber-50">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="currentColor"></path>
          </svg>
        </div>
      </div>

      {/* Portfolio Grid Section */}
      <div className="container mx-auto px-4 py-20">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="text-center p-8 bg-white/60 backdrop-blur-md border border-white/30 rounded-2xl shadow-lg hover:shadow-xl hover:bg-white/70 transition-all duration-300">
            <div className="text-4xl font-bold text-orange-600 mb-2">{publishedProjects.length}+</div>
            <div className="text-gray-600 font-medium">Projects Completed</div>
          </div>
          <div className="text-center p-8 bg-white/60 backdrop-blur-md border border-white/30 rounded-2xl shadow-lg hover:shadow-xl hover:bg-white/70 transition-all duration-300">
            <div className="text-4xl font-bold text-orange-600 mb-2">100%</div>
            <div className="text-gray-600 font-medium">Client Satisfaction</div>
          </div>
          <div className="text-center p-8 bg-white/60 backdrop-blur-md border border-white/30 rounded-2xl shadow-lg hover:shadow-xl hover:bg-white/70 transition-all duration-300">
            <div className="text-4xl font-bold text-orange-600 mb-2">5+</div>
            <div className="text-gray-600 font-medium">Years Experience</div>
          </div>
        </div>

        {/* Portfolio Grid */}
        {publishedProjects && publishedProjects.length > 0 ? (
          <>
            <div className="text-center mb-16">
              <div className="flex flex-col md:flex-row items-center justify-between mb-8">
                <div className="text-center md:text-left">
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Transformations</h2>
                  <p className="text-xl text-gray-600 max-w-2xl">
                    Each piece is carefully restored and transformed with attention to detail and craftsmanship
                  </p>
                </div>
                {isAdmin && (
                  <div className="mt-6 md:mt-0">
                    <Button
                      asChild
                      size="lg"
                      className="bg-orange-600/90 hover:bg-orange-700/90 backdrop-blur-md text-white font-semibold px-6 py-3 rounded-full shadow-lg border border-orange-500/30 transition-all duration-300 hover:shadow-xl"
                    >
                      <Link href="/portfolio-dash/new">
                        <Plus className="mr-2 h-5 w-5" />
                        Add New Project
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {publishedProjects.map((project, index) => (
                <div
                  key={project.id}
                  className="w-full"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <PortfolioItem project={project} />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <div className="bg-white/70 backdrop-blur-md border border-white/30 rounded-3xl p-12 max-w-2xl mx-auto shadow-xl hover:bg-white/80 transition-all duration-300">
              <div className="mb-8">
                <div className="bg-orange-200/60 backdrop-blur-sm p-6 rounded-full w-24 h-24 mx-auto flex items-center justify-center border border-orange-300/30">
                  <Palette className="h-12 w-12 text-orange-600" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                No Published Projects Yet
              </h3>
              <p className="text-lg text-gray-600 mb-8">
                We're currently working on amazing furniture transformations.
                Check back soon to see our latest creations!
              </p>
              {isAdmin && (
                <Button asChild size="lg" className="bg-orange-600/90 hover:bg-orange-700/90 backdrop-blur-md shadow-lg">
                  <Link href="/portfolio-dash/new">
                    <Plus className="mr-2 h-5 w-5" />
                    Create First Project
                  </Link>
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Furniture?
          </h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Let's bring new life to your beloved pieces. Contact us today for a consultation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-white/90 backdrop-blur-md text-orange-600 hover:bg-white hover:shadow-2xl font-semibold px-8 py-4 rounded-full shadow-xl border border-white/50 transition-all duration-300"
            >
              <Link href="/contact">
                Get Free Quote
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white/20 hover:text-white font-semibold px-8 py-4 rounded-full shadow-lg transition-all duration-300"
            >
              <Link href="/about">
                Learn More
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Floating Action Button for Admins */}
      {isAdmin && (
        <div className="fixed bottom-8 right-8 z-50">
          <Button
            asChild
            size="lg"
            className="h-16 w-16 p-0 bg-orange-600/95 hover:bg-orange-700/95 backdrop-blur-md text-white rounded-full shadow-2xl border border-orange-500/30 transition-all duration-300 hover:shadow-3xl hover:scale-110 group"
          >
            <Link href="/portfolio-dash/new" className="flex items-center justify-center h-full w-full">
              <Plus className="h-8 w-8 group-hover:rotate-90 transition-transform duration-300" />
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
