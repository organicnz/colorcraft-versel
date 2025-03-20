import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Portfolio | Our Furniture Painting Projects",
  description: "Browse our portfolio of furniture painting and restoration projects to see our quality craftsmanship in action.",
};

// Portfolio data
const projects = [
  {
    id: 1,
    title: "Vintage Dresser Restoration",
    description: "A 1950s dresser completely restored and painted in a soft sage green with brass hardware.",
    tags: ["Dresser", "Vintage", "Restoration", "Sage Green"],
    imageSrc: "/images/portfolio/dresser.png",
  },
  {
    id: 2,
    title: "Farmhouse Dining Table",
    description: "Solid oak dining table refinished with a distressed white base and natural wood top.",
    tags: ["Dining Table", "Farmhouse", "Distressed", "Two-tone"],
    imageSrc: "/images/portfolio/table.png",
  },
  {
    id: 3,
    title: "Mid-Century Cabinet Makeover",
    description: "A mid-century modern cabinet updated with a navy blue exterior and original wood interior.",
    tags: ["Cabinet", "Mid-Century", "Navy Blue", "Modern"],
    imageSrc: "/images/portfolio/cabinet.png",
  },
  {
    id: 4,
    title: "Kitchen Cabinet Refinishing",
    description: "Complete kitchen cabinet refinishing from dark oak to a bright white with new hardware.",
    tags: ["Kitchen", "Cabinets", "White", "Modern"],
    imageSrc: "/images/portfolio/kitchen.png",
  },
  {
    id: 5,
    title: "Antique Armoire Restoration",
    description: "A century-old armoire carefully restored with traditional techniques and finished in its original color.",
    tags: ["Armoire", "Antique", "Restoration", "Traditional"],
    imageSrc: "/images/portfolio/antique-armoire.jpg",
  },
  {
    id: 6,
    title: "Accent Chair Upholstery",
    description: "Vintage accent chair with newly painted frame in gold and custom upholstery in emerald velvet.",
    tags: ["Chair", "Upholstery", "Gold", "Emerald"],
    imageSrc: "/images/portfolio/accent-chair.jpg",
  },
  {
    id: 7,
    title: "Coastal Console Table",
    description: "Beach-inspired console table with a weathered blue finish and custom shell hardware.",
    tags: ["Console", "Coastal", "Blue", "Distressed"],
    imageSrc: "/images/portfolio/service-painting.jpg",
  },
  {
    id: 8,
    title: "Industrial Bookshelf Makeover",
    description: "Repurposed wooden bookshelf with industrial metal accents and a rustic finish.",
    tags: ["Bookshelf", "Industrial", "Rustic", "Upcycled"],
    imageSrc: "/images/portfolio/service-upcycling.jpg",
  },
];

export default function PortfolioPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold md:text-5xl">Our Portfolio</h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600">
          Browse our collection of furniture painting and restoration projects. Each piece tells a story of transformation and renewal.
        </p>
      </div>

      {/* Filter options could be added here */}
      
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <div key={project.id} className="overflow-hidden rounded-lg shadow-lg transition hover:shadow-xl">
            <div className="relative h-64 w-full">
              <Image
                src={project.imageSrc}
                alt={project.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="mb-2 text-xl font-semibold">{project.title}</h3>
              <p className="mb-4 text-gray-600">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Call to action */}
      <div className="mt-16 rounded-lg bg-primary p-8 text-center text-white">
        <h2 className="mb-4 text-2xl font-bold">Ready to transform your furniture?</h2>
        <p className="mb-6 text-lg">
          Contact us today to discuss your project and get a free quote.
        </p>
        <a
          href="/contact"
          className="inline-block rounded-md bg-white px-6 py-3 font-semibold text-primary transition hover:bg-gray-100"
        >
          Get in Touch
        </a>
      </div>
    </div>
  );
} 