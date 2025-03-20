"use client";

import Link from 'next/link'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'

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
      setCurrentProjectIndex((prevIndex) => (prevIndex + 1) % 4); // Changed from projects.length to 4
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
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"></div>
        </div>
        
        {/* Content - RealVantage Style */}
        <div className="relative h-full flex flex-col justify-center items-center">
          <div className="container mx-auto px-6 text-center max-w-4xl mb-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-24"
            >
              <h1 className="text-2xl md:text-3xl lg:text-4xl text-white font-light leading-relaxed mb-6">
                Crafting beautiful furniture that transforms ordinary spaces into extraordinary homes. Each piece tells a story, where artistry and functionality create lasting impressions.
              </h1>
            </motion.div>
          </div>
          
          {/* Bottom Property-style Box */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="absolute bottom-16 left-0 right-0 mx-auto max-w-xl bg-white/90 backdrop-blur-md p-8 rounded-lg shadow-lg"
          >
            <h2 className="text-3xl md:text-4xl font-semibold text-dark mb-2">Vintage Dresser Restoration</h2>
            <p className="text-neutral-700 mb-5">Custom Hand-Painted, Solid Mahogany, $1,450</p>
            <div className="flex justify-between items-center">
              <Link
                href="/portfolio"
                className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-700 transition duration-300"
              >
                View Similar Projects
              </Link>
              <Link
                href="/contact"
                className="text-primary hover:text-primary-700 font-medium flex items-center"
              >
                Request Quote
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </motion.div>
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

      {/* Featured Portfolio Section - RealVantage Style */}
      <section className="py-24 px-4 bg-[#0d1b37]">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h4 className="text-primary-300 uppercase tracking-wider text-sm font-medium mb-3">Our Work</h4>
            <h2 className="text-3xl md:text-5xl font-light mb-6 leading-tight text-white">Featured Portfolio</h2>
            <div className="w-20 h-1 bg-secondary mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Featured Item 1 */}
            <div className="group relative rounded-lg overflow-hidden shadow-medium h-[450px]">
              <Image 
                src="/images/portfolio/dresser.png" 
                alt="Vintage Dresser Restoration" 
                fill
                className="object-cover transition-all duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-xl font-medium mb-2">Vintage Dresser</h3>
                <div className="flex flex-col space-y-1 text-sm opacity-90 mb-4">
                  <span>Custom Hand-Painted</span>
                  <span>Solid Mahogany</span>
                  <span className="font-medium text-base">$1,450</span>
                </div>
                <Link href="/portfolio/vintage-dresser" className="inline-block text-white bg-primary/90 hover:bg-primary px-4 py-2 rounded text-sm transition-colors duration-300">
                  View Details
                </Link>
              </div>
            </div>
            
            {/* Featured Item 2 */}
            <div className="group relative rounded-lg overflow-hidden shadow-medium h-[450px]">
              <Image 
                src="/images/portfolio/dining-table.png" 
                alt="Farmhouse Dining Table" 
                fill
                className="object-cover transition-all duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-xl font-medium mb-2">Farmhouse Dining Table</h3>
                <div className="flex flex-col space-y-1 text-sm opacity-90 mb-4">
                  <span>Traditional Finish</span>
                  <span>Reclaimed Oak</span>
                  <span className="font-medium text-base">$2,250</span>
                </div>
                <Link href="/portfolio/farmhouse-table" className="inline-block text-white bg-primary/90 hover:bg-primary px-4 py-2 rounded text-sm transition-colors duration-300">
                  View Details
                </Link>
              </div>
            </div>
            
            {/* Featured Item 3 */}
            <div className="group relative rounded-lg overflow-hidden shadow-medium h-[450px]">
              <Image 
                src="/images/portfolio/bookcase.png" 
                alt="Modern Bookcase" 
                fill
                className="object-cover transition-all duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-xl font-medium mb-2">Modern Bookcase</h3>
                <div className="flex flex-col space-y-1 text-sm opacity-90 mb-4">
                  <span>Contemporary Design</span>
                  <span>Walnut & Steel</span>
                  <span className="font-medium text-base">$1,850</span>
                </div>
                <Link href="/portfolio/modern-bookcase" className="inline-block text-white bg-primary/90 hover:bg-primary px-4 py-2 rounded text-sm transition-colors duration-300">
                  View Details
                </Link>
              </div>
            </div>
            
            {/* Featured Item 4 */}
            <div className="group relative rounded-lg overflow-hidden shadow-medium h-[450px]">
              <Image 
                src="/images/portfolio/cabinet.png" 
                alt="Antique Cabinet" 
                fill
                className="object-cover transition-all duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-xl font-medium mb-2">Antique Cabinet</h3>
                <div className="flex flex-col space-y-1 text-sm opacity-90 mb-4">
                  <span>Victorian Restoration</span>
                  <span>Cherry Wood</span>
                  <span className="font-medium text-base">$3,150</span>
                </div>
                <Link href="/portfolio/antique-cabinet" className="inline-block text-white bg-primary/90 hover:bg-primary px-4 py-2 rounded text-sm transition-colors duration-300">
                  View Details
                </Link>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link href="/portfolio" className="inline-flex items-center text-primary hover:text-primary-700 font-medium">
              View All Portfolio Pieces
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
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
