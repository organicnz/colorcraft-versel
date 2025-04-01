"use client";

import Link from 'next/link'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
        <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 bg-neutral-50 dark:bg-neutral-900 overflow-hidden">
          <div className="container px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                 variants={fadeIn(0, 1)} initial="hidden" animate="visible"
                className="max-w-2xl"
              >
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-foreground leading-tight mb-6">
                  Transform your furniture with <span className="font-semibold text-primary">expert painting</span> services
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground mb-8 font-light">
                  Breathe new life into your beloved furniture pieces with our professional painting and restoration services. From vintage revivals to modern makeovers.
                </p>

                <Card className="mb-8">
                  <CardContent className="p-6 space-y-4">
                     <div className="space-y-2">
                        <label htmlFor="hero-email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          Request a free consultation
                        </label>
                        <Input
                          type="email"
                          id="hero-email"
                          placeholder="you@example.com"
                        />
                     </div>
                    <Button className="w-full" size="lg" asChild>
                      <Link href="/contact">Get Started</Link>
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                      Professional furniture painting services
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                variants={fadeIn(0.3, 0.8)} initial="hidden" animate="visible"
                className="relative"
              >
                <div className="relative h-[400px] md:h-[500px] w-full overflow-hidden rounded-lg shadow-2xl">
                   {/* Carousel Image */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentProperty.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={currentProperty.image}
                        alt={currentProperty.title}
                        fill
                        className="object-cover"
                        priority={currentProjectIndex === 0} // Only prioritize the first image
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                      />
                    </motion.div>
                  </AnimatePresence>

                  {/* Property Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6">
                    <motion.div
                      key={currentProperty.id + '-info'} // Key change triggers animation
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.4 }}
                      className="flex justify-between items-end"
                    >
                      <div>
                         <Badge variant="secondary" className="mb-2">{currentProperty.type}</Badge>
                        <h3 className="text-xl md:text-2xl font-light text-white mb-1">
                          {currentProperty.title}
                        </h3>
                        <p className="text-neutral-300 text-sm mb-1">
                          {currentProperty.location}
                        </p>
                        <div className="flex items-center mt-2">
                          <span className="text-white font-bold mr-3">{currentProperty.price}</span>
                           <span className="text-green-400 text-sm">{currentProperty.return}</span>
                        </div>
                      </div>
                      <Button size="sm" asChild>
                        <Link href="/portfolio">View Details</Link>
                      </Button>
                    </motion.div>
                  </div>
                </div>

                {/* Property Indicators */}
                <div className="flex justify-center mt-6 space-x-2">
                  {properties.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentProjectIndex(index)}
                      className={`h-2 rounded-full transition-all duration-300 ${index === currentProjectIndex ? "bg-primary w-6" : "bg-muted-foreground/50 w-2"}`}
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

         {/* Testimonials Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container text-center px-6">
            <h4 className="text-primary uppercase tracking-wider text-sm font-semibold mb-3">Client Love</h4>
            <h2 className="text-3xl md:text-4xl font-light mb-12 text-foreground">What Our Clients Say</h2>

            <motion.div
              variants={fadeIn(0, 0.8)} initial="hidden" whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              className="max-w-3xl mx-auto"
            >
              <Card className="p-8 md:p-10 border-border/50 shadow-sm">
                <CardContent className="p-0">
                  <svg className="w-10 h-10 text-primary/40 mx-auto mb-6" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                     {/* Quote Icon Path */}
                     <path d="M464 256h-80v-64c0-35.3 28.7-64 64-64h8c13.3 0 24-10.7 24-24V56c0-13.3-10.7-24-24-24h-8c-88.4 0-160 71.6-160 160v240c0 26.5 21.5 48 48 48h128c26.5 0 48-21.5 48-48V304c0-26.5-21.5-48-48-48zm-288 0H96v-64c0-35.3 28.7-64 64-64h8c13.3 0 24-10.7 24-24V56c0-13.3-10.7-24-24-24h-8C71.6 32 0 103.6 0 192v240c0 26.5 21.5 48 48 48h128c26.5 0 48-21.5 48-48V304c0-26.5-21.5-48-48-48z"></path>
                   </svg>
                  <p className="text-lg md:text-xl text-foreground font-light italic mb-8 leading-relaxed">
                    "Color & Craft transformed my grandmother's old dresser into a stunning centerpiece. The attention to detail and craftsmanship exceeded all expectations. Highly recommended!"
                  </p>
                  <div className="flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-muted mr-4 overflow-hidden flex-shrink-0">
                      <Image
                        src="/images/testimonials/rustam-testimonial.png" // Placeholder image
                        width={48}
                        height={48}
                        alt="Sarah L."
                        className="object-cover"
                      />
                    </div>
                    <div className="text-left">
                      <h4 className="font-medium text-foreground">Rustam Avanesian</h4>
                      <p className="text-muted-foreground text-sm">Los Angeles, CA</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
