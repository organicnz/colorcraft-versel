"use client";

import Link from 'next/link'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GlassPanel } from "@/components/ui/glass-card"; // Import from the correct file
import { ArrowRight, Award, Palette, Send, Settings, Sparkles } from "lucide-react";
import { AnimatePresence } from 'framer-motion';

// Animation variants
const fadeIn = (delay = 0, duration = 0.8) => ({
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration, delay, ease: "easeOut" } }
});

const staggerContainer = (staggerChildren = 0.2, delayChildren = 0) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren,
      delayChildren,
    }
  }
});

// Dummy data (replace with actual data fetching if needed)
const featuredProjects = [
  {
    id: "vintage-dresser",
    title: "Vintage Dresser",
    description: "Custom Hand-Painted",
    material: "Solid Mahogany",
    price: "$1,450",
    image: "/images/portfolio/dresser.png",
  },
  {
    id: "farmhouse-table",
    title: "Farmhouse Dining Table",
    description: "Traditional Finish",
    material: "Reclaimed Oak",
    price: "$2,250",
    image: "/images/portfolio/farmhouse-dining-table.png",
  },
  {
    id: "modern-bookcase",
    title: "Modern Bookcase",
    description: "Contemporary Design",
    material: "Walnut & Steel",
    price: "$1,850",
    image: "/images/portfolio/bookcase.png",
  },
  {
    id: "antique-cabinet",
    title: "Antique Cabinet",
    description: "Victorian Restoration",
    material: "Cherry Wood",
    price: "$3,150",
    image: "/images/portfolio/cabinet.png",
  },
];

const services = [
  {
    title: "Custom Furniture Painting",
    description: "Transform your furniture with premium, professional painting services.",
    icon: Palette,
    link: "/services/custom-painting",
  },
  {
    title: "Furniture Restoration",
    description: "Bring cherished pieces back to life while preserving their unique character.",
    icon: Sparkles,
    link: "/services/restoration",
  },
  {
    title: "Upcycling & Repurposing",
    description: "Give old furniture new purpose with creative, sustainable upcycling.",
    icon: Settings,
    link: "/services/upcycling",
  },
];

const howItWorksSteps = [
  {
    title: "Initial Consultation",
    description: "Discuss your piece, desired finish, and timeline. Get expert advice and a custom quote.",
    icon: Send, // Example icon
    link: "/contact",
  },
  {
    title: "Preparation & Painting",
    description: "We carefully prep, repair, and apply premium paints for a flawless result.",
    icon: Palette, // Example icon
    link: "/services",
  },
  {
    title: "Delivery & Care Guide",
    description: "Receive your transformed furniture with a personalized care guide.",
    icon: Award, // Example icon
    link: "/about", // Link could go to FAQ or care guide page
  },
];

