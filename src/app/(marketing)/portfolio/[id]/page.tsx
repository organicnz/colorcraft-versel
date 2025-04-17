import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getProjectById, getRelatedProjects } from '@/services/portfolio.service';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

type Props = {
  params: { id: string };
};

// Dynamic metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getProjectById(params.id);
  
  if (!project) {
    return {
      title: 'Project Not Found',
      description: 'The requested project could not be found.',
    };
  }
  
  return {
    title: `${project.title} | Portfolio`,
    description: project.brief_description || project.description.substring(0, 155),
  };
}

export default async function ProjectDetailsPage({ params }: Props) {
  const project = await getProjectById(params.id);
  
  // Handle 404 case
  if (!project) {
    notFound();
  }
  
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
                <div className="aspect-square relative rounded-lg overflow-hidden">
                  <Image
                    src={project.before_images[0]}
                    alt={`${project.title} - Before`}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-medium mb-3">Before</h3>
                <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">No before image available</p>
                </div>
              </div>
            )}
            
            {/* After Images */}
            {project.after_images && project.after_images.length > 0 ? (
              <div>
                <h3 className="text-lg font-medium mb-3">After</h3>
                <div className="aspect-square relative rounded-lg overflow-hidden">
                  <Image
                    src={project.after_images[0]}
                    alt={`${project.title} - After`}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-medium mb-3">After</h3>
                <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">No after image available</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Project Details */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Project Details</h2>
        
        <div className="prose max-w-none">
          <p>{project.description}</p>
        </div>
        
        {/* Materials used */}
        {project.materials && project.materials.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-3">Materials Used</h3>
            <ul className="list-disc pl-5 space-y-1">
              {project.materials.map((material) => (
                <li key={material}>{material}</li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Duration */}
        {project.duration_days && (
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-3">Project Timeline</h3>
            <p>This project was completed in {project.duration_days} days.</p>
          </div>
        )}
      </div>
      
      {/* CTA */}
      <div className="bg-muted p-8 rounded-lg mb-12 text-center">
        <h2 className="text-2xl font-bold mb-3">Love this transformation?</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          We'd love to help you transform your furniture pieces. Get in touch for a consultation.
        </p>
        <Button asChild size="lg">
          <Link href="/contact">Request a Quote</Link>
        </Button>
      </div>
      
      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Related Projects</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedProjects.map((relatedProject) => (
              <Card key={relatedProject.id} className="overflow-hidden">
                <CardHeader className="p-0">
                  <div className="aspect-square overflow-hidden relative">
                    <Image
                      src={relatedProject.after_images?.[0] || '/images/placeholder.jpg'}
                      alt={relatedProject.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 33vw"
                    />
                  </div>
                </CardHeader>
                
                <CardContent className="p-4">
                  <h3 className="font-bold line-clamp-1">{relatedProject.title}</h3>
                  <p className="text-muted-foreground text-sm line-clamp-2 mt-1">
                    {relatedProject.brief_description}
                  </p>
                </CardContent>
                
                <CardFooter className="p-4 pt-0">
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/portfolio/${relatedProject.id}`}>View Project</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 