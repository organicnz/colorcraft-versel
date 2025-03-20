"use client";

import Link from 'next/link'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const fadeInRight = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
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
      setCurrentProjectIndex((prevIndex) => (prevIndex + 1) % 4);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section ref={heroRef} className="relative h-screen w-full overflow-hidden">
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
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]"></div>
        </div>
        
        {/* Content - RealVantage Style */}
        <div className="relative h-full flex flex-col justify-center items-center">
          <div className="container mx-auto px-6 text-center max-w-4xl mb-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="mb-24"
            >
              <motion.h1 
                className="text-2xl md:text-3xl lg:text-4xl text-white font-light leading-relaxed mb-8 tracking-tight"
                style={{ opacity: textOpacity }}
              >
                Crafting beautiful furniture that transforms ordinary spaces into <span className="text-primary-300 font-normal">extraordinary homes</span>. Each piece tells a story, where artistry and functionality create lasting impressions.
              </motion.h1>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="flex flex-wrap justify-center gap-4 mt-8"
              >
                <Link href="/portfolio" className="px-6 py-3 bg-primary text-white rounded hover:bg-primary-light transition-colors duration-300">
                  View Our Work
                </Link>
                <Link href="/contact" className="px-6 py-3 border border-white/20 text-white rounded hover:bg-white/10 transition-colors duration-300">
                  Get in Touch
                </Link>
              </motion.div>
            </motion.div>
          </div>
          
          {/* Bottom Property-style Box */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="absolute bottom-16 left-0 right-0 mx-auto max-w-xl bg-white/90 backdrop-blur-md p-8 rounded-lg shadow-lg"
          >
            <h2 className="text-2xl md:text-3xl font-light text-gray-800 mb-2">Vintage Dresser Restoration</h2>
            <p className="text-gray-600 mb-5 font-light">Custom Hand-Painted, Solid Mahogany, $1,450</p>
            <div className="flex justify-between items-center">
          <Link 
            href="/portfolio" 
                className="px-5 py-2 bg-primary text-white rounded hover:bg-primary-light transition-colors duration-300 text-sm"
          >
                View Similar Projects
          </Link>
          <Link 
            href="/contact" 
                className="text-primary hover:text-primary-dark transition-colors flex items-center text-sm"
              >
                Request Quote
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Section - Redesigned with RealVantage inspiration */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div
              variants={fadeInLeft}
              initial="hidden"
              whileInView="visible"
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
              variants={fadeInRight}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="flex flex-col justify-center"
            >
              <h4 className="text-primary uppercase tracking-wider text-sm font-medium mb-3">About Color&Craft</h4>
              <h2 className="text-3xl md:text-4xl font-light mb-6 leading-tight text-gray-800">Creating <span className="font-medium">Beautiful Furniture</span> That Transforms Spaces</h2>
              
              <div className="bg-white p-6 rounded-lg mb-8 shadow-sm">
                <p className="text-gray-600 leading-relaxed font-light">
                  At Color&Craft Furniture Painter, we believe that furniture is more than just functional—it's an expression of your personal style. Our team of passionate artisans is dedicated to bringing new life to your beloved furniture pieces through expert craftsmanship and innovative design solutions.
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-start bg-white p-4 rounded-lg shadow-sm hover-lift">
                  <div className="bg-primary/20 p-3 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800 mb-1">Expert Artisans</h3>
                    <p className="text-sm text-gray-600 font-light">Years of experience in furniture transformation</p>
                  </div>
                </div>
                <div className="flex items-start bg-white p-4 rounded-lg shadow-sm hover-lift">
                  <div className="bg-primary/20 p-3 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800 mb-1">Quality Materials</h3>
                    <p className="text-sm text-gray-600 font-light">Premium paints and finishes for lasting beauty</p>
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
      <section className="py-24 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h4 className="text-primary uppercase tracking-wider text-sm font-medium mb-3">Our Work</h4>
            <h2 className="text-3xl md:text-5xl font-light mb-6 leading-tight text-gray-800">Featured Portfolio</h2>
            <div className="w-20 h-[2px] bg-primary/50 mx-auto"></div>
          </div>
          
          <motion.div 
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {/* Featured Item 1 */}
            <motion.div 
              variants={fadeIn}
              className="group relative rounded-lg overflow-hidden shadow-xl h-[450px] hover-lift"
            >
              <Image 
                src="/images/portfolio/dresser.png" 
                alt="Vintage Dresser Restoration" 
                fill
                className="object-cover transition-all duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform transition-transform duration-300 group-hover:translate-y-0">
                <h3 className="text-xl font-light mb-2">Vintage Dresser</h3>
                <div className="flex flex-col space-y-1 text-sm opacity-90 mb-4 font-light">
                  <span>Custom Hand-Painted</span>
                  <span>Solid Mahogany</span>
                  <span className="font-medium text-base">$1,450</span>
                </div>
                <Link href="/portfolio/vintage-dresser" className="inline-block text-white bg-primary hover:bg-primary-light px-4 py-2 rounded text-sm transition-colors duration-300">
                  View Details
                </Link>
              </div>
            </motion.div>
            
            {/* Featured Item 2 */}
            <motion.div 
              variants={fadeIn}
              className="group relative rounded-lg overflow-hidden shadow-xl h-[450px] hover-lift"
            >
              <Image 
                src="/images/portfolio/dining-table.png" 
                alt="Farmhouse Dining Table" 
                fill
                className="object-cover transition-all duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform transition-transform duration-300 group-hover:translate-y-0">
                <h3 className="text-xl font-light mb-2">Farmhouse Dining Table</h3>
                <div className="flex flex-col space-y-1 text-sm opacity-90 mb-4 font-light">
                  <span>Traditional Finish</span>
                  <span>Reclaimed Oak</span>
                  <span className="font-medium text-base">$2,250</span>
                </div>
                <Link href="/portfolio/farmhouse-table" className="inline-block text-white bg-primary hover:bg-primary-light px-4 py-2 rounded text-sm transition-colors duration-300">
                  View Details
                </Link>
              </div>
            </motion.div>
            
            {/* Featured Item 3 */}
            <motion.div 
              variants={fadeIn}
              className="group relative rounded-lg overflow-hidden shadow-xl h-[450px] hover-lift"
            >
              <Image 
                src="/images/portfolio/bookcase.png" 
                alt="Modern Bookcase" 
                fill
                className="object-cover transition-all duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform transition-transform duration-300 group-hover:translate-y-0">
                <h3 className="text-xl font-light mb-2">Modern Bookcase</h3>
                <div className="flex flex-col space-y-1 text-sm opacity-90 mb-4 font-light">
                  <span>Contemporary Design</span>
                  <span>Walnut & Steel</span>
                  <span className="font-medium text-base">$1,850</span>
                </div>
                <Link href="/portfolio/modern-bookcase" className="inline-block text-white bg-primary hover:bg-primary-light px-4 py-2 rounded text-sm transition-colors duration-300">
                  View Details
                </Link>
              </div>
            </motion.div>
            
            {/* Featured Item 4 */}
            <motion.div 
              variants={fadeIn}
              className="group relative rounded-lg overflow-hidden shadow-xl h-[450px] hover-lift"
            >
              <Image 
                src="/images/portfolio/cabinet.png" 
                alt="Antique Cabinet" 
                fill
                className="object-cover transition-all duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform transition-transform duration-300 group-hover:translate-y-0">
                <h3 className="text-xl font-light mb-2">Antique Cabinet</h3>
                <div className="flex flex-col space-y-1 text-sm opacity-90 mb-4 font-light">
                  <span>Victorian Restoration</span>
                  <span>Cherry Wood</span>
                  <span className="font-medium text-base">$3,150</span>
                </div>
                <Link href="/portfolio/antique-cabinet" className="inline-block text-white bg-primary hover:bg-primary-light px-4 py-2 rounded text-sm transition-colors duration-300">
                  View Details
                </Link>
              </div>
            </motion.div>
          </motion.div>
          
          <div className="text-center mt-12">
            <Link href="/portfolio" className="inline-flex items-center text-primary hover:text-primary-dark font-medium group">
              View All Portfolio Pieces
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transform transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="container mx-auto text-center">
          <h4 className="text-primary uppercase tracking-wider text-sm font-medium mb-3">What We Offer</h4>
          <h2 className="text-3xl md:text-4xl font-light mb-10 text-gray-800">Our Services</h2>
          
          <motion.div 
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto"
          >
            {/* Service 1 */}
            <motion.div variants={fadeIn} className="bg-white p-6 rounded-lg shadow-md hover-lift">
              <div className="bg-primary/20 p-4 rounded-full mx-auto mb-5 w-16 h-16 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-3 text-gray-800">Custom Furniture Painting</h3>
              <p className="text-gray-600 font-light text-sm mb-4">Transform your furniture with our premium, professional painting services, customized to your exact specifications.</p>
              <Link href="/services/custom-painting" className="text-primary hover:text-primary-dark text-sm font-medium">Learn More</Link>
            </motion.div>
            
            {/* Service 2 */}
            <motion.div variants={fadeIn} className="bg-white p-6 rounded-lg shadow-md hover-lift">
              <div className="bg-primary/20 p-4 rounded-full mx-auto mb-5 w-16 h-16 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-3 text-gray-800">Furniture Restoration</h3>
              <p className="text-gray-600 font-light text-sm mb-4">Bring your cherished pieces back to life with our comprehensive restoration services, preserving their unique character.</p>
              <Link href="/services/restoration" className="text-primary hover:text-primary-dark text-sm font-medium">Learn More</Link>
            </motion.div>
            
            {/* Service 3 */}
            <motion.div variants={fadeIn} className="bg-white p-6 rounded-lg shadow-md hover-lift">
              <div className="bg-primary/20 p-4 rounded-full mx-auto mb-5 w-16 h-16 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-3 text-gray-800">Upcycling & Repurposing</h3>
              <p className="text-gray-600 font-light text-sm mb-4">Give old furniture new purpose with our creative upcycling services, combining sustainability with innovative design.</p>
              <Link href="/services/upcycling" className="text-primary hover:text-primary-dark text-sm font-medium">Learn More</Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-4 bg-white">
        <div className="container mx-auto text-center">
          <h4 className="text-primary uppercase tracking-wider text-sm font-medium mb-3">Client Testimonials</h4>
          <h2 className="text-3xl md:text-4xl font-light mb-16 text-gray-800">What Our Clients Say</h2>
          
          <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-md">
            <svg className="w-12 h-12 text-primary/50 mx-auto mb-6" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path d="M464 256h-80v-64c0-35.3 28.7-64 64-64h8c13.3 0 24-10.7 24-24V56c0-13.3-10.7-24-24-24h-8c-88.4 0-160 71.6-160 160v240c0 26.5 21.5 48 48 48h128c26.5 0 48-21.5 48-48V304c0-26.5-21.5-48-48-48zm-288 0H96v-64c0-35.3 28.7-64 64-64h8c13.3 0 24-10.7 24-24V56c0-13.3-10.7-24-24-24h-8C71.6 32 0 103.6 0 192v240c0 26.5 21.5 48 48 48h128c26.5 0 48-21.5 48-48V304c0-26.5-21.5-48-48-48z"></path>
            </svg>
            <p className="text-xl text-gray-700 font-light italic mb-8">
              "Color&Craft Furniture Painter transformed my grandmother's old dresser into a stunning centerpiece for our bedroom. The attention to detail and craftsmanship exceeded all my expectations."
            </p>
            <div className="flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-primary/20 mr-4 overflow-hidden">
                <Image src="/images/testimonial-1.jpg" width={48} height={48} alt="Jane D." className="object-cover" />
              </div>
              <div className="text-left">
                <h4 className="font-medium text-gray-800">Jane Donovan</h4>
                <p className="text-gray-500 text-sm">Los Angeles, CA</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-24 px-4 bg-gradient-to-r from-primary-900 to-primary-700">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-light mb-6 text-white">
            Ready to Transform Your Furniture?
          </h2>
          <p className="text-white/80 mb-10 font-light">
            Contact us today to discuss your furniture transformation project. Our expert team is ready to bring your vision to life.
          </p>
          <Link href="/contact">
            <button className="px-8 py-3 bg-white text-primary font-medium hover:bg-white/90 transition duration-300 rounded">
              Contact Us Today
            </button>
          </Link>
        </div>
      </section>
      </div>
  );
}
