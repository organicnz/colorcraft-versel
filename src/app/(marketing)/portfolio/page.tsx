import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Portfolio | Color & Craft Furniture Painting',
  description: 'View our collection of beautifully restored and painted furniture projects - Color & Craft Furniture Painting Services',
};

async function getProjects() {
  const supabase = createClient();
  
  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .order('is_featured', { ascending: false }) // Featured projects first
    .order('completion_date', { ascending: false }); // Then most recent projects
  
  if (error) {
    console.error('Error fetching projects:', error);
    throw new Error('Failed to fetch portfolio projects');
  }
  
  return projects || [];
}

export default async function PortfolioPage() {
  let projects = [];
  
  try {
    projects = await getProjects();
  } catch (error) {
    console.error('Error in portfolio page:', error);
    // We'll keep the empty projects array and show a message below
  }
  
  return (
    <div className="container py-12 mx-auto">
      <div className="space-y-4 mb-8">
        <h1 className="text-4xl font-bold tracking-tighter">Our Portfolio</h1>
        <p className="text-xl text-muted-foreground">
          Browse through our carefully curated collection of furniture transformation projects. 
          Each piece tells a unique story of restoration and creativity.
        </p>
      </div>
      
      {projects.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-medium mb-2">No projects to display yet</h2>
          <p className="text-muted-foreground">
            We're working on adding our portfolio projects. Please check back soon!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="overflow-hidden flex flex-col h-full">
              <div className="relative h-64 w-full">
                {project.after_images && project.after_images[0] ? (
                  <Image
                    src={project.after_images[0]}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <p className="text-muted-foreground">No image available</p>
                  </div>
                )}
                {project.is_featured && (
                  <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
                    Featured
                  </div>
                )}
              </div>
              
              <CardHeader>
                <CardTitle>{project.title}</CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1">
                <p className="text-muted-foreground line-clamp-3">{project.brief_description}</p>
                
                {(project.techniques?.length > 0 || project.materials?.length > 0) && (
                  <div className="mt-4 space-y-2">
                    {project.techniques?.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {project.techniques.map((technique, i) => (
                          <span key={i} className="bg-secondary text-secondary-foreground px-2 py-1 rounded-sm text-xs">
                            {technique}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
              
              <CardFooter>
                <Button variant="secondary" asChild className="w-full">
                  <Link href={`/portfolio/${project.id}`}>View Details</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 