import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import Image from 'next/image';
import RandomShowcaseImage from '@/components/portfolio/RandomShowcaseImage';

// Sample data for portfolio projects
const SAMPLE_PROJECTS = [
  {
    id: '1',
    title: "Vintage Dresser Restoration",
    brief_description: "Bringing new life to a 1940s oak dresser with chalk paint and custom hardware.",
    description: "This beautiful oak dresser from the 1940s had great bones but needed a complete refinish. We stripped the original finish, repaired damaged veneer, and applied a custom-mixed chalk paint in a soft blue-gray. The original hardware was cleaned and polished to restore its brass finish, and we added new wooden drawer pulls for a contemporary touch.",
    before_images: ["https://images.unsplash.com/photo-1588499756884-d72584d84df5?q=80&w=2574&auto=format&fit=crop"],
    after_images: ["https://images.unsplash.com/photo-1588499768017-3c3233d5907e?q=80&w=2574&auto=format&fit=crop"],
    techniques: ["Chalk Paint", "Distressing", "Hardware Restoration"],
    materials: ["Chalk Paint", "Beeswax Finish", "Brass Hardware"],
    completion_date: "2023-05-15",
    client_name: "Emma Thompson",
    client_testimonial: "I can't believe this is the same dresser! Color & Craft transformed my grandmother's old furniture into a beautiful statement piece that fits perfectly with my decor.",
    is_featured: true,
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    title: "Mid-Century Console Revival",
    brief_description: "Restoring a teak mid-century modern TV console with original stain and new hardware.",
    description: "This mid-century modern teak console had great lines but years of neglect left it looking dull and damaged. We carefully sanded the entire piece, repaired water damage on the top surface, and restored it with a teak oil finish that enhances the natural beauty of the wood. The original brass hardware was polished and reinstalled to maintain authenticity.",
    before_images: ["https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=2069&auto=format&fit=crop"],
    after_images: ["https://images.unsplash.com/photo-1532372576444-dda954194ad0?q=80&w=1986&auto=format&fit=crop"],
    techniques: ["Wood Restoration", "Oiling", "Hardware Cleaning"],
    materials: ["Teak Oil", "Fine Sandpaper", "Brass Polish"],
    completion_date: "2023-07-22",
    client_name: "Michael Winters",
    client_testimonial: "The console looks even better than when it was new! The attention to detail and quality of work exceeded my expectations.",
    is_featured: true,
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    title: "Farmhouse Dining Table",
    brief_description: "Transforming a basic pine table into a rustic farmhouse centerpiece with milk paint and distressing.",
    description: "This plain pine dining table was transformed into a rustic farmhouse centerpiece. We applied milk paint in a warm white color, distressed the edges to show the natural wood beneath, and sealed it with a durable matte polyurethane. The table legs were painted in a contrasting charcoal color to add visual interest and complement the client's dining chairs.",
    before_images: ["https://images.unsplash.com/photo-1604578762246-42bfec5889d4?q=80&w=2000&auto=format&fit=crop"],
    after_images: ["https://images.unsplash.com/photo-1531498352491-876f74f692fd?q=80&w=1974&auto=format&fit=crop"],
    techniques: ["Milk Paint", "Distressing", "Two-Tone Finish"],
    materials: ["Milk Paint", "Polyurethane", "Sandpaper"],
    completion_date: "2023-09-10",
    is_featured: false,
    created_at: new Date().toISOString()
  },
  {
    id: '4',
    title: "Antique Bookcase Revival",
    brief_description: "Restoring a Victorian bookcase with traditional materials and techniques.",
    description: "This antique Victorian bookcase had beautiful detailing but was suffering from decades of neglect. We carefully repaired the damaged veneer, strengthened loose joints, and matched the original finish using traditional shellac. The brass hardware was cleaned and polished to restore its original luster.",
    before_images: ["https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=2787&auto=format&fit=crop"],
    after_images: ["https://images.unsplash.com/photo-1594026786633-cb924420607d?q=80&w=2070&auto=format&fit=crop"],
    techniques: ["Veneer Repair", "French Polishing", "Traditional Finishing"],
    materials: ["Shellac", "Hide Glue", "Brass Polish"],
    completion_date: "2023-11-05",
    is_featured: true,
    created_at: new Date().toISOString()
  },
  {
    id: '5',
    title: "Contemporary Coffee Table",
    brief_description: "Creating a sleek, modern coffee table with concrete top and black metal base.",
    description: "This contemporary coffee table combines industrial materials with clean lines. We cast a lightweight concrete top with a subtle aggregate pattern and sealed it with a durable matte finish. The custom metal base was fabricated from steel tubing and powder-coated in matte black for durability and style.",
    before_images: ["https://images.unsplash.com/photo-1600967082821-f8b36a2f3e25?q=80&w=2070&auto=format&fit=crop"],
    after_images: ["https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=1964&auto=format&fit=crop"],
    techniques: ["Concrete Casting", "Metal Fabrication", "Modern Design"],
    materials: ["Lightweight Concrete", "Steel", "Powder Coat"],
    completion_date: "2024-01-15",
    is_featured: false,
    created_at: new Date().toISOString()
  },
  {
    id: '6',
    title: "Coastal Sideboard Makeover",
    brief_description: "Transforming a dated 1980s sideboard into a coastal-inspired statement piece.",
    description: "This once-boring 1980s sideboard was transformed into a coastal-inspired statement piece. We updated the silhouette by removing the dated trim and adding simple, clean lines. The piece was painted in a custom-mixed blue-green that evokes ocean waves, with the interior painted in a contrasting warm white. New brass hardware adds a touch of elegance.",
    before_images: ["https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=2070&auto=format&fit=crop"],
    after_images: ["https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=2070&auto=format&fit=crop"],
    techniques: ["Custom Color Mixing", "Cabinet Updating", "Coastal Style"],
    materials: ["Acrylic Paint", "Brass Hardware", "Water-Based Sealer"],
    completion_date: "2024-02-20",
    is_featured: true,
    created_at: new Date().toISOString()
  }
];

