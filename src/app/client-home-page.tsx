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
import RandomShowcaseImage from '@/components/portfolio/RandomShowcaseImage';
import PhoneDisplay from '@/components/ui/phone-display';

// Animation variants
const fadeIn = (delay = 0, duration = 0.8) => ({
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay, duration, ease: "easeOut" }
  },
});

const slideIn = (direction = "left", delay = 0) => ({
  hidden: { opacity: 0, x: direction === "left" ? -50 : 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { delay, duration: 0.8, ease: "easeOut" }
  },
});

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Icon mapping
const iconMap = {
  Palette: Palette,
  Settings: Settings,
  Sparkles: Sparkles,
  Award: Award,
};

interface ClientHomePageProps {
  featuredProjects: any[];
  services: any[];
  testimonials: any[];
  properties: any[];
}

export default function ClientHomePage({ featuredProjects, services, testimonials, properties }: ClientHomePageProps) {
  const heroRef = useRef<HTMLElement>(null);
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const [email, setEmail] = useState('');

  // Use first 4 projects for display (already randomized from server)
  const displayProjects = featuredProjects.slice(0, 4);
  const currentProject = displayProjects[currentProjectIndex] || displayProjects[0];

  // Scroll animations
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  // Auto-rotate hero project
  useEffect(() => {
    if (displayProjects.length > 1) {
      const interval = setInterval(() => {
        setCurrentProjectIndex((prev) => (prev + 1) % displayProjects.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [displayProjects.length]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with Featured Project */}
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

            {/* Featured Project Showcase */}
            {currentProject && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="order-1 lg:order-2 relative"
              >
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-2xl">
                  <Image
                    src={currentProject.image}
                    alt={currentProject.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>

                  {/* Project info card */}
                  <GlassPanel className="absolute bottom-8 left-8 right-8 p-5">
                    <h3 className="text-xl font-semibold mb-2 text-white">{currentProject.title}</h3>
                    <div className="flex flex-wrap gap-3 mb-3">
                      <Badge variant="secondary" className="bg-secondary-100/50 text-secondary-700 dark:bg-secondary-900/30 dark:text-secondary-300 rounded-full backdrop-blur-sm">
                        Featured
                      </Badge>
                      <Badge variant="outline" className="rounded-full bg-white/20 text-white border-white/30">
                        {currentProject.material}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-primary-300">{currentProject.price}</span>
                      <span className="text-sm text-neutral-300">Expert Craftsmanship</span>
                    </div>
                  </GlassPanel>
                </div>

                {/* Project selector dots */}
                {displayProjects.length > 1 && (
                  <div className="flex justify-center mt-6 space-x-2">
                    {displayProjects.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentProjectIndex(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          currentProjectIndex === index
                            ? 'bg-primary-500 scale-125'
                            : 'bg-white/50 hover:bg-white/70'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>
      </section>

      {/* Services Section */}
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
            {services.map((service, index) => {
              const IconComponent = iconMap[service.icon as keyof typeof iconMap] || Palette;
              return (
                <motion.div key={index} variants={fadeIn(index * 0.1)}>
                  <GlassCard
                    variant="light"
                    intensity="medium"
                    className="h-full hover:scale-[1.02] transition-all duration-300 group"
                  >
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100/50 rounded-2xl mb-6 group-hover:bg-primary-200/50 transition-colors">
                        <IconComponent className="h-8 w-8 text-primary-600" />
                      </div>
                      <h3 className="text-2xl font-semibold mb-4">{service.title}</h3>
                      <p className="text-muted-foreground mb-6 leading-relaxed">{service.description}</p>
                      <div className="space-y-2">
                        {service.features.map((feature: string, featureIndex: number) => (
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
              );
            })}
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
            {displayProjects.map((project, index) => (
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
                  <CardHeader className="p-0 relative aspect-[4/3] overflow-hidden">
                    <RandomShowcaseImage
                      portfolioId={project.id}
                      title={project.title}
                      afterImages={project.after_images}
                      fallbackImage={project.image}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
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
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-50/20 to-transparent"></div>

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
                <GlassCard variant="light" intensity="medium" className="h-full hover:scale-[1.02] transition-all duration-300">
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

      {/* Contact Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[#3ECF8E]/5 via-transparent to-[#38BC81]/5"></div>

        <div className="container relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="max-w-4xl mx-auto"
          >
            <motion.div variants={fadeIn()} className="text-center mb-12">
              <Badge variant="outline" className="mb-4 bg-white/50 backdrop-blur-sm border-white/30">
                Get In Touch
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to Transform
                <span className="block bg-gradient-to-r from-[#3ECF8E] to-[#38BC81] bg-clip-text text-transparent">
                  Your Furniture?
                </span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Contact us today for a free consultation and let's bring your vision to life
              </p>
            </motion.div>

            <motion.div variants={fadeIn(0.2)} className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Phone Display */}
              <div className="flex justify-center">
                <PhoneDisplay 
                  phoneNumber="(747) 755-7695"
                  email="contact@colorandcraft.com"
                  variant="hero"
                  className="relative"
                />
              </div>

              {/* CTA Content */}
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-bold mb-4">Free Consultation</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Schedule a free consultation to discuss your project. We'll assess your furniture and provide expert recommendations for the perfect transformation.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    size="lg" 
                    className="bg-[#3ECF8E] hover:bg-[#38BC81] text-white font-semibold"
                    asChild
                  >
                    <Link href="/contact">
                      Get Your Quote
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="border-[#3ECF8E]/40 text-[#3ECF8E] hover:bg-[#3ECF8E]/10"
                    asChild
                  >
                    <Link href="/portfolio">
                      View Portfolio
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-100/30 via-transparent to-accent-100/30"></div>

        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl mx-auto text-center"
          >
            <GlassCard variant="light" intensity="strong" className="p-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay Updated</h2>
              <p className="text-muted-foreground mb-8 text-lg">
                Get the latest furniture transformation tips and project showcases delivered to your inbox.
              </p>
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 bg-white/50 backdrop-blur-sm border-white/30"
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