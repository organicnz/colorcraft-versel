"use client";

import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

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
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
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
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="container mx-auto px-6 py-24">
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-20 text-center"
      >
        <h1 className="mb-4 text-5xl font-light text-gray-900">
          Our <span className="font-semibold">Services</span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600">
          We offer a comprehensive range of furniture painting, restoration, and refinishing services to transform your pieces.
        </p>
      </motion.div>

      {/* Services Grid */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
      >
        {services.map((service) => (
          <motion.div
            key={service.id}
            variants={fadeIn}
            className="group cursor-pointer"
            whileHover={{ y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Link href={`#${service.id}-details`}>
              <div className="p-6 border border-gray-100 hover:border-primary transition-colors duration-300 h-full">
                <h3 className="text-xl font-light text-gray-900 mb-3">{service.title}</h3>
                <div className="w-16 h-1 bg-primary mb-6"></div>
                <p className="text-gray-600 mb-6 line-clamp-4">{service.description}</p>
                <span className="text-primary font-medium flex items-center">
                  Learn more
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transform transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Service Details */}
      <div className="space-y-32">
        {services.map((service, index) => (
          <section 
            key={service.id} 
            id={`${service.id}-details`}
          >
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: "-100px" }}
              className="flex flex-col lg:flex-row gap-12"
            >
              <div className="lg:w-1/2">
                <h2 className="text-3xl font-light mb-2">
                  <span className="text-primary font-medium">0{index + 1}.</span> {service.title}
                </h2>
                <div className="w-24 h-1 bg-primary mb-8"></div>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">{service.description}</p>
                
                <h3 className="text-xl font-medium mb-5">What's Included</h3>
                <ul className="space-y-4">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <div className="mr-4 text-primary">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2Z" stroke="currentColor" strokeWidth="1.5" />
                          <path d="M7 10L9 12L13 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="lg:w-1/2 relative h-80 lg:h-auto overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </motion.div>
          </section>
        ))}
      </div>

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
              Contact us today to discuss your project and receive a personalized quote.
            </p>
          </div>
          <div>
            <Link
              href="/contact"
              className="inline-block px-10 py-4 bg-white text-primary text-lg hover:bg-white/90 transition-colors duration-300"
            >
              Request a Quote
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 