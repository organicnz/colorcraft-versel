"use client";

import { Metadata } from "next";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";

// Removed metadata export as it's incompatible with client components
// export const metadata: Metadata = {
//   title: "Portfolio | Our Furniture Painting Projects",
//   description: "Browse our portfolio of furniture painting and restoration projects to see our quality craftsmanship in action.",
// };

// Portfolio data
const projects = [
  {
    id: 1,
    title: "Vintage Dresser Restoration",
    description: "A 1950s dresser completely restored and painted in a soft sage green with brass hardware.",
    tags: ["Dresser", "Vintage", "Restoration", "Sage Green"],
    imageSrc: "/images/portfolio/dresser.png",
    category: "Restoration"
  },
  {
    id: 2,
    title: "Farmhouse Dining Table",
    description: "Solid oak dining table refinished with a distressed white base and natural wood top. This rustic centerpiece combines traditional craftsmanship with modern farmhouse aesthetics.",
    tags: ["Dining Table", "Farmhouse", "Distressed", "Custom"],
    imageSrc: "https://placehold.co/600x400/e2e8f0/1e293b?text=Farmhouse+Dining+Table",
    category: "Custom Finish"
  },
  {
    id: 3,
    title: "Mid-Century Cabinet Makeover",
    description: "A mid-century modern cabinet updated with a navy blue exterior and original wood interior.",
    tags: ["Cabinet", "Mid-Century", "Navy Blue", "Modern"],
    imageSrc: "/images/portfolio/cabinet.png",
    category: "Modern"
  },
  {
    id: 4,
    title: "Kitchen Cabinet Refinishing",
    description: "Complete kitchen cabinet refinishing from dark oak to a bright white with new hardware.",
    tags: ["Kitchen", "Cabinets", "White", "Modern"],
    imageSrc: "/images/portfolio/kitchen.png",
    category: "Refinishing"
  },
  {
    id: 5,
    title: "Elegant Bookcase Transformation",
    description: "Traditional bookcase refinished with a rich espresso stain and updated with glass inserts.",
    tags: ["Bookcase", "Traditional", "Espresso", "Glass"],
    imageSrc: "/images/portfolio/bookcase.png",
    category: "Custom Finish"
  },
  {
    id: 6,
    title: "Midcentury Sideboard Revival",
    description: "Classic midcentury sideboard restored with teak veneer and original brass hardware.",
    tags: ["Sideboard", "Midcentury", "Teak", "Brass"],
    imageSrc: "/images/portfolio/sideboard.png",
    category: "Restoration"
  },
  {
    id: 7,
    title: "Rustic Coffee Table Redesign",
    description: "Reclaimed wood coffee table with custom metal base and distressed finish.",
    tags: ["Coffee Table", "Rustic", "Reclaimed", "Metal"],
    imageSrc: "/images/portfolio/coffee-table.png",
    category: "Custom Finish"
  },
  {
    id: 8,
    title: "Vintage Vanity Restoration",
    description: "1940s vanity carefully restored and updated with a delicate blush pink finish.",
    tags: ["Vanity", "Vintage", "Pink", "Feminine"],
    imageSrc: "/images/portfolio/vanity.png",
    category: "Restoration"
  },
  {
    id: 9,
    title: "Antique Armoire Restoration",
    description: "A century-old armoire carefully restored with traditional techniques and finished in its original color.",
    tags: ["Armoire", "Antique", "Restoration", "Traditional"],
    imageSrc: "/images/portfolio/antique-armoire.jpg",
    category: "Antique"
  },
  {
    id: 10,
    title: "Art Deco Bar Cabinet",
    description: "Sophisticated bar cabinet restored with gold accents and mirrored interior.",
    tags: ["Bar Cabinet", "Art Deco", "Gold", "Mirrored"],
    imageSrc: "/images/portfolio/bar-cabinet.png",
    category: "Art Deco"
  },
  {
    id: 11,
    title: "Modern Console Table",
    description: "Sleek console table refinished in charcoal gray with brushed gold legs.",
    tags: ["Console", "Modern", "Charcoal", "Gold"],
    imageSrc: "/images/portfolio/console-table.png",
    category: "Modern"
  },
  {
    id: 12,
    title: "Vintage Nightstand Pair",
    description: "Matching pair of 1960s nightstands updated with navy blue paint and original hardware.",
    tags: ["Nightstand", "Vintage", "Navy", "Pair"],
    imageSrc: "/images/portfolio/nightstand.png",
    category: "Vintage"
  },
  {
    id: 13,
    title: "Contemporary Writing Desk",
    description: "Minimalist writing desk refinished in crisp white with sustainable bamboo accents.",
    tags: ["Desk", "Contemporary", "White", "Bamboo"],
    imageSrc: "/images/portfolio/desk.png",
    category: "Contemporary"
  },
];

