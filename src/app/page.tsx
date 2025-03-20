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
      <section ref={heroRef} className="relative h-screen w-full">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-kitchen.png"
            alt="Modern kitchen interior"
            fill
            className="object-cover"
            priority
            onError={(e) => {
              // Fallback to another image if hero-kitchen.png fails to load
              const target = e.target as HTMLImageElement;
              target.onerror = null; // Prevent infinite loops
              target.src = "/images/hero-furniture.png"; // Fallback image
            }}
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
        
        {/* Content */}
        <div className="relative h-full flex items-center">
          <div className="container mx-auto px-6 py-16">
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
        </div>
      </section>

      {/* About Section - Redesigned with RealVantage inspiration */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/10 rounded-tl-2xl z-0"></div>
                <div className="relative h-[500px] w-full overflow-hidden rounded-lg shadow-xl z-10">
                  <Image
                    src="/images/portfolio/dresser.png"
                    alt="Our craftsmanship"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-primary/20 rounded-br-2xl z-0"></div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true, margin: "-100px" }}
              className="flex flex-col justify-center"
            >
              <h4 className="text-primary uppercase tracking-wider text-sm font-medium mb-3">About ColorCraft</h4>
              <h2 className="text-3xl md:text-4xl font-light mb-6 leading-tight">Creating <span className="font-semibold">Beautiful Furniture</span> That Transforms Spaces</h2>
              
              <div className="bg-gray-50 p-6 rounded-lg mb-8">
                <p className="text-gray-600 leading-relaxed">
                  At ColorCraft, we believe that furniture is more than just functional—it's an expression of your personal style. Our team of passionate artisans is dedicated to bringing new life to your beloved furniture pieces through expert craftsmanship and innovative design solutions.
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-start">
                  <div className="bg-primary/10 p-3 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Expert Artisans</h3>
                    <p className="text-sm text-gray-600">Years of experience in furniture transformation</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-primary/10 p-3 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Quality Materials</h3>
                    <p className="text-sm text-gray-600">Premium paints and finishes for lasting beauty</p>
                  </div>
                </div>
              </div>
              
              <Link href="/about" className="inline-flex items-center mt-8 text-primary font-medium group">
                Learn more about our story
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transform transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-16 px-4 bg-gray-50">
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
      <section className="py-16 px-4">
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
      <section className="py-16 px-4 bg-gray-50">
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
      <section className="py-16 px-4 bg-primary">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Ready to Transform Your Furniture?
          </h2>
          <Link href="/contact">
            <button className="px-6 py-3 bg-white text-primary font-semibold hover:bg-white/90 transition duration-300">
              Contact Us Today
            </button>
          </Link>
        </div>
      </section>
    </div>
  )
}
