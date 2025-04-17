import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { getPortfolioProjects } from '@/services/portfolio.service';

export const metadata = {
  title: 'Portfolio | Color & Craft',
  description: 'Explore our collection of furniture transformations and restorations',
};

export default async function PortfolioPage() {
  const projects = await getPortfolioProjects();
  
  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Our Portfolio</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Browse through our collection of furniture transformation projects. Each piece tells a story of renewal and creativity.
        </p>
      </div>
      
      {projects.length === 0 ? (
        <div className="text-center py-12 border rounded-md bg-muted/30">
          <h2 className="text-xl font-medium mb-2">Portfolio Currently Unavailable</h2>
          <p className="text-muted-foreground mb-4">
            We're updating our portfolio. Please check back soon to see our latest work.
          </p>
          <Button asChild>
            <Link href="/contact">Contact Us</Link>
          </Button>
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
                  {project.featured && (
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