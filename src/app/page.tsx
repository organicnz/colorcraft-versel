"use client";

import Link from 'next/link'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GlassPanel, GlassCard } from "@/components/ui/glass-card";
import { ArrowRight, Award, Palette, Send, Settings, Sparkles } from "lucide-react";
import { AnimatePresence } from 'framer-motion';

// Animation variants
const fadeIn = (delay = 0, duration = 0.8) => ({
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration, delay, ease: "easeOut" } }
});

const slideIn = (direction = "left", delay = 0) => ({
  hidden: { opacity: 0, x: direction === "left" ? -50 : 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, delay, ease: "easeOut" } }
});

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

// Sample data
const featuredProjects = [
  {
    id: 1,
    title: "Victorian Dresser Revival",
    description: "Antique restoration with modern flair",
    material: "Oak with chalk paint finish",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800",
    price: "From $450",
  },
  {
    id: 2,
    title: "Modern Coffee Table",
    description: "Contemporary geometric design",
    material: "Reclaimed wood and steel",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800",
    price: "From $320",
  },
  {
    id: 3,
    title: "Vintage Chair Makeover",
    description: "Classic comfort meets bold color",
    material: "Upholstered with premium fabric",
    image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800",
    price: "From $280",
  },
  {
    id: 4,
    title: "Rustic Dining Set",
    description: "Farmhouse style transformation",
    material: "Pine with distressed finish",
    image: "https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=800",
    price: "From $650",
  }
];

const services = [
  {
    icon: Palette,
    title: "Custom Painting",
    description: "Transform your furniture with our expert painting techniques and premium finishes.",
    features: ["Chalk Paint", "Milk Paint", "Custom Colors", "Distressing"]
  },
  {
    icon: Settings,
    title: "Restoration",
    description: "Bring antique and vintage pieces back to their former glory with careful restoration.",
    features: ["Wood Repair", "Hardware Restoration", "Period-Accurate Finishes", "Structural Repairs"]
  },
  {
    icon: Sparkles,
    title: "Upcycling",
    description: "Give new life to old furniture with creative upcycling and modern design touches.",
    features: ["Design Consultation", "Modern Updates", "Eco-Friendly Materials", "Custom Hardware"]
  }
];

const testimonials = [
  {
    name: "Sarah Johnson",
    text: "Color & Craft transformed my grandmother's old dresser into a stunning centerpiece. The attention to detail is incredible!",
    rating: 5,
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150"
  },
  {
    name: "Michael Chen",
    text: "Professional service and amazing results. They turned our dated dining set into something we absolutely love.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
  },
  {
    name: "Emily Rodriguez",
    text: "The team's creativity and skill exceeded our expectations. Highly recommend for any furniture restoration project.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150"
  }
];

const properties = [
  {
    title: "Vintage Armoire Restoration",
    type: "Antique",
    location: "Victorian Era",
    price: "$850",
    return: "Heirloom Quality",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800"
  },
  {
    title: "Modern Bookshelf Design",
    type: "Contemporary",
    location: "Custom Built",
    price: "$420",
    return: "Lifetime Warranty",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800"
  },
  {
    title: "Rustic Coffee Table",
    type: "Farmhouse",
    location: "Reclaimed Wood",
    price: "$380",
    return: "Eco-Friendly",
    image: "https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=800"
  }
];

