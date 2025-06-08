import { Suspense } from 'react';
import { Card } from '@/components/ui/card';
import EditorialButton from '@/components/portfolio/EditorialButton';
import PortfolioItem from '@/components/portfolio/PortfolioItem';

// Static portfolio data to avoid SSR issues
const SAMPLE_PROJECTS = [
  {
    id: "1",
    title: "Vintage Dresser Transformation",
    brief_description: "A stunning makeover of a 1960s dresser using chalk paint and new hardware",
    description: "This beautiful vintage dresser was given new life with a fresh coat of chalk paint and elegant gold hardware.",
    after_images: ["/images/portfolio/dresser-after-1.jpg", "/images/portfolio/dresser-after-2.jpg"],
    before_images: ["/images/portfolio/dresser-before.jpg"],
    techniques: ["Chalk Paint", "Sanding", "Hardware Replacement"],
    materials: ["Annie Sloan Chalk Paint", "Gold Hardware", "Wax Finish"],
    is_featured: true,
    completion_date: "2024-01-15",
    client_name: "Sarah Johnson",
    client_testimonial: "Absolutely loved the transformation! The dresser looks brand new.",
    created_at: "2024-01-15T00:00:00Z",
  },
  {
    id: "2",
    title: "Farmhouse Kitchen Table",
    brief_description: "Rustic farmhouse table restoration with distressed finish",
    description: "A family heirloom table restored to its former glory with a rustic farmhouse aesthetic.",
    after_images: ["/images/portfolio/table-after-1.jpg"],
    before_images: ["/images/portfolio/table-before.jpg"],
    techniques: ["Sanding", "Staining", "Distressing"],
    materials: ["Wood Stain", "Polyurethane Finish"],
    is_featured: false,
    completion_date: "2024-02-01",
    client_name: "Mike Thompson",
    client_testimonial: "The table looks amazing and fits perfectly in our farmhouse kitchen!",
    created_at: "2024-02-01T00:00:00Z",
  },
  {
    id: "3",
    title: "Modern Bookshelf Makeover",
    brief_description: "Contemporary styling with clean lines and bold colors",
    description: "Transformed an old bookshelf into a modern statement piece with clean lines and vibrant color.",
    after_images: ["/images/portfolio/bookshelf-after.jpg"],
    before_images: ["/images/portfolio/bookshelf-before.jpg"],
    techniques: ["Priming", "Spray Painting", "Modern Hardware"],
    materials: ["Primer", "Acrylic Paint", "Chrome Hardware"],
    is_featured: true,
    completion_date: "2024-02-15",
    client_name: "Lisa Chen",
    client_testimonial: "Perfect for my modern apartment. Such great craftsmanship!",
    created_at: "2024-02-15T00:00:00Z",
  },
];

export const metadata = {
  title: 'Portfolio | Color & Craft',
  description: 'Explore our furniture restoration and transformation projects',
};

function PortfolioGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {SAMPLE_PROJECTS.map((project) => (
        <PortfolioItem key={project.id} project={project} />
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