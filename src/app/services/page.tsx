import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Services | Our Furniture Painting Solutions",
  description: "Explore our range of professional furniture painting, restoration, and refinishing services.",
};

const services = [
  {
    id: "painting",
    title: "Custom Furniture Painting",
    description:
      "Transform your furniture with our custom painting services. We work with you to select the perfect colors and finishes to match your vision and complement your space. Our skilled craftsmen use premium paints and techniques to ensure a flawless, durable finish that will stand the test of time.",
    features: [
      "Color consultation and matching",
      "Premium paint products",
      "Hand-painted details",
      "Protective top coats",
      "Custom finishes (distressed, antiqued, etc.)",
    ],
    image: "/images/portfolio/service-painting.jpg",
  },
  {
    id: "restoration",
    title: "Furniture Restoration",
    description:
      "Bring your antique and vintage furniture back to life with our careful restoration services. We preserve the character and history of your pieces while addressing structural issues, surface damage, and worn finishes. Our restoration process respects the original craftsmanship while making your furniture functional and beautiful again.",
    features: [
      "Structural repairs",
      "Surface restoration",
      "Hardware replacement or refinishing",
      "Traditional restoration techniques",
      "Conservation of original elements",
    ],
    image: "/images/portfolio/service-restoration.jpg",
  },
  {
    id: "upcycling",
    title: "Upcycling & Repurposing",
    description:
      "Give old furniture new purpose with our creative upcycling and repurposing services. We can transform outdated pieces into functional, stylish items that fit your needs and aesthetic. From turning an old dresser into a media console to converting a headboard into a bench, we help you reimagine furniture possibilities.",
    features: [
      "Creative redesign consultation",
      "Structural modifications",
      "Modern updates to vintage pieces",
      "Custom solutions for unique spaces",
      "Environmentally friendly approach",
    ],
    image: "/images/portfolio/service-upcycling.jpg",
  },
  {
    id: "cabinets",
    title: "Cabinet Refinishing",
    description:
      "Update your kitchen or bathroom with our cabinet refinishing services. We transform dated cabinets with fresh paint, new hardware, and modern finishes - all at a fraction of the cost of replacement. Our specialized process ensures a smooth, durable finish that can withstand the demands of high-use areas.",
    features: [
      "Thorough cleaning and preparation",
      "Professional-grade primers and paints",
      "Spray application for smooth finish",
      "Hardware updates",
      "Protective clear coats for longevity",
    ],
    image: "/images/portfolio/service-cabinets.jpg",
  },
];

export default function ServicesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold md:text-5xl">Our Services</h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600">
          We offer a comprehensive range of furniture painting, restoration, and refinishing services to transform your pieces.
        </p>
      </div>

      <div className="space-y-20">
        {services.map((service, index) => (
          <section 
            key={service.id} 
            id={service.id}
            className={`flex flex-col ${
              index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
            } gap-8 md:gap-12`}
          >
            <div className="relative h-64 overflow-hidden rounded-lg md:h-auto md:w-1/2">
              <Image
                src={service.image}
                alt={service.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="md:w-1/2">
              <h2 className="mb-4 text-3xl font-bold">{service.title}</h2>
              <p className="mb-6 text-gray-600">{service.description}</p>
              <h3 className="mb-3 text-xl font-semibold">What's Included:</h3>
              <ul className="mb-6 space-y-2">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <svg
                      className="mr-2 h-5 w-5 flex-shrink-0 text-primary"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ))}
      </div>

      <div className="mt-16 rounded-lg bg-primary p-8 text-center text-white">
        <h2 className="mb-4 text-2xl font-bold">Ready to get started?</h2>
        <p className="mb-6 text-lg">
          Contact us today to discuss your project and receive a free quote.
        </p>
        <Link
          href="/contact"
          className="inline-block rounded-md bg-white px-6 py-3 font-semibold text-primary transition hover:bg-gray-100"
        >
          Request a Quote
        </Link>
      </div>
    </div>
  );
} 