export const metadata = {
  title: 'Portfolio Cards | Color & Craft',
  description: 'Sample portfolio card layouts for showcasing furniture restoration projects',
};

export default function PortfolioCardsPage() {
  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Portfolio</h1>
        <p className="text-muted-foreground text-lg">
          Our recent furniture restoration and transformation projects
        </p>
      </div>

      {/* Featured Projects */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Featured Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SAMPLE_PROJECTS.filter(project => project.is_featured).map((project) => (
            <FeaturedProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>

      {/* All Projects */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">All Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SAMPLE_PROJECTS.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
  );
}

function FeaturedProjectCard({ project }: { project: typeof SAMPLE_PROJECTS[0] }) {
  const fallbackImage = project.after_images?.[0] || "/placeholder-image.jpg";
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md h-full flex flex-col">
      <div className="relative h-64 bg-muted w-full">
        <RandomShowcaseImage
          portfolioId={project.id}
          title={project.title}
          fallbackImage={fallbackImage}
          className="object-cover"
          width={400}
          height={256}
          priority={true}
        />
        <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 text-xs rounded">
          Featured
        </div>
      </div>
      <CardHeader>
        <CardTitle className="line-clamp-1">{project.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground mb-4 line-clamp-2">{project.brief_description}</p>
        
        {project.techniques && project.techniques.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {project.techniques.map((technique, i) => (
              <Badge key={i} variant="outline" className="text-xs">
                {technique}
              </Badge>
            ))}
          </div>
        )}
        
        <div className="flex justify-end mt-auto pt-4">
          <Link 
            href={`/portfolio/${project.id}`}
            className="text-sm font-medium text-primary hover:text-primary/80"
          >
            View Project →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

function ProjectCard({ project }: { project: typeof SAMPLE_PROJECTS[0] }) {
  const fallbackImage = project.after_images?.[0] || "/placeholder-image.jpg";

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="relative aspect-[4/3] bg-muted w-full">
        <RandomShowcaseImage
          portfolioId={project.id}
          title={project.title}
          fallbackImage={fallbackImage}
          className="object-cover"
          width={400}
          height={300}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {project.is_featured && (
          <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 text-xs rounded">
            Featured
          </div>
        )}
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">{project.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {project.brief_description}
        </p>
        
        {project.techniques && project.techniques.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {project.techniques.slice(0, 2).map((technique, i) => (
              <Badge key={i} variant="outline" className="text-xs">
                {technique}
              </Badge>
            ))}
            {project.techniques.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{project.techniques.length - 2} more
              </Badge>
            )}
          </div>
        )}
        
        <div className="flex justify-end mt-2">
          <Link 
            href={`/portfolio/${project.id}`}
            className="text-xs font-medium text-primary hover:text-primary/80"
          >
            Details →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
} 