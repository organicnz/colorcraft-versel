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

// Temporary sample data for testing
const SAMPLE_PROJECTS = [
  {
    id: '1',
    title: 'Victorian Dresser Restoration',
    description: 'Complete restoration of a 1920s Victorian dresser with custom chalk paint finish',
    image_url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
    category: 'restoration',
    featured: true,
    status: 'completed',
    created_at: '2024-01-15',
    updated_at: '2024-01-15'
  },
  {
    id: '2',
    title: 'Modern Coffee Table Makeover',
    description: 'Transformed a dated coffee table with geometric patterns and bold colors',
    image_url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
    category: 'upcycling',
    featured: true,
    status: 'completed',
    created_at: '2024-01-10',
    updated_at: '2024-01-10'
  },
  {
    id: '3',
    title: 'Antique Chair Revival',
    description: 'Breathing new life into a classic antique chair with period-appropriate techniques',
    image_url: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800',
    category: 'restoration',
    featured: false,
    status: 'completed',
    created_at: '2024-01-05',
    updated_at: '2024-01-05'
  }
];

function ProjectCard({ project }: { project: any }) {
  return (
    <Link href={`/portfolio/${project.id}`}>
      <Card className="overflow-hidden group hover:shadow-lg transition-shadow cursor-pointer">
        <div className="aspect-square relative overflow-hidden">
          <Image
            src={project.image_url || project.after_images?.[0] || '/images/placeholder.jpg'}
            alt={project.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {project.featured && (
            <Badge className="absolute top-3 left-3" variant="secondary">
              Featured
            </Badge>
          )}
        </div>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-xs">
              {project.category || 'restoration'}
            </Badge>
          </div>
          <CardTitle className="text-lg">{project.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            {project.description || project.brief_description}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}

export default async function PortfolioPage() {
  let projects = [];
  let error = null;

  try {
    // Try to fetch real data first
    projects = await getPortfolioProjects();
    console.log('Portfolio fetch successful:', projects?.length || 0);
  } catch (e: any) {
    console.error('Portfolio fetch error:', e.message);
    error = e.message;
    // Fallback to sample data for now
    projects = SAMPLE_PROJECTS;
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

          {/* Editorial Button - Inline variant for larger screens */}
          <EditorialButton variant="inline" className="hidden md:flex" />
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-yellow-800 text-sm">
            <strong>Note:</strong> Using sample data due to database connection issue: {error}
          </p>
        </div>
      )}

      <Suspense fallback={
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-square bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      }>
        {projects && projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border rounded-md bg-muted/30">
            <h2 className="text-2xl font-medium mb-2">No portfolio projects yet</h2>
            <p className="text-muted-foreground">
              Check back soon for our latest furniture restoration projects.
            </p>
          </div>
        )}
      </Suspense>

      {/* Editorial Button - Floating variant for all screens */}
      <EditorialButton variant="floating" />
    </div>
  );
} 