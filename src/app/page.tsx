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
  
  // Properties data for carousel
  const properties = [
    {
      id: 1,
      title: "Kitchen Cabinet Refresh",
      location: "San Francisco, CA",
      price: "$1,800",
      type: "Cabinet Painting",
      return: "Completed 2023",
      image: "/images/hero-kitchen.png"
    },
    {
      id: 2,
      title: "Antique Furniture Revival",
      location: "Oakland, CA",
      price: "$950",
      type: "Furniture Restoration",
      return: "Completed 2023", 
      image: "/images/hero-furniture.png"
    },
    {
      id: 3,
      title: "Vintage Dresser Makeover",
      location: "San Jose, CA",
      price: "$750",
      type: "Custom Painting",
      return: "Completed 2023",
      image: "/images/portfolio/dresser.png"
    },
    {
      id: 4,
      title: "Modern Dining Set",
      location: "Palo Alto, CA",
      price: "$1,200",
      type: "Furniture Painting",
      return: "Completed 2023",
      image: "/images/hero-kitchen.png"
    }
  ];

  // Auto-rotate projects every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentProjectIndex((prevIndex) => (prevIndex + 1) % properties.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [properties.length]);

  const currentProperty = properties[currentProjectIndex];

  return (
    <div className="min-h-screen">
      {/* Hero Section - Color & Craft Style */}
      <section ref={heroRef} className="relative pt-24 pb-16 md:pt-32 md:pb-24 bg-gray-50 dark:bg-gray-900 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="max-w-2xl"
            >
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-gray-800 dark:text-white leading-tight mb-6">
                Transform your furniture with <span className="font-medium text-primary">expert painting</span> services
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 font-light">
                Breathe new life into your beloved furniture pieces with our professional painting and restoration services. From vintage revivals to modern makeovers.
              </p>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
                <div className="flex flex-col mb-4">
                  <label htmlFor="email" className="text-sm text-gray-600 dark:text-gray-400 mb-2">Request a free consultation</label>
                  <input
                    type="email"
                    id="email"
                    placeholder="you@example.com"
                    className="p-3 border border-gray-300 dark:border-gray-700 rounded-md"
                  />
                </div>
                <button className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-3 px-6 rounded-md transition-colors">
                  Get Started
                </button>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
                  Professional furniture painting services
                </p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              <div className="relative h-[400px] md:h-[500px] w-full overflow-hidden rounded-lg shadow-2xl">
                <Image
                  src={currentProperty.image}
                  alt="Furniture project showcase"
                  fill
                  className="object-cover"
                  priority
                />
                {/* Property Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6">
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-primary text-sm font-medium px-2 py-1 rounded bg-primary/10 mb-2 inline-block">
                        {currentProperty.type}
                      </span>
                      <h3 className="text-xl md:text-2xl font-light text-white mb-1">
                        {currentProperty.title}
                      </h3>
                      <p className="text-gray-300 text-sm mb-1">
                        {currentProperty.location}
                      </p>
                      <div className="flex items-center mt-2">
                        <span className="text-white font-bold mr-3">{currentProperty.price}</span>
                        <span className="text-green-400 text-sm">{currentProperty.return}</span>
                      </div>
                    </div>
                    <Link
                      href="/portfolio"
                      className="bg-primary hover:bg-primary-dark text-white text-sm px-4 py-2 rounded transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
              
              {/* Property Indicators */}
              <div className="flex justify-center mt-6 space-x-2">
                {properties.map((property, index) => (
                  <button
                    key={property.id}
                    onClick={() => setCurrentProjectIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentProjectIndex
                        ? "bg-primary w-6"
                        : "bg-gray-300 dark:bg-gray-700"
                    }`}
                    aria-label={`View ${property.title}`}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section - Color & Craft Style */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h4 className="text-primary uppercase tracking-wider text-sm font-medium mb-3">How It Works</h4>
            <h2 className="text-3xl md:text-4xl font-light mb-6 leading-tight text-gray-800 dark:text-white">Transform your furniture <span className="font-medium">in three simple steps</span></h2>
            <div className="w-20 h-[2px] bg-primary/50 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="bg-gray-50 dark:bg-gray-900 p-8 rounded-lg shadow-sm hover-lift"
            >
              <div className="bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-4 text-gray-800 dark:text-white">Initial Consultation</h3>
              <p className="text-gray-600 dark:text-gray-300 font-light mb-6">
                Schedule a free consultation to discuss your furniture piece, desired finish, and timeline. We'll provide expert advice and a custom quote.
              </p>
              <Link href="/services" className="text-primary inline-flex items-center group">
                Learn more
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 transform transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </motion.div>
            
            <motion.div
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="bg-gray-50 dark:bg-gray-900 p-8 rounded-lg shadow-sm hover-lift"
            >
              <div className="bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-4 text-gray-800 dark:text-white">Preparation & Painting</h3>
              <p className="text-gray-600 dark:text-gray-300 font-light mb-6">
                We carefully prepare your furniture, removing old finishes and repairing imperfections. Then we apply premium paints and finishes for a flawless result.
              </p>
              <Link href="/services" className="text-primary inline-flex items-center group">
                Learn more
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 transform transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </motion.div>
            
            <motion.div
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="bg-gray-50 dark:bg-gray-900 p-8 rounded-lg shadow-sm hover-lift"
            >
              <div className="bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-4 text-gray-800 dark:text-white">Delivery & Care Guide</h3>
              <p className="text-gray-600 dark:text-gray-300 font-light mb-6">
                We deliver your beautifully transformed furniture and provide a personalized care guide to ensure your piece maintains its stunning finish for years to come.
              </p>
              <Link href="/services" className="text-primary inline-flex items-center group">
                Learn more
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 transform transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Platform Section */}
      <section className="py-16 md:py-24 px-4 bg-gray-50 dark:bg-gray-900">
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
                <div className="relative h-[400px] w-full overflow-hidden rounded-lg shadow-xl z-10">
                  <Image
                    src="/images/portfolio/dresser.png"
                    alt="Platform dashboard"
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
              <h4 className="text-primary uppercase tracking-wider text-sm font-medium mb-3">About Color & Craft</h4>
              <h2 className="text-3xl md:text-4xl font-light mb-6 leading-tight text-gray-800 dark:text-white">Award-winning <span className="font-medium">furniture painting</span> and restoration studio</h2>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg mb-8 shadow-sm">
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-light">
                  At Color & Craft, we transform treasured furniture pieces into stunning works of art. Our team of skilled artisans combines traditional techniques with modern finishes to breathe new life into your furniture. Whether you're looking to refresh a family heirloom or update a thrift store find, we bring your vision to life.
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-start bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm hover-lift">
                  <div className="bg-primary/20 p-3 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800 dark:text-white mb-1">Premium Materials</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 font-light">We use only the highest quality paints and finishes</p>
                  </div>
                </div>
                <div className="flex items-start bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm hover-lift">
                  <div className="bg-primary/20 p-3 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800 dark:text-white mb-1">Skilled Craftspeople</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 font-light">Our artisans have years of professional experience</p>
                  </div>
                </div>
              </div>
              
              <Link href="/about" className="inline-flex items-center mt-8 text-primary font-medium group">
                Learn more about our studio
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transform transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-24 px-4 bg-white dark:bg-gray-800">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h4 className="text-primary uppercase tracking-wider text-sm font-medium mb-3">Our Latest Work</h4>
            <h2 className="text-3xl md:text-5xl font-light mb-6 leading-tight text-gray-800 dark:text-white">Featured Projects</h2>
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
                src="/images/portfolio/farmhouse-dining-table.png"
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
              "Color & Craft Furniture Painter transformed my grandmother's old dresser into a stunning centerpiece for our bedroom. The attention to detail and craftsmanship exceeded all my expectations."
            </p>
            <div className="flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-primary/20 mr-4 overflow-hidden">
                <Image
                  src="/images/testimonials/rustam-testimonial.png"
                  width={48}
                  height={48}
                  alt="Rustam Avanesian"
                  className="object-cover"
                />
              </div>
              <div className="text-left">
                <h4 className="font-medium text-gray-800">Rustam Avanesian</h4>
                <p className="text-gray-500 text-sm">Los Angeles, CA</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-24 px-4 bg-gradient-to-r from-primary to-accent">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-light mb-6 text-white">
            Ready to Transform Your Furniture?
          </h2>
          <p className="text-white/80 mb-10 font-light">
            Contact us today to discuss your furniture transformation project. Our expert team is ready to bring your vision to life.
          </p>
          <Link href="/contact">
            <button className="px-8 py-3 bg-white text-primary font-medium hover:bg-white/90 transition duration-300 rounded shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Contact Us Today
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
