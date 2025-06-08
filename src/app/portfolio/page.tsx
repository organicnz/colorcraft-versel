import { Suspense } from 'react';
import { Card } from '@/components/ui/card';
import EditorialButton from '@/components/portfolio/EditorialButton';
import PortfolioItem from '@/components/portfolio/PortfolioItem';
import { getPortfolioProjects } from '@/services/portfolio.service';

export const metadata = {
  title: 'Portfolio | Color & Craft',
  description: 'Explore our furniture restoration and transformation projects',
};

async function PortfolioGrid() {
  const projects = await getPortfolioProjects();

  if (!projects || projects.length === 0) {
    return (
      <div className="text-center py-16 border rounded-md bg-muted/30">
        <h2 className="text-2xl font-medium mb-2">No portfolio projects yet</h2>
        <p className="text-muted-foreground">
          Check back soon for our latest furniture restoration projects.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <PortfolioItem key={project.id} project={project} />
      ))}
    </div>
  );
}

export default async function PortfolioPage() {
  return (
    <div className="container py-12 relative">
      {/* Background glass effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50/30 via-transparent to-accent-50/30 pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary-100/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-accent-100/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        {/* Header with glass effect */}
        <div className="mb-12 text-center">
          <div className="inline-block mb-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 shadow-glass">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
              Our Portfolio
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover the stunning transformations we've created. Each piece tells a story of
              craftsmanship, creativity, and the magic of furniture restoration.
            </p>
          </div>
        </div>

        <Suspense fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="aspect-square bg-muted/30 animate-pulse" />
            ))}
          </div>
        }>
          <PortfolioGrid />
        </Suspense>

        {/* Editorial Button - Floating variant for all screens */}
        <EditorialButton variant="floating" />
      </div>
    </div>
  );
}