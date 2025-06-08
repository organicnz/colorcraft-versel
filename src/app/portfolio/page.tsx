import { Suspense } from 'react';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';

// Static portfolio data - no authentication needed
const SAMPLE_PROJECTS = [
  {
    id: "1",
    title: "Vintage Dresser Transformation",
    brief_description: "A stunning makeover of a 1960s dresser using chalk paint and new hardware",
    after_images: ["/images/portfolio/dresser-after-1.jpg"],
    techniques: ["Chalk Paint", "Sanding", "Hardware Replacement"],
  },
  {
    id: "2",
    title: "Farmhouse Kitchen Table",
    brief_description: "Rustic farmhouse table restoration with distressed finish",
    after_images: ["/images/portfolio/table-after-1.jpg"],
    techniques: ["Sanding", "Staining", "Distressing"],
  },
  {
    id: "3",
    title: "Modern Bookshelf Makeover",
    brief_description: "Contemporary styling with clean lines and bold colors",
    after_images: ["/images/portfolio/bookshelf-after.jpg"],
    techniques: ["Priming", "Spray Painting", "Modern Hardware"],
  },
];

export const metadata = {
  title: 'Portfolio | Color & Craft',
  description: 'Explore our furniture restoration and transformation projects',
};

// Simple portfolio card with no authentication
function SimplePortfolioCard({ project }: { project: any }) {
  const mainImage = project.after_images?.[0] || "/placeholder-image.jpg";

  return (
    <div className="group relative overflow-hidden rounded-lg transition-all hover:shadow-xl">
      <div className="aspect-square overflow-hidden">
        <Image
          src={mainImage}
          alt={project.title || "Furniture transformation"}
          width={500}
          height={500}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="text-xl font-bold">{project.title}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-gray-200">
            {project.brief_description}
          </p>

          {project.techniques && project.techniques.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {project.techniques.slice(0, 3).map((technique: string) => (
                <span
                  key={technique}
                  className="inline-block rounded-full bg-primary-600/40 px-2 py-0.5 text-xs"
                >
                  {technique}
                </span>
              ))}
            </div>
          )}

          <Link
            href={`/portfolio/${project.id}`}
            className="mt-3 inline-block rounded-lg border border-white px-4 py-1 text-sm font-medium text-white hover:bg-white hover:text-primary-700 transition-colors"
          >
            View Project
          </Link>
        </div>
      </div>
    </div>
  );
}

function PortfolioGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {SAMPLE_PROJECTS.map((project) => (
        <SimplePortfolioCard key={project.id} project={project} />
      ))}
    </div>
  );
}

export default function PortfolioPage() {
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
              <Card key={i} className="aspect-square bg-muted/30 animate-pulse" />
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