import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Tag, User, MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';

export async function generateMetadata({ params }) {
  const project = await getProject(params.id);
  if (!project) return { title: 'Project Not Found | Color & Craft' };
  
  return {
    title: `${project.title} | Portfolio | Color & Craft`,
    description: project.brief_description,
  };
}

async function getProject(id) {
  const supabase = createClient();
  
  const { data: project, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching project:', error);
    return null;
  }
  
  return project;
}

export default async function ProjectDetailsPage({ params }) {
  const project = await getProject(params.id);
  
  if (!project) {
    notFound();
  }
  
  // Format the completion date if available
  const formattedDate = project.completion_date 
    ? format(new Date(project.completion_date), 'MMMM d, yyyy')
    : null;
  
  // Prepare techniques and materials arrays
  const techniques = project.techniques || [];
  const materials = project.materials || [];
  
  return (
    <div className="container py-12">
      <div className="mb-8">
        <Button variant="outline" size="sm" asChild className="mb-4">
          <Link href="/portfolio">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Portfolio
          </Link>
        </Button>
        
        <h1 className="text-4xl font-bold">{project.title}</h1>
        {project.is_featured && (
          <Badge className="bg-primary text-primary-foreground mt-2">Featured Project</Badge>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Main image gallery */}
          <div className="space-y-4">
            {/* Main image - first "after" image */}
            {project.after_images && project.after_images.length > 0 && (
              <div className="relative aspect-[16/9] overflow-hidden rounded-lg">
                <Image
                  src={project.after_images[0]}
                  alt={project.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 66vw"
                  priority
                />
              </div>
            )}
            
            {/* Before/After comparison */}
            {project.before_images && project.before_images.length > 0 && project.after_images && project.after_images.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-3">Before & After</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative aspect-square overflow-hidden rounded-lg">
                    <Image
                      src={project.before_images[0]}
                      alt={`${project.title} - Before`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">Before</span>
                    </div>
                  </div>
                  
                  <div className="relative aspect-square overflow-hidden rounded-lg">
                    <Image
                      src={project.after_images[0]}
                      alt={`${project.title} - After`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">After</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Additional images */}
            {project.after_images && project.after_images.length > 1 && (
              <div>
                <h2 className="text-xl font-semibold mb-3">More Photos</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {project.after_images.slice(1).map((img, index) => (
                    <div key={index} className="relative aspect-square overflow-hidden rounded-lg">
                      <Image
                        src={img}
                        alt={`${project.title} - view ${index + 2}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 33vw"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Project description */}
          <div>
            <h2 className="text-2xl font-semibold mb-3">About This Project</h2>
            <div className="prose prose-slate max-w-none">
              <p>{project.description || project.brief_description}</p>
            </div>
          </div>
          
          {/* Client testimonial */}
          {project.client_testimonial && (
            <div className="bg-muted/50 p-6 rounded-lg border">
              <h2 className="text-xl font-semibold mb-2">Client Testimonial</h2>
              <blockquote className="italic text-muted-foreground">
                "{project.client_testimonial}"
              </blockquote>
              {project.client_name && (
                <p className="mt-3 font-medium">— {project.client_name}</p>
              )}
            </div>
          )}
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-muted/30 p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Project Details</h2>
            
            {formattedDate && (
              <div className="flex items-start mb-3">
                <Calendar className="h-5 w-5 mr-2 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Completed On</p>
                  <p className="font-medium">{formattedDate}</p>
                </div>
              </div>
            )}
            
            {techniques.length > 0 && (
              <div className="flex items-start mb-3">
                <Tag className="h-5 w-5 mr-2 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Techniques</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {techniques.map((technique) => (
                      <Badge key={technique} variant="outline" className="text-xs">
                        {technique}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {materials.length > 0 && (
              <div className="flex items-start">
                <Tag className="h-5 w-5 mr-2 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Materials</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {materials.map((material) => (
                      <Badge key={material} variant="outline" className="text-xs">
                        {material}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* CTA */}
          <div className="bg-primary/10 p-6 rounded-lg border border-primary/20">
            <h2 className="text-xl font-semibold mb-2">Interested in a Similar Project?</h2>
            <p className="text-muted-foreground mb-4">
              We'd love to transform your furniture. Get in touch for a consultation.
            </p>
            <Button asChild className="w-full">
              <Link href="/contact">
                Contact Us
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 