"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GlassPanel, GlassCard } from "@/components/ui/glass-card";
import { ArrowRight, Award, Palette, Send, Settings, Sparkles } from "lucide-react";
import RandomShowcaseImage from "@/components/portfolio/RandomShowcaseImage";
import PhoneDisplay from "@/components/ui/phone-display";

// Animation variants
const fadeIn = (delay = 0, duration = 0.8) => ({
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration,
      delay,
      ease: "easeOut"
    }
  }
});

const slideIn = (direction = "left", delay = 0) => ({
  hidden: { opacity: 0, x: direction === "left" ? -50 : 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      delay,
      ease: "easeOut"
    }
  }
});

const staggerContainer = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
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
  teamMembers: any[];
  properties: any[];
}

export default function ClientHomePage({
  featuredProjects,
  services,
  testimonials,
  teamMembers,
  properties,
}: ClientHomePageProps) {
  const heroRef = useRef<HTMLElement>(null);
  const featuredRef = useRef<HTMLElement>(null);
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  // Scroll progress tracking
  const { scrollYProgress } = useScroll();

  // Hero section transforms
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);

  // Services section transforms
  const servicesY = useTransform(scrollYProgress, [0.1, 0.4], [50, -50]);
  const servicesOpacity = useTransform(scrollYProgress, [0.1, 0.2, 0.35, 0.4], [0, 1, 1, 0]);

  // Featured section transforms
  const featuredY = useTransform(scrollYProgress, [0.3, 0.7], [100, -100]);
  const featuredOpacity = useTransform(scrollYProgress, [0.3, 0.4, 0.6, 0.7], [0, 1, 1, 0]);
  const featuredScale = useTransform(scrollYProgress, [0.3, 0.7], [0.9, 1.1]);

  // Individual project transforms - pre-calculate for each index
  const featuredProgress = useTransform(scrollYProgress, [0.3, 0.7], [0, 1]);
  const project0Y = useTransform(featuredProgress, [0, 1], [20, -20]);
  const project1Y = useTransform(featuredProgress, [0, 1], [30, -30]);
  const project2Y = useTransform(featuredProgress, [0, 1], [40, -40]);
  const project3Y = useTransform(featuredProgress, [0, 1], [50, -50]);
  const projectOpacity = useTransform(featuredProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

  // Grid and footer transforms
  const featuredGridY = useTransform(scrollYProgress, [0.35, 0.65], [50, -50]);
  const featuredFooterY = useTransform(scrollYProgress, [0.4, 0.7], [30, -30]);

  // Array of pre-calculated transforms for projects
  const projectTransforms = [project0Y, project1Y, project2Y, project3Y];

  // Additional floating element transforms
  const floatingElement1Y = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const floatingElement2Y = useTransform(scrollYProgress, [0, 1], [0, -120]);

  // Debug logging
  console.log("🔍 ClientHomePage render:", {
    featuredProjects: featuredProjects?.length || 0,
    featuredProjectsSample: featuredProjects?.slice(0, 2),
  });

  // Use first 4 projects for display with safety check
  const displayProjects =
    featuredProjects && Array.isArray(featuredProjects) ? featuredProjects.slice(0, 4) : [];
  const currentProject = displayProjects[currentProjectIndex] || displayProjects[0];

  console.log("🔍 Display projects:", {
    displayProjectsLength: displayProjects.length,
    currentProjectIndex,
    currentProject: currentProject?.title,
  });

  // Background layers parallax
  const bgLayer1 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const bgLayer2 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const bgLayer3 = useTransform(scrollYProgress, [0, 1], [0, -50]);

  // Additional transform values for featured project
  const heroProjectY = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const heroProjectScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  // Featured section transforms
  const featuredBgY1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const featuredBgY2 = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const featuredBgY3 = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const featuredFloat1Y = useTransform(scrollYProgress, [0, 1], [50, -100]);
  const featuredFloat1Opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const featuredFloat2Y = useTransform(scrollYProgress, [0, 1], [80, -150]);
  const featuredFloat2Opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const featuredHeaderY = useTransform(scrollYProgress, [0, 1], [30, -30]);

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
    console.log("Newsletter signup:", email);
    setEmail("");
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with Advanced Parallax */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Multi-layered parallax backgrounds */}
        <motion.div
          style={{ y: bgLayer1 }}
          className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"
        />
        <motion.div
          style={{ y: bgLayer2 }}
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary-200/30 rounded-full blur-3xl"
        />
        <motion.div
          style={{ y: bgLayer3 }}
          className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-accent-200/30 rounded-full blur-3xl"
        />

        {/* Additional floating elements */}
        <motion.div
          style={{ y: floatingElement1Y }}
          className="absolute top-1/3 left-1/3 w-32 h-32 bg-secondary-200/20 rounded-full blur-2xl"
        />
        <motion.div
          style={{ y: floatingElement2Y }}
          className="absolute bottom-1/3 right-1/3 w-48 h-48 bg-primary-300/20 rounded-full blur-2xl"
        />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
          className="relative z-10 container mx-auto px-4"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              variants={staggerContainer}
              className="order-2 lg:order-1"
            >
              <motion.div variants={fadeIn(0)}>
                <Badge
                  variant="outline"
                  className="mb-6 bg-white/50 backdrop-blur-sm border-white/30"
                >
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
                Expert craftsmanship meets creative vision. We breathe new life into your beloved
                furniture with premium finishes and meticulous attention to detail.
              </motion.p>

              <motion.div variants={fadeIn(0.3)} className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  asChild
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg"
                >
                  <Link href="/contact">
                    Get Free Quote
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="px-8 py-4 text-lg bg-white/50 backdrop-blur-sm border-white/30 hover:bg-white/70"
                >
                  <Link href="/portfolio">View Portfolio</Link>
                </Button>
              </motion.div>
            </motion.div>

            {/* Featured Project Showcase with Parallax */}
            {currentProject && (
              <motion.div
                initial={{ opacity: 1, scale: 1 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ y: heroProjectY }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="order-1 lg:order-2 relative"
              >
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-2xl">
                  <motion.div
                    style={{ scale: heroProjectScale }}
                    className="w-full h-full"
                  >
                    <Image
                      src={currentProject.image}
                      alt={currentProject.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                    />
                  </motion.div>

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>

                  {/* Project info card */}
                  <GlassPanel className="absolute bottom-8 left-8 right-8 p-5">
                    <h3 className="text-xl font-semibold mb-2 text-white">
                      {currentProject.title}
                    </h3>
                    <div className="flex flex-wrap gap-3 mb-3">
                      <Badge
                        variant="secondary"
                        className="bg-secondary-100/50 text-secondary-700 dark:bg-secondary-900/30 dark:text-secondary-300 rounded-full backdrop-blur-sm"
                      >
                        Featured
                      </Badge>
                      <Badge
                        variant="outline"
                        className="rounded-full bg-white/20 text-white border-white/30"
                      >
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
                            ? "bg-primary-500 scale-125"
                            : "bg-white/50 hover:bg-white/70"
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
            initial={{ opacity: 1 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.div variants={fadeIn()}>
              <Badge
                variant="outline"
                className="mb-4 bg-white/50 backdrop-blur-sm border-white/30"
              >
                Our Services
              </Badge>
            </motion.div>
            <motion.h2 variants={fadeIn(0.1)} className="text-4xl md:text-5xl font-bold mb-6">
              Craftsmanship That
              <span className="block bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                Tells Your Story
              </span>
            </motion.h2>
            <motion.p
              variants={fadeIn(0.2)}
              className="text-xl text-muted-foreground max-w-3xl mx-auto"
            >
              From vintage restoration to modern makeovers, we offer comprehensive furniture
              transformation services
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 1 }}
            whileInView={{ opacity: 1 }}
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
                      <p className="text-muted-foreground mb-6 leading-relaxed">
                        {service.description}
                      </p>
                      <div className="space-y-2">
                        {service.features.map((feature: string, featureIndex: number) => (
                          <div key={featureIndex} className="flex items-center justify-center">
                            <Badge
                              variant="secondary"
                              className="bg-primary-50/50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300"
                            >
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
      <section ref={featuredRef} className="py-24 relative overflow-hidden">
        {/* Multi-layered parallax backgrounds */}
        <motion.div
          style={{ y: featuredBgY1 }}
          className="absolute inset-0 bg-gradient-to-br from-white/30 via-white/10 to-transparent backdrop-blur-sm"
        />
        <motion.div
          style={{ y: featuredBgY2 }}
          className="absolute inset-0 bg-gradient-to-b from-accent-50/40 via-primary-50/20 to-transparent"
        />
        <motion.div
          style={{ y: featuredBgY3 }}
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.1),transparent_50%)]"
        />

        {/* Floating background elements */}
        <motion.div
          style={{
            y: featuredFloat1Y,
            opacity: featuredFloat1Opacity,
          }}
          className="absolute top-20 left-1/4 w-64 h-64 bg-primary-200/20 rounded-full blur-3xl"
        />
        <motion.div
          style={{
            y: featuredFloat2Y,
            opacity: featuredFloat2Opacity,
          }}
          className="absolute bottom-20 right-1/4 w-48 h-48 bg-accent-200/20 rounded-full blur-2xl"
        />

        <div className="container relative z-10">
          <motion.div
            style={{
              y: featuredHeaderY,
              opacity: featuredOpacity,
            }}
            className="text-center mb-16"
          >
            <Badge
              variant="outline"
              className="mb-4 bg-white/60 backdrop-blur-md border-white/40 shadow-glass"
            >
              Featured Work
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 drop-shadow-sm">
              Recent
              <span className="block bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                Transformations
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto drop-shadow-sm">
              See how we've transformed ordinary furniture into extraordinary pieces
            </p>
          </motion.div>

          <motion.div
            style={{
              y: featuredGridY,
              scale: featuredScale,
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {displayProjects.length > 0 ? (
              displayProjects.map((project, index) => (
                <motion.div
                  key={`${project.id}-${index}`}
                  style={{
                    y: projectTransforms[index],
                    opacity: projectOpacity,
                  }}
                  className="opacity-0 animate-fade-in"
                  data-delay={index * 150}
                >
                  <Card
                    glass={true}
                    glassVariant="light"
                    glassIntensity="medium"
                    className="group overflow-hidden h-full flex flex-col border-border/50 hover:shadow-glass-heavy transition-all duration-300 hover:scale-[1.02]"
                  >
                    <CardHeader className="p-0 relative aspect-[4/3] overflow-hidden">
                      <motion.div
                        className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          className="w-full h-full object-cover transition-transform duration-500"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                      </motion.div>
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    </CardHeader>
                    <CardContent className="p-4 flex-grow flex flex-col relative z-10">
                      <h3 className="text-lg font-medium text-card-foreground mb-1 line-clamp-1">
                        {project.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-1 line-clamp-1">
                        {project.description}
                      </p>
                      <p className="text-xs text-muted-foreground/80 mb-3 line-clamp-1">
                        {project.material}
                      </p>
                      <p className="text-base font-semibold text-primary mt-auto mb-3">
                        {project.price}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="mt-auto w-full bg-white/50 backdrop-blur-sm border-white/30 hover:bg-white/70"
                      >
                        <Link href={`/portfolio/${project.id}`}>View Details</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="bg-white/30 dark:bg-white/10 backdrop-blur-md shadow-glass border border-white/30 dark:border-white/10 rounded-2xl p-8">
                  <p className="text-muted-foreground">
                    🔍 Debug: No projects to display (displayProjects.length:{" "}
                    {displayProjects.length})
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Featured projects: {featuredProjects?.length || 0}
                  </p>
                  <Button asChild className="mt-4">
                    <Link href="/portfolio">View Portfolio</Link>
                  </Button>
                </div>
              </div>
            )}
          </motion.div>

          <motion.div
            style={{
              y: featuredFooterY,
              opacity: featuredOpacity,
            }}
            className="text-center mt-12"
          >
            <Button variant="link" asChild className="text-primary group">
              <Link href="/portfolio">
                View All Portfolio Pieces
                <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-50/20 to-transparent"></div>

        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 1 }}
            animate="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.div variants={fadeIn()}>
              <Badge
                variant="outline"
                className="mb-4 bg-white/50 backdrop-blur-sm border-white/30"
              >
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
            initial={{ opacity: 1 }}
            animate="visible"
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
                        <span key={i} className="text-yellow-400 text-xl">
                          ★
                        </span>
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
            initial={{ opacity: 1 }}
            animate="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="max-w-5xl mx-auto"
          >
            <motion.div variants={fadeIn()} className="text-center mb-16">
              <Badge
                variant="outline"
                className="mb-4 bg-white/50 backdrop-blur-sm border-white/30"
              >
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

            <motion.div
              variants={fadeIn(0.2)}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start"
            >
              {/* Phone Display */}
              <div className="flex justify-center lg:justify-start order-2 lg:order-1 px-4 sm:px-0">
                <PhoneDisplay
                  phoneNumber="(747) 755-7695"
                  email="contact@colorandcraft.com"
                  variant="hero"
                  className="w-full max-w-xs sm:max-w-sm"
                />
              </div>

              {/* CTA Content */}
              <div className="text-center lg:text-left order-1 lg:order-2">
                <h3 className="text-3xl font-bold mb-6">Free Consultation</h3>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  Schedule a free consultation to discuss your project. We'll assess your furniture
                  and provide expert recommendations for the perfect transformation.
                </p>
                <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-4">
                  <Button
                    size="lg"
                    className="bg-[#3ECF8E] hover:bg-[#38BC81] text-white font-semibold px-8 py-4"
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
                    className="border-[#3ECF8E]/40 text-[#3ECF8E] hover:bg-[#3ECF8E]/10 px-8 py-4"
                    asChild
                  >
                    <Link href="/portfolio">View Portfolio</Link>
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
                Get the latest furniture transformation tips and project showcases delivered to your
                inbox.
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
