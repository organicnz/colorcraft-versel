import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CalendarDays, ArrowLeft, Quote, User, Palette, Wrench } from 'lucide-react';
import { getPortfolioProject, getRelatedProjects } from '@/services/portfolio.service';
import EditorialButton from '@/components/portfolio/EditorialButton';
import AdminProjectEditButton from '@/components/portfolio/AdminProjectEditButton';
import RandomShowcaseImage from '@/components/portfolio/RandomShowcaseImage';

interface PortfolioProjectPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: PortfolioProjectPageProps) {
  const project = await getPortfolioProject(params.id);
  
  if (!project) {
    return {
      title: 'Project Not Found | Color & Craft',
      description: 'The requested portfolio project could not be found.'
    };
  }

  return {
    title: `${project.title} | Color & Craft Portfolio`,
    description: project.brief_description || project.description,
    openGraph: {
      title: project.title,
      description: project.brief_description,
      images: project.after_images?.[0] ? [
        {
          url: project.after_images[0],
          width: 1200,
          height: 630,
          alt: project.title,
        }
      ] : [],
    },
  };
}

export default async function PortfolioProjectPage({ params }: PortfolioProjectPageProps) {
  // Fetch the main project and related projects in parallel
  const [project, relatedProjects] = await Promise.all([
    getPortfolioProject(params.id),
    getPortfolioProject(params.id).then(p => 
      p ? getRelatedProjects(params.id, p.techniques || []) : []
    )
  ]);

  if (!project) {
    notFound();
  }

  return (
    <div className="container py-8 max-w-6xl">
      {/* Back button */}
      <div className="mb-6">
        <Button variant="ghost" asChild className="pl-0">
          <Link href="/portfolio">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Portfolio
          </Link>
        </Button>
      </div>

      {/* Project Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">{project.title}</h1>
            <p className="text-xl text-muted-foreground">
              {project.brief_description}
            </p>
          </div>
          
          {/* Admin Controls */}
          <div className="flex items-center gap-3 ml-4">
            <AdminProjectEditButton projectId={project.id} variant="button" />
            <EditorialButton variant="inline" />
          </div>
        </div>

        {/* Project Meta */}
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          {project.completion_date && (
            <div className="flex items-center gap-1">
              <CalendarDays className="h-4 w-4" />
              <span>
                Completed {new Date(project.completion_date).toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric'
                })}
              </span>
            </div>
          )}
          
          {project.client_name && (
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>Client: {project.client_name}</span>
            </div>
          )}
          
          {project.is_featured && (
            <Badge variant="secondary" className="ml-auto">
              Featured Project
            </Badge>
          )}
        </div>
      </div>

      {/* Before & After Images */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Before Images */}
        {project.before_images && project.before_images.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Before</h2>
            <div className="grid gap-4">
              {project.before_images.map((image: string, index: number) => (
                <div key={index} className="relative aspect-[4/3] rounded-lg overflow-hidden">
                  <Image
                    src={image}
                    alt={`${project.title} - Before ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* After Images */}
        {project.after_images && project.after_images.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">After</h2>
            <div className="grid gap-4">
              {project.after_images.map((image: string, index: number) => (
                <div key={index} className="relative aspect-[4/3] rounded-lg overflow-hidden">
                  <Image
                    src={image}
                    alt={`${project.title} - After ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Project Description */}
          {project.description && (
            <Card className="mb-8 bg-white/30 dark:bg-white/10 backdrop-blur-md shadow-glass border border-white/30 dark:border-white/10 transition-all duration-300 hover:bg-white/40 hover:shadow-glass-heavy">
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-lg max-w-none">
                  <p className="whitespace-pre-line">{project.description}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Client Testimonial */}
          {project.client_testimonial && (
            <Card className="mb-8 bg-white/30 dark:bg-white/10 backdrop-blur-md shadow-glass border border-white/30 dark:border-white/10 transition-all duration-300 hover:bg-white/40 hover:shadow-glass-heavy">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Quote className="h-5 w-5" />
                  Client Testimonial
                </CardTitle>
              </CardHeader>
              <CardContent>
                <blockquote className="text-lg italic text-muted-foreground border-l-4 border-primary pl-4">
                  "{project.client_testimonial}"
                </blockquote>
                {project.client_name && (
                  <cite className="block mt-4 text-sm font-medium">
                    — {project.client_name}
                  </cite>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Techniques */}
          {project.techniques && project.techniques.length > 0 && (
            <Card className="bg-white/30 dark:bg-white/10 backdrop-blur-md shadow-glass border border-white/30 dark:border-white/10 transition-all duration-300 hover:bg-white/40 hover:shadow-glass-heavy">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Techniques Used
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {project.techniques.map((technique, index) => (
                    <Badge key={index} variant="outline">
                      {technique}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Materials */}
          {project.materials && project.materials.length > 0 && (
            <Card className="bg-white/30 dark:bg-white/10 backdrop-blur-md shadow-glass border border-white/30 dark:border-white/10 transition-all duration-300 hover:bg-white/40 hover:shadow-glass-heavy">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5" />
                  Materials & Tools
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {project.materials.map((material, index) => (
                    <Badge key={index} variant="secondary">
                      {material}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Contact CTA */}
          <Card className="bg-white/30 dark:bg-white/10 backdrop-blur-md shadow-glass border border-white/30 dark:border-white/10 transition-all duration-300 hover:bg-white/40 hover:shadow-glass-heavy">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-3">Love this transformation?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Get in touch to discuss your own furniture restoration project.
              </p>
              <Button asChild className="w-full">
                <Link href="/contact">Get a Quote</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Related Projects */}
      {relatedProjects && relatedProjects.length > 0 && (
        <div className="mt-16">
          <Separator className="mb-8" />
          <h2 className="text-3xl font-bold mb-8">Related Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProjects.slice(0, 3).map((relatedProject) => (
              <Link
                key={relatedProject.id}
                href={`/portfolio/${relatedProject.id}`}
                className="group"
              >
                <Card className="overflow-hidden transition-all hover:shadow-md bg-white/30 dark:bg-white/10 backdrop-blur-md shadow-glass border border-white/30 dark:border-white/10 hover:bg-white/40 hover:shadow-glass-heavy">
                  <div className="relative aspect-[4/3] bg-muted">
                    <RandomShowcaseImage
                      portfolioId={relatedProject.id}
                      title={relatedProject.title}
                      fallbackImage={relatedProject.after_images?.[0] || "/placeholder-image.jpg"}
                      className="object-cover transition-transform group-hover:scale-105"
                      width={400}
                      height={300}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="line-clamp-1 group-hover:text-primary">
                      {relatedProject.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {relatedProject.brief_description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Button variant="outline" asChild>
              <Link href="/portfolio">View All Projects</Link>
            </Button>
          </div>
        </div>
      )}

      {/* Floating Editorial Button */}
      <EditorialButton variant="floating" />
    </div>
  );
} 