"use client";

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

export default function Home() {
  const [currentProject, setCurrentProject] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  
  const projects = [
    {
      name: "Vintage Collection",
      image: "/images/portfolio/vintage-dresser.jpg",
      description: "Crafting timeless pieces that embrace history and character. Every restoration preserves the story while adding new chapters of beauty."
    },
    {
      name: "Modern Elegance",
      image: "/images/portfolio/midcentury-cabinet.jpg",
      description: "Creating sophisticated furniture with clean lines and contemporary finishes. Minimalist design meets maximum impact."
    },
    {
      name: "Farmhouse Charm",
      image: "/images/portfolio/farmhouse-table.jpg",
      description: "Bringing warmth and rustic character to every piece. Traditional techniques with a fresh perspective."
    }
  ];
  
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        ease: "easeOut"
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
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-screen w-full">
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
          <div className="absolute inset-0 bg-black/30 bg-gradient-to-b from-black/50 to-transparent"></div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div 
            initial="hidden" 
            animate="visible" 
            variants={stagger}
            className="container mx-auto px-6 text-center md:px-10 md:text-left lg:max-w-4xl"
          >
            <motion.h2 
              variants={fadeIn}
              className="text-2xl font-light text-white/90 mb-4"
            >
              Expert Furniture Transformation
            </motion.h2>
            
            <motion.h1 
              variants={fadeIn}
              className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-6 leading-tight"
            >
              ColorCraft <span className="font-bold">Furniture</span>
            </motion.h1>
            
            <motion.p 
              variants={fadeIn}
              className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl"
            >
              We transform ordinary furniture into extraordinary statements, combining traditional craftsmanship with modern design to create pieces that truly reflect your vision.
            </motion.p>
            
            <motion.div 
              variants={fadeIn}
              className="flex flex-wrap gap-5 justify-center md:justify-start"
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
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-4xl font-light mb-8">About <span className="font-semibold">Us</span></h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-10">
              At ColorCraft, we believe that furniture is more than just practical—it's an expression of your personal style. 
              Our mission is to transform ordinary pieces into extraordinary statements, 
              combining traditional craftsmanship with contemporary design sensibilities to create furniture that truly reflects your vision.
            </p>
            <Link
              href="/about"
              className="inline-flex items-center text-primary font-medium hover:underline group"
            >
              Learn more about our story
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transform transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-light mb-4">Featured <span className="font-semibold">Projects</span></h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Explore our portfolio of transformations that have turned cherished furniture into stunning centerpieces.
            </p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            variants={stagger}
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              {
                title: "Vintage Dresser Restoration",
                image: "/images/portfolio/dresser.png",
                category: "Restoration"
              },
              {
                title: "Midcentury Cabinet Makeover",
                image: "/images/portfolio/cabinet.png",
                category: "Modern"
              },
              {
                title: "Elegant Bookcase Transformation",
                image: "/images/portfolio/bookcase.png",
                category: "Custom Painting"
              }
            ].map((project, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                className="group overflow-hidden"
              >
                <div className="relative h-96 overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute inset-0 p-8 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <span className="text-primary text-sm font-medium tracking-wider uppercase">{project.category}</span>
                    <h3 className="text-white text-2xl font-light mt-2">{project.title}</h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          <div className="text-center mt-12">
            <Link
              href="/portfolio"
              className="inline-flex items-center px-8 py-3 border-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors duration-300"
            >
              View All Projects
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-light mb-4">Our <span className="font-semibold">Services</span></h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              From restoration to custom finishes, we offer comprehensive furniture transformation services.
            </p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            variants={stagger}
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              {
                title: "Custom Furniture Painting",
                description: "Transform your furniture with custom colors and finishes tailored to your style.",
                icon: "🎨",
              },
              {
                title: "Furniture Restoration",
                description: "Bring antique and vintage pieces back to life with our careful restoration process.",
                icon: "🔨",
              },
              {
                title: "Upcycling & Repurposing",
                description: "Give old furniture new purpose with creative upcycling and design solutions.",
                icon: "♻️",
              },
              {
                title: "Cabinet Refinishing",
                description: "Update your kitchen or bathroom with cabinet refinishing for a fresh new look.",
                icon: "🚪",
              },
              {
                title: "Specialty Finishes",
                description: "Explore unique textures and effects with our specialty finishing techniques.",
                icon: "✨",
              },
              {
                title: "Furniture Repair",
                description: "Fix structural issues, damaged surfaces, and more with our expert repair services.",
                icon: "🛠️",
              },
            ].map((service, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                className="p-6 border border-gray-100 hover:border-primary transition-colors duration-300"
              >
                <div className="mb-4 text-4xl">{service.icon}</div>
                <h3 className="mb-3 text-xl font-light text-gray-900">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </motion.div>
            ))}
          </motion.div>
          
          <div className="text-center mt-12">
            <Link
              href="/services"
              className="inline-flex items-center px-8 py-3 border-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors duration-300"
            >
              Explore All Services
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-24 bg-gray-900 text-white">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center max-w-4xl mx-auto"
          >
            <h3 className="text-primary text-lg font-medium mb-3">CLIENT TESTIMONIALS</h3>
            <h2 className="text-3xl md:text-4xl font-light mb-10 leading-tight">
              "The team at ColorCraft transformed our outdated dresser into a stunning centerpiece. Their attention to detail and craftsmanship exceeded our expectations."
            </h2>
            <p className="text-lg text-white/70">Sarah & Michael Thompson</p>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-white">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="flex flex-col lg:flex-row items-center justify-between gap-8"
          >
            <div className="lg:w-2/3">
              <h2 className="text-3xl md:text-4xl font-light mb-4">Ready to transform your furniture?</h2>
              <p className="text-xl text-white/80">
                Contact us today to discuss your project or schedule a consultation.
              </p>
            </div>
            <div>
              <Link
                href="/contact"
                className="inline-block px-10 py-4 bg-white text-primary text-lg hover:bg-white/90 transition-colors duration-300"
              >
                Get Started
              </Link>
            </div>
          </motion.div>
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
