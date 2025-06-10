"use client";

import { createClient } from "@/lib/supabase/server";
import { getPortfolioProjects } from "@/services/portfolio.service";
import PortfolioItem from "@/components/portfolio/PortfolioItem";
import PortfolioTabs from "@/components/portfolio/PortfolioTabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  Plus,
  Palette,
  Sparkles,
  TrendingUp,
  Award,
  Users,
  Calendar,
  ArrowRight,
  Filter,
  Grid3X3,
  Search,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

// Ultra-modern animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 15, duration: 0.8 }
  }
};

const staggerContainer = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const scaleOnHover = {
  scale: 1.02,
  transition: { type: "spring", stiffness: 400, damping: 25 }
};

// Force dynamic rendering for authentication checks
export const dynamic = 'force-dynamic';

// Define the project type
interface ProjectType {
  id: string;
  title: string;
  description: string;
  before_images: string[];
  after_images: string[];
  status: string;
  is_featured: boolean;
  category: string;
  completion_time: string;
  techniques: string[];
  price_range: string;
}

export default function PortfolioPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [displayedProjects, setDisplayedProjects] = useState<ProjectType[]>([]);
  const [filterType, setFilterType] = useState("all");
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const projectsPerPage = 6; // Show 6 projects (3 columns x 2 rows)

  // Sample data with ultra-modern structure
  const sampleProjects: ProjectType[] = [
    {
      id: 'sample-1',
      title: 'Victorian Dresser Revival',
      description: 'A stunning transformation of a 19th-century Victorian dresser using premium chalk paint and modern hardware, bringing timeless elegance to contemporary spaces.',
      before_images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&auto=format&q=80'],
      after_images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&auto=format&q=80'],
      status: 'published',
      is_featured: true,
      category: 'restoration',
      completion_time: '3 weeks',
      techniques: ['Chalk Paint', 'Hardware Upgrade', 'Distressing'],
      price_range: '$800-1200'
    },
    {
      id: 'sample-2',
      title: 'Modern Coffee Table Makeover',
      description: 'Complete transformation of a dated coffee table into a sleek modern centerpiece featuring geometric patterns and premium finishes.',
      before_images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop&auto=format&q=80'],
      after_images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop&auto=format&q=80'],
      status: 'published',
      is_featured: true,
      category: 'modern',
      completion_time: '2 weeks',
      techniques: ['Geometric Design', 'Premium Lacquer', 'Metal Accents'],
      price_range: '$600-900'
    },
    {
      id: 'sample-3',
      title: 'Vintage Chair Restoration',
      description: 'Meticulous restoration of mid-century modern chair with new upholstery, refinished wood, and structural reinforcement for lasting beauty.',
      before_images: ['https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&h=600&fit=crop&auto=format&q=80'],
      after_images: ['https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&h=600&fit=crop&auto=format&q=80'],
      status: 'published',
      is_featured: true,
      category: 'vintage',
      completion_time: '4 weeks',
      techniques: ['Upholstery', 'Wood Refinishing', 'Structural Repair'],
      price_range: '$500-800'
    },
    {
      id: 'sample-4',
      title: 'Industrial Bookshelf Conversion',
      description: 'Converting old wooden shelving into an industrial-style bookshelf with metal pipe framework and weathered finish.',
      before_images: ['https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop&auto=format&q=80'],
      after_images: ['https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop&auto=format&q=80'],
      status: 'published',
      is_featured: false,
      category: 'industrial',
      completion_time: '2 weeks',
      techniques: ['Metal Framework', 'Weathering', 'Industrial Hardware'],
      price_range: '$400-700'
    },
    {
      id: 'sample-5',
      title: 'Antique Wardrobe Restoration',
      description: 'Comprehensive restoration of a French antique wardrobe with authentic period finishes and hardware restoration.',
      before_images: ['https://images.unsplash.com/photo-1562113530-57ba4cea7cb3?w=800&h=600&fit=crop&auto=format&q=80'],
      after_images: ['https://images.unsplash.com/photo-1562113530-57ba4cea7cb3?w=800&h=600&fit=crop&auto=format&q=80'],
      status: 'published',
      is_featured: true,
      category: 'restoration',
      completion_time: '6 weeks',
      techniques: ['Period Restoration', 'Authentic Finishes', 'Hardware Restoration'],
      price_range: '$1500-2000'
    },
    {
      id: 'sample-6',
      title: 'Contemporary Side Table',
      description: 'Modern transformation of a traditional side table with sleek lines, minimalist design, and high-gloss finish.',
      before_images: ['https://images.unsplash.com/photo-1549497538-303791108f95?w=800&h=600&fit=crop&auto=format&q=80'],
      after_images: ['https://images.unsplash.com/photo-1549497538-303791108f95?w=800&h=600&fit=crop&auto=format&q=80'],
      status: 'published',
      is_featured: false,
      category: 'modern',
      completion_time: '1 week',
      techniques: ['Minimalist Design', 'High-Gloss Finish', 'Clean Lines'],
      price_range: '$300-500'
    },
    {
      id: 'sample-7',
      title: 'Rustic Dining Set Revival',
      description: 'Complete makeover of a rustic dining set with weathered wood finish and modern comfort updates.',
      before_images: ['https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop&auto=format&q=80'],
      after_images: ['https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop&auto=format&q=80'],
      status: 'published',
      is_featured: false,
      category: 'vintage',
      completion_time: '5 weeks',
      techniques: ['Weathered Finish', 'Comfort Updates', 'Rustic Styling'],
      price_range: '$1200-1800'
    },
    {
      id: 'sample-8',
      title: 'Modern Storage Cabinet',
      description: 'Sleek storage solution with contemporary design, hidden compartments, and premium materials.',
      before_images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&auto=format&q=80'],
      after_images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&auto=format&q=80'],
      status: 'published',
      is_featured: false,
      category: 'modern',
      completion_time: '3 weeks',
      techniques: ['Hidden Compartments', 'Premium Materials', 'Contemporary Design'],
      price_range: '$900-1300'
    }
  ];

  const stats = [
    {
      icon: TrendingUp,
      number: "150+",
      label: "Projects Completed",
      gradient: "from-violet-500 to-purple-600",
      bgGradient: "from-violet-50 to-purple-50"
    },
    {
      icon: Award,
      number: "100%",
      label: "Client Satisfaction",
      gradient: "from-amber-500 to-orange-600",
      bgGradient: "from-amber-50 to-orange-50"
    },
    {
      icon: Users,
      number: "200+",
      label: "Happy Clients",
      gradient: "from-emerald-500 to-teal-600",
      bgGradient: "from-emerald-50 to-teal-50"
    },
    {
      icon: Calendar,
      number: "5+",
      label: "Years Experience",
      gradient: "from-blue-500 to-cyan-600",
      bgGradient: "from-blue-50 to-cyan-50"
    }
  ];

  const categories = [
    { id: "all", label: "All Projects", count: sampleProjects.length },
    { id: "restoration", label: "Restoration", count: sampleProjects.filter(p => p.category === "restoration").length },
    { id: "modern", label: "Modern", count: sampleProjects.filter(p => p.category === "modern").length },
    { id: "vintage", label: "Vintage", count: sampleProjects.filter(p => p.category === "vintage").length },
    { id: "industrial", label: "Industrial", count: sampleProjects.filter(p => p.category === "industrial").length }
  ];

  useEffect(() => {
    setProjects(sampleProjects);
    // Initialize displayed projects with first page
    setDisplayedProjects(sampleProjects.slice(0, projectsPerPage));
    setIsLoading(false);
  }, []);

  // Update displayed projects when filter changes
  useEffect(() => {
    const filtered = filterType === "all"
      ? projects
      : projects.filter(project => project.category === filterType);
    
    setDisplayedProjects(filtered.slice(0, projectsPerPage));
    setCurrentPage(1);
  }, [filterType, projects]);

  const filteredProjects = filterType === "all"
    ? projects
    : projects.filter(project => project.category === filterType);

  const hasMoreProjects = displayedProjects.length < filteredProjects.length;

  const loadMoreProjects = () => {
    if (isLoadingMore || !hasMoreProjects) return;
    
    setIsLoadingMore(true);
    
    // Simulate loading delay for better UX
    setTimeout(() => {
      const filtered = filterType === "all"
        ? projects
        : projects.filter(project => project.category === filterType);
      
      const nextPage = currentPage + 1;
      const newProjects = filtered.slice(0, nextPage * projectsPerPage);
      
      setDisplayedProjects(newProjects);
      setCurrentPage(nextPage);
      setIsLoadingMore(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Ultra-Modern Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Advanced Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20" />
          <div className="absolute inset-0 opacity-[0.03]">
            <div className="h-full w-full bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
          </div>
          <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-violet-400/10 to-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-cyan-500/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-5xl mx-auto text-center"
          >
            <motion.div variants={fadeInUp} className="space-y-8">
              <Badge className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 border-violet-200 text-violet-800 px-6 py-3 text-lg">
                <Palette className="w-5 h-5 mr-2" />
                Our Portfolio
              </Badge>

              <h1 className="text-6xl lg:text-8xl font-bold bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent leading-tight">
                Furniture<br />
                <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                  Transformations
                </span>
              </h1>

              <p className="text-2xl lg:text-3xl text-slate-600 leading-relaxed max-w-4xl mx-auto font-light">
                Discover the artistry behind each piece. From vintage restorations to modern makeovers,
                every transformation tells a unique story of craftsmanship and creativity.
              </p>

              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
                <motion.div whileHover={scaleOnHover}>
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl text-lg font-semibold"
                  >
                    <Sparkles className="mr-2 h-5 w-5" />
                    Explore Collection
                  </Button>
                </motion.div>
                <motion.div whileHover={scaleOnHover}>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-2 border-slate-200 text-slate-700 hover:bg-slate-50 px-8 py-4 rounded-2xl backdrop-blur-sm bg-white/50 text-lg font-semibold"
                  >
                    <Search className="mr-2 h-5 w-5" />
                    Browse Categories
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-slate-300 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-slate-400 rounded-full mt-2"></div>
          </div>
        </motion.div>
      </section>

      {/* Ultra-Modern Stats Section */}
      <section className="py-32 bg-gradient-to-br from-slate-50 to-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-40 h-40 bg-gradient-to-br from-amber-400/5 to-orange-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-60 h-60 bg-gradient-to-br from-emerald-400/5 to-teal-500/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-6 relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="space-y-16"
          >
            <motion.div variants={fadeInUp} className="text-center space-y-6">
              <h2 className="text-5xl lg:text-6xl font-bold bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent">
                Portfolio Impact
              </h2>
              <p className="text-xl lg:text-2xl text-slate-600 leading-relaxed max-w-3xl mx-auto font-light">
                Numbers that reflect our commitment to excellence and customer satisfaction.
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="group"
                >
                  <motion.div
                    className={`relative p-8 rounded-3xl bg-gradient-to-br ${stat.bgGradient} border border-white/50 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden text-center`}
                    whileHover={{ y: -8, scale: 1.02 }}
                  >
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-full blur-2xl transform translate-x-8 -translate-y-8`} />

                    <div className="relative space-y-4">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.gradient} p-4 shadow-lg group-hover:scale-110 transition-transform duration-300 mx-auto`}>
                        <stat.icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-4xl font-bold text-slate-900">{stat.number}</div>
                      <div className="text-slate-600 font-medium">{stat.label}</div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Modern Filter Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="space-y-12"
          >
            <motion.div variants={fadeInUp} className="text-center space-y-6">
              <Badge className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-200 text-blue-800 px-4 py-2">
                <Filter className="w-4 h-4 mr-2" />
                Browse by Category
              </Badge>
              <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent">
                Featured Transformations
              </h2>
            </motion.div>

            {/* Category Filter Tabs */}
            <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setFilterType(category.id)}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                    filterType === category.id
                      ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg scale-105"
                      : "bg-white/60 text-slate-600 hover:bg-white/80 border border-slate-200"
                  }`}
                >
                  {category.label}
                  <span className="ml-2 text-xs bg-white/20 px-2 py-0.5 rounded-full">
                    {category.count}
                  </span>
                </button>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {displayedProjects.map((project, index) => (
              <motion.div
                key={project.id}
                variants={fadeInUp}
                custom={index}
                className="group"
              >
                <motion.div
                  className="relative overflow-hidden rounded-3xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 h-full"
                  whileHover={{ y: -8 }}
                >
                  {/* Project Image */}
                  <div className="relative h-64 overflow-hidden">
                    <motion.img
                      src={project.after_images[0]}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      whileHover={{ scale: 1.1 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-gradient-to-r from-violet-600 to-purple-600 text-white text-xs">
                        {project.category}
                      </Badge>
                    </div>

                    {/* Price Range */}
                    <div className="absolute top-4 right-4">
                      <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-slate-700">
                        {project.price_range}
                      </div>
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-violet-600 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-slate-600 text-sm line-clamp-2 leading-relaxed">
                        {project.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {project.completion_time}
                      </span>
                      <span className="flex items-center">
                        <Award className="w-3 h-3 mr-1" />
                        {project.techniques.length} techniques
                      </span>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                      <Button variant="outline" size="sm" className="w-full group-hover:bg-violet-50 group-hover:border-violet-200 group-hover:text-violet-600 transition-colors">
                        View Details
                        <ArrowRight className="ml-2 h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>

          {/* Load More Button */}
          {hasMoreProjects && (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="text-center mt-16"
            >
              <motion.div whileHover={scaleOnHover}>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-slate-200 text-slate-700 hover:bg-slate-50 px-8 py-4 rounded-2xl backdrop-blur-sm bg-white/50"
                  onClick={loadMoreProjects}
                  disabled={isLoadingMore}
                >
                  {isLoadingMore ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Loading More...
                    </>
                  ) : (
                    <>
                      <Grid3X3 className="mr-2 h-5 w-5" />
                      Load More Projects
                    </>
                  )}
                </Button>
              </motion.div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
