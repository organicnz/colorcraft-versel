"use client";

import { Metadata } from "next";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";

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
    title: "Elegant Bookcase Transformation",
    description: "Traditional bookcase refinished with a rich espresso stain and updated with glass inserts.",
    tags: ["Bookcase", "Traditional", "Espresso", "Glass"],
    imageSrc: "/images/portfolio/bookcase.png",
  },
  {
    id: 6,
    title: "Midcentury Sideboard Revival",
    description: "Classic midcentury sideboard restored with teak veneer and original brass hardware.",
    tags: ["Sideboard", "Midcentury", "Teak", "Brass"],
    imageSrc: "/images/portfolio/sideboard.png",
  },
  {
    id: 7,
    title: "Rustic Coffee Table Redesign",
    description: "Reclaimed wood coffee table with custom metal base and distressed finish.",
    tags: ["Coffee Table", "Rustic", "Reclaimed", "Metal"],
    imageSrc: "/images/portfolio/coffee-table.png",
  },
  {
    id: 8,
    title: "Vintage Vanity Restoration",
    description: "1940s vanity carefully restored and updated with a delicate blush pink finish.",
    tags: ["Vanity", "Vintage", "Pink", "Feminine"],
    imageSrc: "/images/portfolio/vanity.png",
  },
  {
    id: 9,
    title: "Antique Armoire Restoration",
    description: "A century-old armoire carefully restored with traditional techniques and finished in its original color.",
    tags: ["Armoire", "Antique", "Restoration", "Traditional"],
    imageSrc: "/images/portfolio/antique-armoire.jpg",
  },
  {
    id: 10,
    title: "Art Deco Bar Cabinet",
    description: "Sophisticated bar cabinet restored with gold accents and mirrored interior.",
    tags: ["Bar Cabinet", "Art Deco", "Gold", "Mirrored"],
    imageSrc: "/images/portfolio/bar-cabinet.png",
  },
  {
    id: 11,
    title: "Modern Console Table",
    description: "Sleek console table refinished in charcoal gray with brushed gold legs.",
    tags: ["Console", "Modern", "Charcoal", "Gold"],
    imageSrc: "/images/portfolio/console-table.png",
  },
  {
    id: 12,
    title: "Vintage Nightstand Pair",
    description: "Matching pair of 1960s nightstands updated with navy blue paint and original hardware.",
    tags: ["Nightstand", "Vintage", "Navy", "Pair"],
    imageSrc: "/images/portfolio/nightstand.png",
  },
  {
    id: 13,
    title: "Contemporary Writing Desk",
    description: "Minimalist writing desk refinished in crisp white with sustainable bamboo accents.",
    tags: ["Desk", "Contemporary", "White", "Bamboo"],
    imageSrc: "/images/portfolio/desk.png",
  },
];

export default function PortfolioPage() {
  const [showAll, setShowAll] = useState(false);
  const displayedProjects = showAll ? projects : projects.slice(0, 6);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold md:text-5xl">Our Portfolio</h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600">
          Browse our collection of furniture painting and restoration projects. Each piece tells a story of transformation and renewal.
        </p>
      </div>
      
      <motion.div
        className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {displayedProjects.map((project) => (
          <motion.div
            key={project.id}
            className="group overflow-hidden rounded-lg bg-white shadow-md transition-all hover:shadow-xl"
            variants={itemVariants}
          >
            <div className="relative h-72 w-full overflow-hidden">
              <Image
                src={project.imageSrc}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            </div>
            <div className="p-6">
              <h3 className="mb-2 text-xl font-semibold text-gray-900">{project.title}</h3>
              <p className="mb-4 text-gray-600">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 transition-colors duration-300 hover:bg-primary hover:text-white"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {!showAll && (
        <div className="mt-12 text-center">
          <button
            onClick={() => setShowAll(true)}
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-primary p-0.5 font-semibold text-white transition-all duration-300 hover:bg-white"
          >
            <span className="relative z-10 flex items-center space-x-2 rounded-full bg-primary px-6 py-3 transition-all duration-300 group-hover:bg-transparent">
              <span>Show More</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </span>
            <span className="absolute inset-0 z-0 scale-105 rounded-full bg-gradient-to-r from-primary via-primary-light to-primary opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
          </button>
        </div>
      )}

      {/* Call to action */}
      <div className="mt-16 overflow-hidden rounded-lg bg-gradient-to-r from-primary to-primary-dark p-8 text-center text-white shadow-lg">
        <h2 className="mb-4 text-2xl font-bold">Ready to transform your furniture?</h2>
        <p className="mx-auto mb-6 max-w-2xl text-lg">
          Contact us today to discuss your project and get a free quote. Our team of experts is ready to bring your vision to life.
        </p>
        <a
          href="/contact"
          className="group relative inline-flex items-center overflow-hidden rounded-full bg-white px-8 py-3 font-semibold text-primary transition-all duration-300 hover:bg-opacity-90"
        >
          <span className="relative">Get in Touch</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="relative ml-2 h-5 w-5 transform transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </a>
      </div>
    </div>
  );
} 