// ADDED: Testimonials Data
const testimonialsData = [
  {
    id: 1,
    quote: "Color & Craft transformed my grandmother's old dresser into a stunning centerpiece. The attention to detail and craftsmanship exceeded all expectations!",
    name: "Rustam Avanesian",
    location: "Los Angeles, CA",
    image: "/images/testimonials/rustam-testimonial.png", // Example path
  },
  {
    id: 2,
    quote: "Absolutely thrilled with the kitchen cabinet refresh. The team was professional, clean, and the finish is flawless. It feels like a brand new kitchen.",
    name: "Jessica Miller",
    location: "San Francisco, CA",
    image: "/images/testimonials/jessica-testimonial.png", // Example path
  },
  {
    id: 3,
    quote: "They brought my vintage armchair back to life! The restoration work is incredible, preserving the character while making it look fantastic. Highly recommend.",
    name: "David Chen",
    location: "Oakland, CA",
    image: "/images/testimonials/david-testimonial.png", // Example path
  },
];

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
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-neutral-50 dark:from-neutral-900 dark:to-neutral-800 -z-10" />

          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5 dark:opacity-10"
            style={{
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d3a273' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            }}
          />

          {/* Hero glow effect */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 rounded-full bg-primary-300 dark:bg-primary-500 opacity-20 dark:opacity-10 blur-[120px] -z-10" />

          <div className="container px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left column - text content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="order-2 lg:order-1"
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <span className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-secondary-100 text-secondary-700 dark:bg-secondary-900/30 dark:text-secondary-300 mb-6">
                    <span className="flex h-2 w-2 rounded-full bg-secondary-500 animate-pulse"></span>
                    <span>Furniture Painting Experts</span>
                  </span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                  className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-neutral-900 dark:text-white mb-6"
                >
                  Transform Your <span className="text-primary-500 dark:text-primary-400">Furniture</span> with Expert Craftsmanship
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.4 }}
                  className="text-lg md:text-xl text-neutral-600 dark:text-neutral-300 mb-8 max-w-xl"
                >
                  Breathe new life into your cherished furniture pieces with our premium painting and restoration services. Crafted with passion, precision, and premium materials.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.5 }}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <Button
                    className="bg-primary-500 hover:bg-primary-600 text-white"
                    size="lg"
                  >
                    Get Started
                  </Button>

                  <Button variant="outline" size="lg" className="border-2 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                    View Portfolio
                  </Button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.7 }}
                  className="mt-12"
                >
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-3">Trusted by homeowners across:</p>
                  <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                    <span className="text-neutral-400 dark:text-neutral-500 text-sm font-medium">San Francisco</span>
                    <span className="text-neutral-400 dark:text-neutral-500 text-sm font-medium">Oakland</span>
                    <span className="text-neutral-400 dark:text-neutral-500 text-sm font-medium">San Jose</span>
                    <span className="text-neutral-400 dark:text-neutral-500 text-sm font-medium">Palo Alto</span>
                  </div>
                </motion.div>
              </motion.div>

              {/* Right column - image and property card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="order-1 lg:order-2 relative"
              >
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-2xl">
                  <Image
                    src={currentProperty.image}
                    alt={currentProperty.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>

                  {/* Property info card */}
                  <GlassPanel className="absolute bottom-8 left-8 right-8 p-5">
                    <h3 className="text-xl font-semibold mb-2">{currentProperty.title}</h3>
                    <div className="flex flex-wrap gap-3 mb-3">
                      <Badge variant="secondary" className="bg-secondary-100 text-secondary-700 dark:bg-secondary-900/30 dark:text-secondary-300 rounded-full">
                        {currentProperty.type}
                      </Badge>
                      <Badge variant="outline" className="rounded-full">
                        {currentProperty.location}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-primary-500">{currentProperty.price}</span>
                      <span className="text-sm text-neutral-500 dark:text-neutral-400">{currentProperty.return}</span>
                    </div>
                  </GlassPanel>
                </div>

                {/* Image selector dots */}
                <div className="flex justify-center gap-2 mt-6">
                  {properties.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentProjectIndex(index)}
                      className={`h-2.5 rounded-full transition-all ${
                        currentProjectIndex === index
                          ? "w-8 bg-primary-500"
                          : "w-2.5 bg-neutral-300 dark:bg-neutral-600"
                      }`}
                      aria-label={`View project ${index + 1}`}
                    />
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container px-6">
          <div className="text-center mb-16">
              <h4 className="text-primary uppercase tracking-wider text-sm font-semibold mb-3">How It Works</h4>
              <h2 className="text-3xl md:text-4xl font-light mb-4 text-foreground">Transform your furniture <span className="font-semibold">in three simple steps</span></h2>
              <div className="w-20 h-1 bg-primary/30 mx-auto"></div>
          </div>

            <motion.div
              variants={staggerContainer()} initial="hidden" whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {howItWorksSteps.map((step, index) => (
            <motion.div
                  key={index}
                  variants={fadeIn(0, 0.6)}
                  className="text-center p-8 bg-card rounded-lg shadow-sm border border-border/50 hover:shadow-md transition-shadow"
                >
                  <div className="bg-primary/10 text-primary p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                    <step.icon className="h-8 w-8" strokeWidth={1.5} />
              </div>
                  <h3 className="text-xl font-medium mb-3 text-card-foreground">{step.title}</h3>
                  <p className="text-muted-foreground font-light mb-6">
                    {step.description}
                  </p>
                  <Button variant="link" asChild className="text-primary group">
                    <Link href={step.link}>
                Learn more
                      <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
                  </Button>
            </motion.div>
              ))}
            </motion.div>
        </div>
      </section>

        {/* About Section */}
        <section className="py-16 md:py-24 px-4 bg-neutral-50 dark:bg-neutral-900">
           <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div
                   variants={fadeIn(0, 0.8)} initial="hidden" whileInView="visible"
                   viewport={{ once: true, amount: 0.3 }}
                 >
                  <div className="relative aspect-[4/3]">
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/10 rounded-tl-2xl z-0"></div>
                    <div className="relative h-full w-full overflow-hidden rounded-lg shadow-xl z-10">
                  <Image
                        src="/images/about-us-workshop.png" // Replace with relevant image
                        alt="Color & Craft Workshop"
                    fill
                    className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                    <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-secondary/20 rounded-br-2xl z-0"></div>
              </div>
            </motion.div>

            <motion.div
                   variants={fadeIn(0.2, 0.8)} initial="hidden" whileInView="visible"
                   viewport={{ once: true, amount: 0.3 }}
              className="flex flex-col justify-center"
            >
                  <h4 className="text-primary uppercase tracking-wider text-sm font-semibold mb-3">About Color & Craft</h4>
                  <h2 className="text-3xl md:text-4xl font-light mb-6 leading-tight text-foreground">Passionate artisans dedicated to <span className="font-semibold">quality craftsmanship</span></h2>

                  <Card className="mb-8 border-border/50">
                    <CardContent className="p-6">
                      <p className="text-muted-foreground leading-relaxed font-light">
                         At Color & Craft, we transform treasured furniture into stunning works of art. Our skilled artisans blend traditional techniques with modern finishes, breathing new life into family heirlooms and unique finds. We bring your vision to life with meticulous care.
                       </p>
                    </CardContent>
                  </Card>

                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                     <div className="flex items-start space-x-3">
                        <div className="bg-primary/10 text-primary flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full">
                           <Award className="h-5 w-5" />
                  </div>
                  <div>
                         <h3 className="font-medium text-foreground mb-1">Premium Materials</h3>
                         <p className="text-sm text-muted-foreground font-light">Highest quality, eco-friendly paints and finishes.</p>
                  </div>
                </div>
                     <div className="flex items-start space-x-3">
                       <div className="bg-secondary/10 text-secondary flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full">
                         <Palette className="h-5 w-5" />
                  </div>
                  <div>
                         <h3 className="font-medium text-foreground mb-1">Skilled Craftspeople</h3>
                         <p className="text-sm text-muted-foreground font-light">Years of professional experience and artistry.</p>
                  </div>
                </div>
              </div>

                  <Button variant="link" asChild className="text-primary group self-start px-0">
                    <Link href="/about">
                Learn more about our studio
                      <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
                  </Button>
            </motion.div>
          </div>
        </div>
      </section>


      {/* Featured Projects Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container px-6">
          <div className="text-center mb-16">
              <h4 className="text-primary uppercase tracking-wider text-sm font-semibold mb-3">Our Latest Work</h4>
              <h2 className="text-3xl md:text-4xl font-light mb-4 text-foreground">Featured Projects</h2>
              <div className="w-20 h-1 bg-primary/30 mx-auto"></div>
          </div>

          <motion.div
              variants={staggerContainer(0.15)} initial="hidden" whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {featuredProjects.map((project, index) => (
            <motion.div
                  key={project.id}
                  variants={fadeIn(0, 0.6)}
            >
                  <Card className="group overflow-hidden h-full flex flex-col border-border/50 hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="p-0 relative aspect-[4/3]">
              <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    </CardHeader>
                    <CardContent className="p-4 flex-grow flex flex-col">
                      <h3 className="text-lg font-medium text-card-foreground mb-1 line-clamp-1">{project.title}</h3>
                      <p className="text-sm text-muted-foreground mb-1 line-clamp-1">{project.description}</p>
                      <p className="text-xs text-muted-foreground/80 mb-3 line-clamp-1">{project.material}</p>
                       <p className="text-base font-semibold text-primary mt-auto mb-3">{project.price}</p>
                      <Button variant="outline" size="sm" asChild className="mt-auto w-full">
                        <Link href={`/portfolio/${project.id}`}>View Details</Link>
                      </Button>
                    </CardContent>
                  </Card>
            </motion.div>
              ))}
            </motion.div>

            <div className="text-center mt-12">
               <Button variant="link" asChild className="text-primary group">
                <Link href="/portfolio">
                  View All Portfolio Pieces
                  <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
        <section className="py-16 md:py-24 px-4 bg-neutral-50 dark:bg-neutral-900">
          <div className="container text-center">
            <h4 className="text-primary uppercase tracking-wider text-sm font-semibold mb-3">What We Offer</h4>
            <h2 className="text-3xl md:text-4xl font-light mb-12 text-foreground">Our Services</h2>

          <motion.div
              variants={staggerContainer()} initial="hidden" whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
            >
              {services.map((service, index) => (
                <motion.div key={index} variants={fadeIn(0, 0.6)}>
                  <Card className="text-center p-6 h-full border-border/50 hover:shadow-md transition-shadow">
                    <CardHeader className="p-0 mb-5">
                      <div className="bg-primary/10 text-primary p-4 rounded-full mx-auto w-16 h-16 flex items-center justify-center">
                        <service.icon className="h-8 w-8" strokeWidth={1.5}/>
              </div>
                    </CardHeader>
                    <CardContent className="p-0 flex-grow flex flex-col">
                      <h3 className="text-xl font-medium mb-3 text-card-foreground">{service.title}</h3>
                      <p className="text-muted-foreground font-light text-sm mb-4 flex-grow">{service.description}</p>
                      <Button variant="link" asChild className="text-primary group mt-auto">
                         <Link href={service.link}>
                           Learn More
                           <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                         </Link>
                       </Button>
                    </CardContent>
                  </Card>
            </motion.div>
              ))}
          </motion.div>
        </div>
      </section>

         {/* Testimonials Section - Updated */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container px-6">
            <div className="text-center mb-12 md:mb-16">
              <h4 className="text-primary uppercase tracking-wider text-sm font-semibold mb-3">Client Love</h4>
              <h2 className="text-3xl md:text-4xl font-light text-foreground">What Our Clients Say</h2>
            </div>

            <motion.div
              variants={staggerContainer(0.15)} initial="hidden" whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {testimonialsData.map((testimonial) => (
                <motion.div
                  key={testimonial.id}
                  variants={fadeIn(0, 0.6)}
                >
                  <Card className="h-full flex flex-col p-6 md:p-8 border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <CardContent className="p-0 flex-grow flex flex-col">
                      <svg className="w-8 h-8 text-primary/40 mb-4 flex-shrink-0" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path d="M464 256h-80v-64c0-35.3 28.7-64 64-64h8c13.3 0 24-10.7 24-24V56c0-13.3-10.7-24-24-24h-8c-88.4 0-160 71.6-160 160v240c0 26.5 21.5 48 48 48h128c26.5 0 48-21.5 48-48V304c0-26.5-21.5-48-48-48zm-288 0H96v-64c0-35.3 28.7-64 64-64h8c13.3 0 24-10.7 24-24V56c0-13.3-10.7-24-24-24h-8C71.6 32 0 103.6 0 192v240c0 26.5 21.5 48 48 48h128c26.5 0 48-21.5 48-48V304c0-26.5-21.5-48-48-48z"></path>
            </svg>
                      <p className="text-base md:text-lg text-foreground font-light italic mb-6 leading-relaxed flex-grow">
                        "{testimonial.quote}"
            </p>
                      <div className="flex items-center mt-auto pt-4 border-t border-border/50">
                        <div className="w-12 h-12 rounded-full bg-muted mr-4 overflow-hidden flex-shrink-0">
                          {/* Basic Image Placeholder - Consider using Shadcn Avatar if needed */}
                <Image
                            src={testimonial.image || "/images/testimonials/placeholder.png"} // Fallback image
                  width={48}
                  height={48}
                            alt={testimonial.name}
                  className="object-cover"
                />
              </div>
              <div className="text-left">
                          <h4 className="font-medium text-foreground">{testimonial.name}</h4>
                          <p className="text-muted-foreground text-sm">{testimonial.location}</p>
              </div>
            </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
        </div>
      </section>

      {/* Call to Action Section */}
        <section className="py-16 md:py-24 bg-gradient-to-r from-primary via-primary/90 to-accent">
          <div className="container px-6 text-center max-w-3xl mx-auto">
            <motion.div
              variants={fadeIn(0, 0.8)} initial="hidden" whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-primary-foreground">
            Ready to Transform Your Furniture?
          </h2>
              <p className="text-lg text-primary-foreground/80 mb-10 font-light">
                Contact us today for a free consultation. Let our expert team bring your vision to life with beautiful, lasting results.
              </p>
              <Button size="lg" variant="secondary" asChild>
                <Link href="/contact">Get Your Free Quote</Link>
              </Button>
            </motion.div>
        </div>
      </section>
      </main>
    </div>
  );
}
