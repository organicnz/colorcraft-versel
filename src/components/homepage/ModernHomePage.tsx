"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Award,
  Palette,
  Settings,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Star,
  CheckCircle,
  Play,
  TrendingUp,
  Shield,
  Heart,
  Lightbulb
} from "lucide-react";

interface ModernHomePageProps {
  featuredProjects: any[];
  services: any[];
  testimonials: any[];
  teamMembers: any[];
}

// Modern animation variants with advanced spring physics
const springTransition = { type: "spring", stiffness: 100, damping: 15 };

const fadeInUp = {
  hidden: { opacity: 0, y: 60, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { ...springTransition, duration: 0.8 }
  }
};

const staggerContainer = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

const scaleOnHover = {
  scale: 1.02,
  transition: { type: "spring", stiffness: 300, damping: 20 }
};

export default function ModernHomePage({
  featuredProjects,
  services,
  testimonials,
  teamMembers,
}: ModernHomePageProps) {
  const [email, setEmail] = useState("");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Newsletter signup:", email);
    setEmail("");
  };

  // Transform team members from database for display with fallback
  const displayTeamMembers = teamMembers && teamMembers.length > 0 ? teamMembers.map(member => ({
    name: member.full_name,
    role: member.position,
    image: member.avatar_url || `https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face`,
    description: member.bio || `Expert in ${member.specialties?.[0] || 'furniture restoration'}`,
    specialty: member.specialties?.[0] || 'Furniture Expert',
    achievement: member.years_experience ? `${member.years_experience}+ years` : 'Expert',
    email: member.email,
    phone: member.phone,
    social_links: member.social_links
  })) : [];

  // Enhanced services with modern icons and colors
  const modernServices = [
    {
      icon: Palette,
      title: "Custom Painting",
      description: "Premium finishes with P3 wide gamut color precision",
      gradient: "from-violet-500 to-purple-600",
      bgGradient: "from-violet-50 to-purple-50"
    },
    {
      icon: Settings,
      title: "Furniture Restoration",
      description: "Bring antiques back to life with modern techniques",
      gradient: "from-blue-500 to-indigo-600",
      bgGradient: "from-blue-50 to-indigo-50"
    },
    {
      icon: Sparkles,
      title: "Creative Upcycling",
      description: "Sustainable design updates for the modern home",
      gradient: "from-emerald-500 to-teal-600",
      bgGradient: "from-emerald-50 to-teal-50"
    },
    {
      icon: Award,
      title: "Design Consultation",
      description: "Professional guidance from industry experts",
      gradient: "from-amber-500 to-orange-600",
      bgGradient: "from-amber-50 to-orange-50"
    },
    {
      icon: CheckCircle,
      title: "Color Matching",
      description: "Perfect color coordination with digital precision",
      gradient: "from-rose-500 to-pink-600",
      bgGradient: "from-rose-50 to-pink-50"
    },
    {
      icon: Shield,
      title: "Quality Guarantee",
      description: "Lifetime warranty on all premium finishes",
      gradient: "from-cyan-500 to-blue-600",
      bgGradient: "from-cyan-50 to-blue-50"
    },
    {
      icon: Heart,
      title: "Eco-Friendly",
      description: "Sustainable materials and practices",
      gradient: "from-green-500 to-emerald-600",
      bgGradient: "from-green-50 to-emerald-50"
    },
    {
      icon: Lightbulb,
      title: "Innovation Lab",
      description: "Cutting-edge techniques and materials",
      gradient: "from-yellow-500 to-amber-600",
      bgGradient: "from-yellow-50 to-amber-50"
    }
  ];

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Interactive cursor effect */}
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 bg-primary-500/30 rounded-full pointer-events-none z-50 mix-blend-multiply"
        animate={{
          x: mousePosition.x - 8,
          y: mousePosition.y - 8,
        }}
        transition={{ type: "spring", mass: 0.1, stiffness: 1000, damping: 28 }}
      />

      {/* Modern Hero Section with Glassmorphism */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">
        {/* Advanced Background with CSS Grid and Gradients */}
        <div className="absolute inset-0">
          {/* Base gradient with P3 colors */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20" />

          {/* Modern grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]">
            <div className="h-full w-full bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
          </div>

          {/* Floating elements with modern animations */}
          <motion.div
            className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-violet-400/10 to-purple-500/10 rounded-full blur-xl"
            animate={{
              y: [0, -20, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.div
            className="absolute bottom-32 right-16 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-cyan-500/10 rounded-full blur-xl"
            animate={{
              y: [0, 30, 0],
              rotate: [360, 180, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>

        {/* Hero Content with Container Queries */}
        <div className="relative container mx-auto px-6 @container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              className="space-y-8 max-w-2xl"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp} className="space-y-6">
                <Badge className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 border-violet-200 text-violet-800 backdrop-blur-sm px-4 py-2">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Premium Furniture Transformations
                </Badge>

                <h1 className="text-5xl lg:text-7xl font-bold leading-[0.9] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent">
                  Crafting sanctuaries that embrace
                  <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent"> warmth</span> and
                  <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent"> tranquility</span>
                </h1>

                <p className="text-xl lg:text-2xl text-slate-600 leading-relaxed font-light">
                  Every piece is a canvas for cherished memories, where comfort and connection thrive.
                  Transform your furniture into heirloom pieces that tell your story.
                </p>
              </motion.div>

              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4">
                <motion.div whileHover={scaleOnHover}>
                  <Button size="lg" className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                    <Play className="mr-2 h-5 w-5" />
                    View Our Work
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
                <motion.div whileHover={scaleOnHover}>
                  <Button size="lg" variant="outline" className="border-2 border-slate-200 text-slate-700 hover:bg-slate-50 px-8 py-4 rounded-2xl backdrop-blur-sm bg-white/50">
                    Get Free Quote
                  </Button>
                </motion.div>
              </motion.div>

              {/* Modern Stats with Glassmorphism */}
              <motion.div variants={fadeInUp} className="grid grid-cols-3 gap-6 pt-8">
                {[
                  { number: "200+", label: "Pieces Transformed", icon: Award },
                  { number: "15+", label: "Years Experience", icon: TrendingUp },
                  { number: "5.0", label: "Client Rating", icon: Star }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    className="text-center p-4 rounded-2xl bg-white/40 backdrop-blur-sm border border-white/20 shadow-lg"
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  >
                    <stat.icon className="w-6 h-6 mx-auto mb-2 text-violet-600" />
                    <div className="text-2xl font-bold bg-gradient-to-br from-slate-900 to-slate-700 bg-clip-text text-transparent">{stat.number}</div>
                    <div className="text-sm text-slate-600 font-medium">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Modern Hero Image with Advanced Effects */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.8, rotateY: 15 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ delay: 0.3, duration: 1, ease: "easeOut" }}
            >
              <div className="relative @container">
                {/* Main image with modern styling */}
                <motion.div
                  className="relative overflow-hidden rounded-3xl shadow-2xl"
                  whileHover={{ scale: 1.02, rotateY: 5 }}
                  transition={{ duration: 0.4 }}
                >
                                     <Image
                     src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&auto=format&q=80"
                     alt="Beautiful transformed vintage dresser showcasing expert furniture painting"
                     width={800}
                     height={600}
                     className="object-cover"
                     priority
                   />

                  {/* Glassmorphism overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

                  {/* Floating info card with glassmorphism */}
                  <motion.div
                    className="absolute -bottom-8 -left-8 p-6 rounded-2xl bg-white/80 backdrop-blur-md border border-white/20 shadow-xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="space-y-2">
                      <Badge className="bg-gradient-to-r from-violet-500 to-purple-500 text-white">Featured</Badge>
                      <div className="font-semibold text-slate-900">Victorian Dresser Revival</div>
                      <div className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">$2,500</div>
                      <div className="text-sm text-slate-600">Starting from</div>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Decorative elements */}
                <motion.div
                  className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-yellow-400/30 to-orange-500/30 rounded-full blur-lg"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Modern About Section with Container Queries */}
      <section className="py-32 bg-gradient-to-br from-slate-50 to-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="h-full w-full bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent)]" />
        </div>

        <div className="container mx-auto px-6 @container">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="text-center space-y-16"
            >
              <motion.div variants={fadeInUp} className="space-y-6">
                <Badge className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-200 text-blue-800 px-4 py-2">
                  About ColorCraft
                </Badge>
                <h2 className="text-5xl lg:text-6xl font-bold bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent">
                  Where artistry meets precision
                </h2>
                <p className="text-xl lg:text-2xl text-slate-600 leading-relaxed max-w-4xl mx-auto font-light">
                  At ColorCraft, we believe that furniture is more than just functional pieces;
                  they're the foundation of your sanctuary where cherished memories are crafted,
                  and where warmth and tranquility thrive.
                </p>
              </motion.div>

              {/* Modern Mission/Values Grid */}
              <motion.div
                variants={staggerContainer}
                className="grid md:grid-cols-2 gap-8 @lg:gap-12"
              >
                {[
                  {
                    title: "Mission",
                    content: "At ColorCraft, our mission is to help you transform your furniture pieces into beautiful, functional art that perfectly aligns with your lifestyle and aspirations. We're committed to making the restoration and transformation process seamless and inspiring.",
                    icon: Heart,
                    gradient: "from-rose-500 to-pink-600"
                  },
                  {
                    title: "Values",
                    content: "Integrity, craftsmanship, and client satisfaction drive us. We uphold the highest quality standards, deliver exceptional results, and offer personalized guidance tailored to your unique vision and needs.",
                    icon: Shield,
                    gradient: "from-blue-500 to-indigo-600"
                  }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    variants={fadeInUp}
                    className="p-8 rounded-3xl bg-white/60 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300"
                    whileHover={{ y: -5 }}
                  >
                    <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${item.gradient} p-4 shadow-lg`}>
                      <item.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">{item.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{item.content}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Ultra-Modern Featured Projects with Container Queries */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="container mx-auto px-6 @container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="space-y-16"
          >
            <motion.div variants={fadeInUp} className="text-center space-y-6">
              <Badge className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 border-violet-200 text-violet-800 px-4 py-2">
                <Award className="w-4 h-4 mr-2" />
                Featured Transformations
              </Badge>
              <h2 className="text-5xl lg:text-6xl font-bold bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent">
                Stunning transformations that inspire
              </h2>
              <p className="text-xl lg:text-2xl text-slate-600 leading-relaxed max-w-3xl mx-auto font-light">
                Discover our portfolio of stunning furniture transformations that showcase
                our expertise and attention to detail.
              </p>
            </motion.div>

            {/* Fixed Grid - No Flickering, Consistent Sizing */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProjects.slice(0, 4).map((project, index) => (
                <div
                  key={project.id || index}
                  className="group h-[420px] flex flex-col"
                >
                  <div className="relative overflow-hidden rounded-3xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
                    {/* Project Image - Fixed Height */}
                    <div className="relative h-48 overflow-hidden flex-shrink-0">
                      <Image
                        src={project.image || "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&auto=format&q=80"}
                        alt={project.title || "Furniture transformation"}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />

                      {/* Simple overlay - no flickering */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Featured badge */}
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-violet-600 text-white text-xs px-2 py-1 rounded-lg shadow-md">
                          Featured
                        </Badge>
                      </div>
                    </div>

                    {/* Project Details - Fixed Layout */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="font-bold text-lg text-slate-900 line-clamp-2 leading-tight">
                            {project.title || "Furniture Transformation"}
                          </h3>
                          <div className="text-right flex-shrink-0">
                            <div className="text-lg font-bold text-violet-600">$2,500</div>
                            <div className="text-xs text-slate-500">Starting</div>
                          </div>
                        </div>

                        <p className="text-slate-600 text-sm line-clamp-3 leading-relaxed">
                          {project.description?.length > 45
                            ? `${project.description.substring(0, 45)}...`
                            : project.description || "Expert furniture transformation with premium materials."
                          }
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-3">
                        <span className="text-xs text-slate-500 font-medium">
                          {project.material?.substring(0, 15) || "Premium Materials"}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">2-3 weeks</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Modern CTA Button */}
            <motion.div variants={fadeInUp} className="text-center">
              <motion.div whileHover={scaleOnHover}>
                <Link href="/portfolio">
                  <Button size="lg" variant="outline" className="border-2 border-slate-200 text-slate-700 hover:bg-slate-50 px-8 py-4 rounded-2xl backdrop-blur-sm bg-white/50">
                    View All Transformations
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Ultra-Modern Services Section */}
      <section className="py-32 bg-gradient-to-br from-slate-50 to-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-40 h-40 bg-gradient-to-br from-violet-400/5 to-purple-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-60 h-60 bg-gradient-to-br from-blue-400/5 to-cyan-500/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-6 @container relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="space-y-16"
          >
            <motion.div variants={fadeInUp} className="text-center space-y-6">
              <Badge className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-emerald-200 text-emerald-800 px-4 py-2">
                <Settings className="w-4 h-4 mr-2" />
                Services Offered
              </Badge>
              <h2 className="text-5xl lg:text-6xl font-bold bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent">
                Comprehensive transformation services
              </h2>
              <p className="text-xl lg:text-2xl text-slate-600 leading-relaxed max-w-3xl mx-auto font-light">
                From concept to completion, we offer every service needed to bring your vision to life.
              </p>
            </motion.div>

            {/* Fixed Services Grid - Equal Height Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {modernServices.map((service, index) => (
                <div
                  key={index}
                  className="group h-[280px] flex flex-col"
                >
                  <div
                    className={`relative p-6 rounded-3xl bg-gradient-to-br ${service.bgGradient} border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col`}
                  >
                    {/* Background gradient effect */}
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${service.gradient} opacity-10 rounded-full blur-2xl transform translate-x-8 -translate-y-8`} />

                    <div className="relative flex flex-col h-full">
                      {/* Icon with modern styling */}
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.gradient} p-3 shadow-lg group-hover:scale-110 transition-transform duration-300 mb-4 flex-shrink-0`}>
                        <service.icon className="w-8 h-8 text-white" />
                      </div>

                      <div className="flex-1 flex flex-col justify-between">
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-slate-800 transition-colors mb-3 line-clamp-2">
                          {service.title}
                        </h3>

                        <p className="text-slate-600 leading-relaxed text-sm flex-1">
                          {service.description.length > 50
                            ? `${service.description.substring(0, 50)}...`
                            : service.description
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Modern Team Section */}
      {displayTeamMembers.length > 0 && (
        <section className="py-32 bg-white relative overflow-hidden">
          <div className="container mx-auto px-6 @container">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="space-y-16"
            >
              <motion.div variants={fadeInUp} className="text-center space-y-6">
                <Badge className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-200 text-amber-800 px-4 py-2">
                  <Heart className="w-4 h-4 mr-2" />
                  Our Team
                </Badge>
                <h2 className="text-5xl lg:text-6xl font-bold bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent">
                  Meet the artisans behind every transformation
                </h2>
                <p className="text-xl lg:text-2xl text-slate-600 leading-relaxed max-w-3xl mx-auto font-light">
                  Our passionate team of experts brings decades of combined experience to every project.
                </p>
              </motion.div>

              <motion.div
                variants={staggerContainer}
                className="grid grid-cols-1 @lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
              >
                {displayTeamMembers.map((member, index) => (
                  <motion.div
                    key={`team-${member.name}-${index}`}
                    variants={fadeInUp}
                    className="group @container"
                  >
                    <motion.div
                      className="relative overflow-hidden rounded-3xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500"
                      whileHover={{ y: -8 }}
                    >
                      {/* Member Image */}
                      <div className="relative h-80 overflow-hidden">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.6 }}
                        >
                          <Image
                            src={member.image}
                            alt={member.name}
                            fill
                            className="object-cover"
                            priority={index < 3} // Prioritize first 3 images
                          />
                        </motion.div>

                        {/* Overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        {/* Achievement badge */}
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg">
                            {member.achievement}
                          </Badge>
                        </div>
                      </div>

                      {/* Member Details */}
                      <div className="p-8 space-y-4">
                        <div>
                          <h3 className="text-2xl font-bold text-slate-900 mb-1">{member.name}</h3>
                          <p className="text-lg font-medium bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">{member.role}</p>
                        </div>

                        <div className="space-y-2">
                          <div className="text-sm font-medium text-slate-500">Specialty</div>
                          <div className="text-slate-700 font-medium">{member.specialty}</div>
                        </div>

                        <p className="text-slate-600 leading-relaxed">{member.description}</p>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Ultra-Modern Contact Section */}
      <section className="py-32 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-6 @container relative">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="space-y-16"
            >
              <motion.div variants={fadeInUp} className="text-center space-y-6">
                <Badge className="bg-white/10 border-white/20 text-white px-4 py-2 backdrop-blur-sm">
                  <Mail className="w-4 h-4 mr-2" />
                  Get In Touch
                </Badge>
                <h2 className="text-5xl lg:text-6xl font-bold bg-gradient-to-br from-white via-white to-slate-200 bg-clip-text text-transparent">
                  Ready to transform your furniture?
                </h2>
                <p className="text-xl lg:text-2xl text-slate-300 leading-relaxed max-w-3xl mx-auto font-light">
                  Let's discuss your vision and create something beautiful together.
                </p>
              </motion.div>

              <motion.div
                variants={staggerContainer}
                className="grid grid-cols-1 @lg:grid-cols-3 gap-8"
              >
                {[
                  {
                    icon: MapPin,
                    title: "Visit Our Studio",
                    content: "123 Artisan Lane\nCreative District, CD 12345",
                    gradient: "from-violet-500 to-purple-600"
                  },
                  {
                    icon: Phone,
                    title: "Call Us",
                    content: "(555) 123-4567\nMon-Sat: 9AM-6PM",
                    gradient: "from-blue-500 to-cyan-600"
                  },
                  {
                    icon: Mail,
                    title: "Email Us",
                    content: "hello@colorcraft.com\nQuick response guaranteed",
                    gradient: "from-emerald-500 to-teal-600"
                  }
                ].map((contact, index) => (
                  <motion.div
                    key={index}
                    variants={fadeInUp}
                    className="group"
                  >
                    <motion.div
                      className="p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-lg hover:shadow-xl transition-all duration-500 text-center"
                      whileHover={{ y: -5, scale: 1.02 }}
                    >
                      <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${contact.gradient} p-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <contact.icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-4">{contact.title}</h3>
                      <p className="text-slate-300 leading-relaxed whitespace-pre-line">{contact.content}</p>
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Call to Action */}
              <motion.div variants={fadeInUp} className="text-center">
                <motion.div whileHover={scaleOnHover}>
                  <Link href="/contact">
                    <Button size="lg" className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-12 py-4 rounded-2xl shadow-xl">
                      Start Your Transformation
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}