"use client";

import Link from 'next/link'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { projects } from "@/lib/data"; // Import project data
import ProjectCard from "@/components/ProjectCard";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
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

export default function Home() {
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const heroRef = useRef(null);
  const { scrollY } = useScroll();
  
  // Parallax effect values
  const parallaxY = useTransform(scrollY, [0, 500], [0, -100]);
  const parallaxScale = useTransform(scrollY, [0, 500], [1, 1.2]);
  const textOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  // Auto-rotate projects every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentProjectIndex((prevIndex) => (prevIndex + 1) % projects.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section ref={heroRef} className="relative h-[90vh] md:h-[80vh] w-full">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-house.png"
            alt="Beautiful home interior"
            fill
            className="object-cover"
            priority
            onError={(e) => {
              // Fallback to another image if hero-house.png fails to load
              const target = e.target as HTMLImageElement;
              target.onerror = null; // Prevent infinite loops
              target.src = "/images/hero-furniture.png"; // Fallback image
            }}
          />
          <div className="absolute inset-0 bg-black/30 bg-gradient-to-b from-black/40 to-transparent"></div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="container mx-auto px-8 text-center md:px-10 lg:max-w-4xl"
            style={{ opacity: textOpacity }}
          >
            <motion.h2
              variants={fadeIn}
              className="text-2xl font-light text-white/90 mb-4"
            >
              Expert Furniture Transformation
            </motion.h2>

            <motion.h1
              variants={fadeIn}
              className="text-4xl md:text-5xl lg:text-6xl font-normal text-white mb-6 leading-tight"
            >
              ColorCraft
              <motion.span 
                className="font-bold relative ml-2 inline-block"
                style={{ y: parallaxY, scale: parallaxScale }}
              >
                Furniture
              </motion.span>
            </motion.h1>

            <motion.p
              variants={fadeIn}
              className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto"
            >
              We transform ordinary furniture into extraordinary statements, combining traditional craftsmanship with modern design to create pieces that truly reflect your vision.
            </motion.p>

            <motion.div
              variants={fadeIn}
              className="flex flex-wrap gap-5 justify-center"
            >
              <Link
                href="/portfolio"
                className="px-8 py-3 border-2 border-white text-white hover:bg-white hover:text-gray-900 transition duration-300 text-lg"
              >
                View Our Work
              </Link>
              <Link
                href="/contact"
                className="px-8 py-3 bg-primary border-2 border-primary text-white hover:bg-primary/90 transition duration-300 text-lg"
              >
                Get a Quote
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">About ColorCraft</h2>
          <p className="text-lg text-gray-600">
            We are a team of passionate artisans dedicated to bringing new life
            to your beloved furniture pieces. With years of experience, we
            provide high-quality craftsmanship and exceptional customer
            service.
          </p>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            Featured Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Services</h2>
          <p className="text-lg text-gray-600 mb-8">
            We offer a wide range of services to meet your furniture
            transformation needs:
          </p>
          <ul className="list-disc list-inside text-left max-w-md mx-auto">
            <li className="mb-2">Custom Furniture Painting</li>
            <li className="mb-2">Furniture Restoration</li>
            <li className="mb-2">Upcycling and Repurposing</li>
            <li className="mb-2">Color Matching and Consultation</li>
            <li className="mb-2">Antique Furniture Refinishing</li>
          </ul>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            What Our Clients Say
          </h2>
          {/* Add testimonial components or content here */}
          <p className="text-lg text-gray-600 italic max-w-xl mx-auto">
            "ColorCraft transformed my old dresser into a stunning centerpiece!
            I couldn't be happier with the results." - Jane D.
          </p>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 px-4 bg-blue-500">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Ready to Transform Your Furniture?
          </h2>
          <Link href="/contact">
            <button className="px-6 py-3 bg-white text-blue-500 font-semibold rounded-full hover:bg-blue-100 transition duration-300">
              Contact Us Today
            </button>
          </Link>
        </div>
      </section>
    </div>
  )
}