export default function Home() {
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const [currentProperty, setCurrentProperty] = useState(properties[0]);
  const [email, setEmail] = useState('');
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentProjectIndex((prev) => (prev + 1) % featuredProjects.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentProperty(prev => {
        const currentIndex = properties.indexOf(prev);
        return properties[(currentIndex + 1) % properties.length];
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with Enhanced Glassmorphism */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background with glass effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-accent-200/30 rounded-full blur-3xl" />

        <motion.div style={{ y, opacity }} className="relative z-10 container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="order-2 lg:order-1"
            >
              <motion.div variants={fadeIn(0)}>
                <Badge variant="outline" className="mb-6 bg-white/50 backdrop-blur-sm border-white/30">
                  ✨ Premium Furniture Restoration
                </Badge>
              </motion.div>

              <motion.h1
                variants={fadeIn(0.1)}
                className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
              >
                Transform Your
                <span className="block bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                  Furniture Dreams
                </span>
              </motion.h1>

              <motion.p
                variants={fadeIn(0.2)}
                className="text-xl text-muted-foreground mb-8 leading-relaxed"
              >
                Expert craftsmanship meets creative vision. We breathe new life into your beloved furniture
                with premium finishes and meticulous attention to detail.
              </motion.p>

              <motion.div
                variants={fadeIn(0.3)}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg">
                  <Link href="/contact">
                    Get Free Quote
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="px-8 py-4 text-lg bg-white/50 backdrop-blur-sm border-white/30 hover:bg-white/70">
                  <Link href="/portfolio">View Portfolio</Link>
                </Button>
              </motion.div>
            </motion.div>

            {/* Featured Project Showcase with Glass Effect */}
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

                {/* Property info card with enhanced glass effect */}
                <GlassPanel className="absolute bottom-8 left-8 right-8 p-5">
                  <h3 className="text-xl font-semibold mb-2 text-white">{currentProperty.title}</h3>
                  <div className="flex flex-wrap gap-3 mb-3">
                    <Badge variant="secondary" className="bg-secondary-100/50 text-secondary-700 dark:bg-secondary-900/30 dark:text-secondary-300 rounded-full backdrop-blur-sm">
                      {currentProperty.type}
                    </Badge>
                    <Badge variant="outline" className="rounded-full bg-white/20 text-white border-white/30">
                      {currentProperty.location}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-primary-300">{currentProperty.price}</span>
                    <span className="text-sm text-neutral-300">{currentProperty.return}</span>
                  </div>
                </GlassPanel>
              </div>

              {/* Image selector dots */}
              <div className="flex justify-center mt-6 space-x-2">
                {properties.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentProperty(properties[index])}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      properties.indexOf(currentProperty) === index
                        ? 'bg-primary-500 scale-125'
                        : 'bg-white/50 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Services Section with Glass Cards */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-50/30 to-transparent" />

        <div className="container relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.div variants={fadeIn()}>
              <Badge variant="outline" className="mb-4 bg-white/50 backdrop-blur-sm border-white/30">
                Our Services
              </Badge>
            </motion.div>
            <motion.h2 variants={fadeIn(0.1)} className="text-4xl md:text-5xl font-bold mb-6">
              Craftsmanship That
              <span className="block bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                Tells Your Story
              </span>
            </motion.h2>
            <motion.p variants={fadeIn(0.2)} className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From vintage restoration to modern makeovers, we offer comprehensive furniture transformation services
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {services.map((service, index) => (
              <motion.div key={index} variants={fadeIn(index * 0.1)}>
                <GlassCard
                  variant="light"
                  intensity="medium"
                  className="h-full hover:scale-[1.02] transition-all duration-300 group"
                >
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100/50 rounded-2xl mb-6 group-hover:bg-primary-200/50 transition-colors">
                      <service.icon className="h-8 w-8 text-primary-600" />
                    </div>
                    <h3 className="text-2xl font-semibold mb-4">{service.title}</h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">{service.description}</p>
                    <div className="space-y-2">
                      {service.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center justify-center">
                          <Badge variant="secondary" className="bg-primary-50/50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                            {feature}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-24 bg-gradient-to-b from-transparent via-accent-50/30 to-transparent">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.div variants={fadeIn()}>
              <Badge variant="outline" className="mb-4 bg-white/50 backdrop-blur-sm border-white/30">
                Featured Work
              </Badge>
            </motion.div>
            <motion.h2 variants={fadeIn(0.1)} className="text-4xl md:text-5xl font-bold mb-6">
              Recent
              <span className="block bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                Transformations
              </span>
            </motion.h2>
            <motion.p variants={fadeIn(0.2)} className="text-xl text-muted-foreground max-w-3xl mx-auto">
              See how we've transformed ordinary furniture into extraordinary pieces
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {featuredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                variants={fadeIn(index * 0.1)}
              >
                <Card
                  glass={true}
                  glassVariant="light"
                  glassIntensity="medium"
                  className="group overflow-hidden h-full flex flex-col border-border/50 hover:shadow-glass-heavy transition-all duration-300 hover:scale-[1.02]"
                >
                  <CardHeader className="p-0 relative aspect-[4/3]">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </CardHeader>
                  <CardContent className="p-4 flex-grow flex flex-col relative z-10">
                    <h3 className="text-lg font-medium text-card-foreground mb-1 line-clamp-1">{project.title}</h3>
                    <p className="text-sm text-muted-foreground mb-1 line-clamp-1">{project.description}</p>
                    <p className="text-xs text-muted-foreground/80 mb-3 line-clamp-1">{project.material}</p>
                    <p className="text-base font-semibold text-primary mt-auto mb-3">{project.price}</p>
                    <Button variant="outline" size="sm" asChild className="mt-auto w-full bg-white/50 backdrop-blur-sm border-white/30 hover:bg-white/70">
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

      {/* Testimonials Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-50/20 to-transparent" />

        <div className="container relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.div variants={fadeIn()}>
              <Badge variant="outline" className="mb-4 bg-white/50 backdrop-blur-sm border-white/30">
                Client Stories
              </Badge>
            </motion.div>
            <motion.h2 variants={fadeIn(0.1)} className="text-4xl md:text-5xl font-bold mb-6">
              What Our
              <span className="block bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                Clients Say
              </span>
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div key={index} variants={fadeIn(index * 0.1)}>
                <GlassCard
                  variant="light"
                  intensity="medium"
                  className="h-full hover:scale-[1.02] transition-all duration-300"
                >
                  <div className="text-center">
                    <div className="flex justify-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <span key={i} className="text-yellow-400 text-xl">★</span>
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-6 italic leading-relaxed">
                      "{testimonial.text}"
                    </p>
                    <div className="flex items-center justify-center space-x-3">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        width={48}
                        height={48}
                        className="rounded-full"
                      />
                      <div>
                        <p className="font-semibold">{testimonial.name}</p>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-100/30 via-transparent to-accent-100/30" />

        <div className="container relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn()}
            className="max-w-2xl mx-auto text-center"
          >
            <GlassCard variant="light" intensity="strong" className="p-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Stay Updated
              </h2>
              <p className="text-muted-foreground mb-8 text-lg">
                Get the latest furniture transformation tips and project showcases delivered to your inbox.
              </p>
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-white/50 backdrop-blur-sm border-white/30"
                  required
                />
                <Button type="submit" className="bg-primary hover:bg-primary/90 text-white px-8">
                  Subscribe
                  <Send className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </GlassCard>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
