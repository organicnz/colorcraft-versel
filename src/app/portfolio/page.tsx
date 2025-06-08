import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import EditorialButton from '@/components/portfolio/EditorialButton';
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
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}

function ProjectCard({ project }: { project: any }) {
  return (
    <Link href={`/portfolio/${project.id}`} className="group">
      <Card
        glass={true}
        glassVariant="light"
        glassIntensity="medium"
        className="overflow-hidden hover:shadow-glass-heavy transition-all duration-300 hover:scale-[1.02] group"
      >
        <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-950 dark:to-accent-950">
          <Image
            src={project.image_url || project.after_images?.[0] || '/images/placeholder.jpg'}
            alt={project.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Glass overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Featured badge with glass effect */}
          {project.featured && (
            <div className="absolute top-3 left-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-3 py-1">
              <Badge variant="secondary" className="bg-transparent border-0 text-white font-medium">
                Featured
              </Badge>
            </div>
          )}

          {/* Hover overlay content */}
          <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-white/10 backdrop-blur-md rounded-lg border border-white/20 p-3">
              <p className="text-white text-sm font-medium mb-1">View Project</p>
              <p className="text-white/80 text-xs">Click to see transformation details</p>
            </div>
          </div>
        </div>

        <CardHeader className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="outline" className="text-xs bg-white/50 backdrop-blur-sm border-white/30">
              {project.category || 'restoration'}
            </Badge>
          </div>
          <CardTitle className="text-lg group-hover:text-primary transition-colors">
            {project.title}
          </CardTitle>
        </CardHeader>

        <CardContent className="relative z-10">
          <p className="text-muted-foreground text-sm line-clamp-2">
            {project.description || project.brief_description}
          </p>

          {/* Techniques badges with glass effect */}
          {project.techniques && project.techniques.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {project.techniques.slice(0, 2).map((technique, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-xs bg-primary-100/50 text-primary-800 dark:bg-primary-900/30 dark:text-primary-200 backdrop-blur-sm border border-primary-200/30"
                >
                  {technique}
                </Badge>
              ))}
              {project.techniques.length > 2 && (
                <Badge
                  variant="outline"
                  className="text-xs bg-white/30 backdrop-blur-sm border-white/30"
                >
                  +{project.techniques.length - 2}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
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
              <Card key={i} glass={true} className="aspect-square bg-muted/30 animate-pulse" />
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