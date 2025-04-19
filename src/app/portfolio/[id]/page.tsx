import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { createPublicClient } from "@/utils/supabase/public";
import { ArrowLeft, Calendar } from "lucide-react";

// Force dynamic rendering for this route to allow proper data fetching
export const dynamic = 'force-dynamic';

type Props = {
  params: { id: string };
};

// Dynamic metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createPublicClient();
  
  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", params.id)
    .single();
  
  if (!project) {
    return {
      title: "Project Not Found | Color & Craft",
      description: "The requested project could not be found",
    };
  }
  
  return {
    title: `${project.title} | Color & Craft Portfolio`,
    description: project.brief_description || "View this furniture restoration project by Color & Craft",
  };
}

// Helper function to get related projects
async function getRelatedProjects(projectId: string, techniques: string[] = []) {
  try {
    const supabase = createPublicClient();
    
    const { data } = await supabase
      .from("projects")
      .select("id, title, brief_description, after_images")
      .neq("id", projectId)
      .order("created_at", { ascending: false })
      .limit(3);
    
    return data || [];
  } catch (error) {
    console.error("Error fetching related projects:", error);
    return [];
  }
}

export default async function ProjectDetailsPage({ params }: Props) {
  const supabase = createPublicClient();
  
  const { data: project, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", params.id)
    .single();
  
  if (error || !project) {
    console.error("Error fetching project:", error);
    notFound();
  }
  
  // Format the completion date if available
  const formattedDate = project.completion_date 
    ? new Date(project.completion_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : null;

  // Get related projects (using techniques for better relevance)
  const relatedProjects = await getRelatedProjects(params.id, project.techniques);
  
  return (
    <div className="container py-12">
      {/* Back link */}
      <div className="mb-8">
        <Button variant="ghost" asChild className="pl-0">
          <Link href="/portfolio" className="flex items-center">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Portfolio
          </Link>
        </Button>
      </div>
      
      {/* Project Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
        {project.location && (
          <p className="text-muted-foreground mb-4">Location: {project.location}</p>
        )}
        
        {/* Featured badge */}
        {project.featured && (
          <Badge className="bg-primary text-primary-foreground mb-4">Featured Project</Badge>
        )}
        
        {/* Tags */}
        {project.techniques && project.techniques.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {project.techniques.map((technique) => (
              <Badge key={technique} variant="outline">
                {technique}
              </Badge>
            ))}
          </div>
        )}
        
        {/* Project brief */}
        <p className="text-lg">{project.brief_description}</p>
      </div>
      
      {/* Before/After Gallery */}
      {(project.before_images?.length > 0 || project.after_images?.length > 0) && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Before & After</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Before Images */}
            {project.before_images && project.before_images.length > 0 ? (
              <div>
                <h3 className="text-lg font-medium mb-3">Before</h3>
                <div className="grid gap-4">
                  {project.before_images.map((image, index) => (
                    <div key={`before-${index}`} className="relative aspect-video overflow-hidden rounded-lg">
                      <Image
                        src={image}
                        alt={`${project.title} before ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-medium mb-3">Before</h3>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">No before images available</p>
                </div>
              </div>
            )}
            
            {/* After Images */}
            {project.after_images && project.after_images.length > 0 ? (
              <div>
                <h3 className="text-lg font-medium mb-3">After</h3>
                <div className="grid gap-4">
                  {project.after_images.map((image, index) => (
                    <div key={`after-${index}`} className="relative aspect-video overflow-hidden rounded-lg">
                      <Image
                        src={image}
                        alt={`${project.title} after ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-medium mb-3">After</h3>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">No after images available</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Project Details */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Project Details</h2>
        
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
          {/* Left Column */}
          <div>
            {project.description && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Description</h3>
                <div className="prose max-w-none">
                  <p>{project.description}</p>
                </div>
              </div>
            )}
            
            {project.process_description && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Process</h3>
                <div className="prose max-w-none">
                  <p>{project.process_description}</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Right Column */}
          <div>
            {formattedDate && (
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-2">Completed</h3>
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  {formattedDate}
                </div>
              </div>
            )}
            
            {project.techniques && project.techniques.length > 0 && (
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-2">Techniques Used</h3>
                <div className="flex flex-wrap gap-2">
                  {project.techniques.map((technique) => (
                    <Badge key={technique} variant="secondary">
                      {technique}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {project.materials && project.materials.length > 0 && (
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-2">Materials</h3>
                <div className="flex flex-wrap gap-2">
                  {project.materials.map((material) => (
                    <Badge key={material} variant="outline">
                      {material}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {project.timeline && (
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-2">Timeline</h3>
                <p className="text-muted-foreground">{project.timeline}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* CTA */}
      <div className="bg-muted p-8 rounded-lg mb-12 text-center">
        <h2 className="text-2xl font-bold mb-3">Love this transformation?</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          We'd love to help you transform your furniture pieces. Get in touch for a consultation.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/contact">Contact Us</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/services">View Our Services</Link>
          </Button>
        </div>
      </div>
      
      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Related Projects</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProjects.map((related) => (
              <Card key={related.id} className="overflow-hidden">
                <div className="aspect-video relative overflow-hidden">
                  {related.after_images && related.after_images[0] ? (
                    <Image
                      src={related.after_images[0]}
                      alt={related.title || "Related project"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <p className="text-muted-foreground">No image available</p>
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="text-xl font-bold mb-2 line-clamp-1">{related.title}</h3>
                  <p className="text-muted-foreground line-clamp-2 mb-4">
                    {related.brief_description}
                  </p>
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/portfolio/${related.id}`}>View Project</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 