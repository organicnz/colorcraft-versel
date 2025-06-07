import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import Image from 'next/image';
import EditorialButton from '@/components/portfolio/EditorialButton';
import { getPortfolioProjects } from '@/services/portfolio.service';

export const metadata = {
  title: 'Portfolio | Color & Craft',
  description: 'Explore our furniture restoration and transformation projects',
};

export default async function PortfolioPage() {
  // Fetch real portfolio projects from the database
  let projects = [];
  let error = null;
  try {
    // Fetch all published projects, ordered by featured first, then by completion date
    projects = await getPortfolioProjects({
      orderBy: [
        { column: 'is_featured', ascending: false },
        { column: 'completion_date', ascending: false },
        { column: 'created_at', ascending: false }
      ]
    });
  } catch (err) {
    console.error('Error fetching portfolio projects:', err);
    error = 'Unable to load portfolio projects. Please try again later.';
  }

  return (
    <div className="container py-12">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Portfolio</h1>
            <p className="text-muted-foreground text-lg">
              Our recent furniture restoration and transformation projects
            </p>
          </div>

          {/* Inline Editorial Button for header */}
          <EditorialButton variant="inline" className="hidden md:flex" />
        </div>
      </div>

      {error ? (
        <div className="bg-destructive/10 text-destructive p-6 rounded-md mb-8">
          <h3 className="font-semibold mb-2">Error Loading Portfolio</h3>
          <p>{error}</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-16 border rounded-md bg-muted/30">
          <h2 className="text-2xl font-medium mb-2">No portfolio projects yet</h2>
          <p className="text-muted-foreground">
            Check back soon for our latest furniture restoration projects.
          </p>
        </div>
      ) : (
        <>
          {/* Featured Projects */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Featured Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.filter(project => project.is_featured).map((project) => (
                <FeaturedProjectCard key={project.id} project={project} />
              ))}
            </div>

            {projects.filter(project => project.is_featured).length === 0 && (
              <p className="text-muted-foreground text-center py-8">
                No featured projects available yet.
              </p>
            )}
          </div>

          {/* All Projects */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">All Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        </>
      )}

      {/* Floating Editorial Button */}
      <EditorialButton variant="floating" />
    </div>
  );
}

// Update the component props to match the real database structure
type ProjectType = {
  id: string;
  title: string;
  brief_description: string;
  description?: string;
  before_images: string[];
  after_images: string[];
  techniques?: string[];
  materials?: string[];
  completion_date?: string;
  client_name?: string;
  client_testimonial?: string;
  is_featured: boolean;
  created_at: string;
  updated_at?: string;
};

function FeaturedProjectCard({ project }: { project: ProjectType }) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md h-full flex flex-col">
      <div className="relative h-64 bg-muted w-full">
        {project.after_images?.[0] && (
          <Image
            src={project.after_images[0]}
            alt={project.title}
            fill
            priority={true}
            className="object-cover"
          />
        )}
        <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 text-xs rounded">
          Featured
        </div>
      </div>
      <CardHeader>
        <CardTitle className="line-clamp-1">{project.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground mb-4 line-clamp-2">{project.brief_description}</p>
        
        {project.techniques && project.techniques.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {project.techniques.map((technique, i) => (
              <Badge key={i} variant="outline" className="text-xs">
                {technique}
              </Badge>
            ))}
          </div>
        )}
        
        <div className="flex justify-end mt-auto pt-4">
          <Link 
            href={`/portfolio/${project.id}`}
            className="text-sm font-medium text-primary hover:text-primary/80"
          >
            View Project →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

function ProjectCard({ project }: { project: ProjectType }) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="relative aspect-[4/3] bg-muted w-full">
        {project.after_images?.[0] && (
          <Image
            src={project.after_images[0]}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        )}
      </div>
      <CardHeader>
        <CardTitle className="line-clamp-1">{project.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4 line-clamp-2">{project.brief_description}</p>
        
        {project.techniques && project.techniques.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {project.techniques.slice(0, 3).map((technique, i) => (
              <Badge key={i} variant="outline" className="text-xs">
                {technique}
              </Badge>
            ))}
            {project.techniques.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{project.techniques.length - 3} more
              </Badge>
            )}
          </div>
        )}
        
        <div className="flex justify-between items-center">
          {project.completion_date && (
            <span className="text-xs text-muted-foreground">
              {new Date(project.completion_date).toLocaleDateString('en-US', {
                month: 'short',
                year: 'numeric'
              })}
            </span>
          )}
          <Link 
            href={`/portfolio/${project.id}`}
            className="text-sm font-medium text-primary hover:text-primary/80"
          >
            View →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
} 