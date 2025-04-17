import React from 'react';
import { createClient } from '@/lib/supabase/server';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

export const metadata = {
  title: 'Portfolio | Color & Craft',
  description: 'Explore our collection of furniture transformations and restorations',
};

async function getProjects() {
  const supabase = createClient();
  
  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching projects:', error);
    throw new Error('Failed to fetch portfolio projects');
  }
  
  return projects || [];
}

export default async function PortfolioPage() {
  let projects = [];
  let error = null;
  
  try {
    projects = await getProjects();
  } catch (err) {
    console.error('Error in portfolio page:', err);
    error = 'Failed to load portfolio projects. Please try again.';
  }
  
  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Our Portfolio</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Browse through our collection of furniture transformation projects. Each piece tells a story of renewal and creativity.
        </p>
      </div>
      
      {error ? (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-6">
          {error}
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12 border rounded-md bg-muted/30">
          <h2 className="text-xl font-medium mb-2">No portfolio projects yet</h2>
          <p className="text-muted-foreground mb-4">
            Check back soon for our latest furniture transformations.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="group overflow-hidden flex flex-col h-full transition-all hover:shadow-lg">
              <CardHeader className="p-0">
                <div className="aspect-square overflow-hidden relative">
                  <Image
                    src={project.after_images?.[0] || '/images/placeholder.jpg'}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {project.is_featured && (
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-primary text-primary-foreground">Featured</Badge>
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="p-4 flex-grow">
                <h2 className="text-xl font-bold mb-2 line-clamp-1">{project.title}</h2>
                <p className="text-muted-foreground mb-4 line-clamp-2">{project.brief_description}</p>
                
                {project.techniques && project.techniques.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {project.techniques.slice(0, 3).map((technique) => (
                      <Badge key={technique} variant="outline" className="text-xs">
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
              </CardContent>
              
              <CardFooter className="px-4 pb-4 pt-0 mt-auto">
                <Button asChild className="w-full" variant="outline">
                  <Link href={`/portfolio/${project.id}`} className="w-full flex items-center justify-center">
                    View Details
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 