export default function PortfolioPage() {
  const [showAll, setShowAll] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  
  // Extract unique categories
  const categories = ["All", ...Array.from(new Set(projects.map(project => project.category)))];
  
  // Filter projects
  const filteredProjects = activeFilter === "All" 
    ? projects 
    : projects.filter(project => project.category === activeFilter);
  
  // Determine displayed projects
  const displayedProjects = showAll ? filteredProjects : filteredProjects.slice(0, 6);

  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  const stagger = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="container mx-auto px-6 py-24">
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-16 text-center"
      >
        <h1 className="mb-4 text-5xl font-light text-gray-900">
          Our <span className="font-semibold">Portfolio</span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600">
          Browse our collection of furniture painting and restoration projects. Each piece tells a story of transformation and renewal.
        </p>
      </motion.div>
      
      {/* Filters */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-12 flex flex-wrap justify-center gap-4"
      >
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setActiveFilter(category)}
            className={`px-6 py-2 transition-all duration-300 ${
              activeFilter === category
                ? "bg-primary text-white"
                : "bg-white border border-gray-200 text-gray-700 hover:border-primary hover:text-primary"
            }`}
          >
            {category}
          </button>
        ))}
      </motion.div>
      
      {/* Portfolio Grid */}
      <motion.div
        className="grid gap-10 md:grid-cols-2 lg:grid-cols-3"
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        {displayedProjects.map((project) => (
          <motion.div
            key={project.id}
            variants={fadeIn}
            className="group overflow-hidden"
          >
            <div className="relative h-96 overflow-hidden">
              <Image
                src={project.imageSrc}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute inset-0 p-8 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <span className="text-primary text-sm font-medium tracking-wider uppercase">{project.category}</span>
                <h3 className="text-white text-2xl font-light mt-2">{project.title}</h3>
                <p className="text-white/80 mt-2 line-clamp-2">{project.description}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {project.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/30 px-3 py-1 text-xs text-white/90"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-light text-gray-900">{project.title}</h3>
              <p className="mt-2 text-sm text-primary">{project.category}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Show More Button */}
      {!showAll && filteredProjects.length > 6 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <button
            onClick={() => setShowAll(true)}
            className="group relative inline-flex items-center overflow-hidden border-2 border-primary px-8 py-3 text-primary hover:bg-primary hover:text-white transition-colors duration-300"
          >
            <span className="relative flex items-center gap-2">
              View All Projects
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </span>
          </button>
        </motion.div>
      )}

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-100px" }}
        className="mt-32 py-16 bg-gradient-to-r from-primary to-primary-dark text-white"
      >
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 max-w-6xl mx-auto px-6">
          <div className="lg:w-2/3">
            <h2 className="text-3xl md:text-4xl font-light mb-4">Ready to transform your furniture?</h2>
            <p className="text-xl text-white/80">
              Contact us today to discuss your project and get a personalized quote.
            </p>
          </div>
          <div>
            <a
              href="/contact"
              className="inline-block px-10 py-4 bg-white text-primary text-lg hover:bg-white/90 transition-colors duration-300"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 