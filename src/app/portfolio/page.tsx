"use client";

import { createClient } from "@/lib/supabase/client";
import { getPortfolioProjects } from "@/services/portfolio.service.client";
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
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";

// Ultra-modern animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 15, duration: 0.8 },
  },
};

const staggerContainer = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const scaleOnHover = {
  scale: 1.02,
  transition: { type: "spring", stiffness: 400, damping: 25 },
};

// Force dynamic rendering for authentication checks
export const dynamic = "force-dynamic";

// Updated interface to match the database schema
interface ProjectType {
  id: string;
  title: string;
  description?: string;
  brief_description: string;
  before_images: string[];
  after_images: string[];
  status: "published" | "draft" | "archived";
  is_featured: boolean;
  techniques?: string[];
  materials?: string[];
  completion_date?: string;
  client_name?: string;
  client_testimonial?: string;
  created_at: string;
  updated_at: string;
  // Additional computed properties for UI
  category?: string;
  completion_time?: string;
  price_range?: string;
}

// Fallback sample data function
const getSampleProjects = (): ProjectType[] => [
  {
    id: "sample-1",
    title: "Victorian Dresser Revival",
    description: "Elegant restoration with chalk paint and brass accents.",
    brief_description: "Elegant restoration with chalk paint and brass accents.",
    before_images: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&auto=format&q=80",
    ],
    after_images: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&auto=format&q=80",
    ],
    status: "published" as const,
    is_featured: true,
    category: "restoration",
    completion_time: "3 weeks",
    techniques: ["Chalk Paint", "Distressing", "Hardware Upgrade"],
    price_range: "$800-1200",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "sample-2",
    title: "Modern Coffee Table Makeover",
    description: "Sleek transformation with geometric design.",
    brief_description: "Sleek transformation with geometric design.",
    before_images: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop&auto=format&q=80",
    ],
    after_images: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop&auto=format&q=80",
    ],
    status: "published" as const,
    is_featured: true,
    category: "modern",
    completion_time: "2 weeks",
    techniques: ["Geometric Design", "Premium Lacquer", "Metal Accents"],
    price_range: "$600-900",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // Add more sample projects to demonstrate pagination
  ...Array.from({ length: 20 }, (_, i) => ({
    id: `sample-${i + 3}`,
    title: `Project ${i + 3}`,
    description: `Sample project ${i + 3} description`,
    brief_description: `Sample project ${i + 3} brief description`,
    before_images: [
      `https://images.unsplash.com/photo-${1586023492125 + i}?w=800&h=600&fit=crop&auto=format&q=80`,
    ],
    after_images: [
      `https://images.unsplash.com/photo-${1586023492125 + i}?w=800&h=600&fit=crop&auto=format&q=80`,
    ],
    status: "published" as const,
    is_featured: i < 5,
    category: ["restoration", "modern", "vintage", "industrial"][i % 4],
    completion_time: `${Math.floor(Math.random() * 5) + 1} weeks`,
    techniques: ["Technique 1", "Technique 2"],
    price_range: "$400-800",
    created_at: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
  })),
];

export default function PortfolioPage() {
  // Initialize with sample data to prevent empty state during SSR
  const initialProjects = getSampleProjects();

  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<ProjectType[]>(initialProjects);
  const [displayedProjects, setDisplayedProjects] = useState<ProjectType[]>(
    initialProjects.slice(0, 6)
  );
  const [filterType, setFilterType] = useState("all");
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const projectsPerPage = 6; // Show 6 projects (3 columns x 2 rows)

  // Fetch real projects from database
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch published projects only for public view
        const fetchedProjects = await getPortfolioProjects({
          status: "published",
          orderBy: [
            { column: "is_featured", ascending: false },
            { column: "created_at", ascending: false },
          ],
        });

        // Transform projects to match UI requirements
        const transformedProjects = fetchedProjects.map((project: any) => ({
          ...project,
          // Add computed properties for backward compatibility
          category: project.techniques?.[0]?.toLowerCase() || "general",
          completion_time: project.completion_date
            ? `${Math.ceil(Math.abs(new Date().getTime() - new Date(project.completion_date).getTime()) / (1000 * 3600 * 24 * 7))} weeks`
            : "2-4 weeks",
          price_range: "$500-1500", // Default range, could be added to database later
        }));

        setProjects(transformedProjects);
        // Initialize displayed projects with first page
        setDisplayedProjects(transformedProjects.slice(0, projectsPerPage));
      } catch (err) {
        console.error("Error fetching portfolio projects:", err);
        setError("Failed to load portfolio projects. Please try again later.");
        // Fallback to sample data on error
        const fallbackProjects = getSampleProjects();
        setProjects(fallbackProjects);
        setDisplayedProjects(fallbackProjects.slice(0, projectsPerPage));
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Update displayed projects when filter changes
  useEffect(() => {
    const filtered =
      filterType === "all"
        ? projects
        : projects.filter((project) => project.category === filterType);

    setDisplayedProjects(filtered.slice(0, projectsPerPage));
    setCurrentPage(1);
  }, [filterType, projects]);

  const filteredProjects =
    filterType === "all" ? projects : projects.filter((project) => project.category === filterType);

  const hasMoreProjects = displayedProjects.length < filteredProjects.length;

  const loadMoreProjects = useCallback(() => {
    console.warn("loadMoreProjects called", {
      isLoadingMore,
      hasMoreProjects,
      displayedLength: displayedProjects.length,
      filteredLength: filteredProjects.length,
      currentPage,
      filterType,
    });

    if (isLoadingMore || !hasMoreProjects) {
      console.warn("Early return:", { isLoadingMore, hasMoreProjects });
      return;
    }

    setIsLoadingMore(true);

    // Simulate loading delay for better UX
    setTimeout(() => {
      const filtered =
        filterType === "all"
          ? projects
          : projects.filter((project) => project.category === filterType);

      const nextPage = currentPage + 1;
      const startIndex = 0;
      const endIndex = nextPage * projectsPerPage;
      const newProjects = filtered.slice(startIndex, endIndex);

      console.warn("Loading more projects:", {
        currentPage,
        nextPage,
        filtered: filtered.length,
        displayed: displayedProjects.length,
        newProjects: newProjects.length,
        endIndex,
        projectsPerPage,
      });

      setDisplayedProjects(newProjects);
      setCurrentPage(nextPage);
      setIsLoadingMore(false);
    }, 300);
  }, [
    isLoadingMore,
    hasMoreProjects,
    displayedProjects.length,
    filteredProjects.length,
    currentPage,
    filterType,
    projects,
    projectsPerPage,
  ]);

  const stats = [
    {
      icon: TrendingUp,
      number: `${projects.length}+`,
      label: "Projects Completed",
      gradient: "from-violet-500 to-purple-600",
      bgGradient: "from-violet-50 to-purple-50",
    },
    {
      icon: Award,
      number: "100%",
      label: "Client Satisfaction",
      gradient: "from-amber-500 to-orange-600",
      bgGradient: "from-amber-50 to-orange-50",
    },
    {
      icon: Users,
      number: `${Math.ceil(projects.length * 0.8)}+`,
      label: "Happy Clients",
      gradient: "from-emerald-500 to-teal-600",
      bgGradient: "from-emerald-50 to-teal-50",
    },
    {
      icon: Calendar,
      number: "5+",
      label: "Years Experience",
      gradient: "from-blue-500 to-cyan-600",
      bgGradient: "from-blue-50 to-cyan-50",
    },
  ];

  const getUniqueCategories = () => {
    const categories = projects.map((p) => p.category).filter(Boolean);
    const uniqueCategories = [...new Set(categories)];

    return [
      { id: "all", label: "All Projects", count: projects.length },
      ...uniqueCategories.map((category) => ({
        id: category!,
        label: category!.charAt(0).toUpperCase() + category!.slice(1),
        count: projects.filter((p) => p.category === category).length,
      })),
    ];
  };

  const categories = getUniqueCategories();

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-violet-600" />
          <p className="text-slate-600">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && projects.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md mx-auto p-6">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-slate-900">Unable to Load Portfolio</h2>
          <p className="text-slate-600">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-violet-600 hover:bg-violet-700"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Display error banner if there was an error but we have fallback data */}
      {error && projects.length > 0 && (
        <div className="bg-yellow-50 border-b border-yellow-200 px-6 py-3">
          <div className="container mx-auto">
            <p className="text-yellow-800 text-sm">⚠️ {error} Showing sample data.</p>
          </div>
        </div>
      )}

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
                Furniture
                <br />
                <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                  Transformations
                </span>
              </h1>

              <p className="text-2xl lg:text-3xl text-slate-600 leading-relaxed max-w-4xl mx-auto font-light">
                Discover the artistry behind each piece. From vintage restorations to modern
                makeovers, every transformation tells a unique story of craftsmanship and
                creativity.
              </p>

              <motion.div
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-6 justify-center pt-8"
              >
                <motion.div whileHover={scaleOnHover}>
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl text-lg font-semibold"
                    onClick={() => {
                      document.getElementById("portfolio-section")?.scrollIntoView({
                        behavior: "smooth",
                      });
                    }}
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
                    onClick={() => {
                      document.getElementById("categories-section")?.scrollIntoView({
                        behavior: "smooth",
                      });
                    }}
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
                <motion.div key={index} variants={fadeInUp} className="group">
                  <motion.div
                    className={`relative p-8 rounded-3xl bg-gradient-to-br ${stat.bgGradient} border border-white/50 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden text-center`}
                    whileHover={{ y: -8, scale: 1.02 }}
                  >
                    <div
                      className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-full blur-2xl transform translate-x-8 -translate-y-8`}
                    />

                    <div className="relative space-y-4">
                      <div
                        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.gradient} p-4 shadow-lg group-hover:scale-110 transition-transform duration-300 mx-auto`}
                      >
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
      <section id="categories-section" className="py-16 bg-white dark:bg-slate-800">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="space-y-12"
          >
            <motion.div variants={fadeInUp} className="text-center space-y-6">
              <Badge className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-200 dark:border-blue-700 text-blue-800 dark:text-blue-300 px-4 py-2">
                <Filter className="w-4 h-4 mr-2" />
                Browse by Category
              </Badge>
              <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 dark:from-slate-100 dark:via-slate-200 dark:to-slate-300 bg-clip-text text-transparent">
                Featured Transformations
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mx-auto font-light">
                Explore our diverse range of furniture restoration and design projects.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-4">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={filterType === category.id ? "default" : "outline"}
                  className={`
                    px-6 py-3 rounded-full transition-all duration-300 text-sm font-medium
                    ${
                      filterType === category.id
                        ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg"
                        : "hover:bg-slate-50 hover:border-slate-300"
                    }
                  `}
                  onClick={() => setFilterType(category.id)}
                >
                  {category.label}
                  <Badge
                    variant="secondary"
                    className={`ml-2 text-xs ${
                      filterType === category.id
                        ? "bg-white/20 text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {category.count}
                  </Badge>
                </Button>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Portfolio Grid Section */}
      <section id="portfolio-section" className="py-20 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {displayedProjects.map((project, index) => (
              <motion.div key={project.id} variants={fadeInUp} custom={index} className="group">
                <motion.div
                  className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-800 shadow-lg hover:shadow-2xl transition-all duration-500 h-full"
                  whileHover={{ y: -8 }}
                >
                  {/* Project Image */}
                  <div className="relative aspect-[4/3] bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
                    {project.after_images && project.after_images.length > 0 && (
                      <img
                        src={project.after_images[0]}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                          // Fallback to a placeholder if image fails to load
                          (e.target as HTMLImageElement).src =
                            "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&auto=format&q=80";
                        }}
                      />
                    )}

                    {/* Featured Badge */}
                    {project.is_featured && (
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-400 dark:to-orange-400 text-white border-0 shadow-lg">
                          <Sparkles className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      </div>
                    )}

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end">
                      <div className="p-6 w-full">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="w-full bg-white/90 hover:bg-white text-slate-900"
                        >
                          <ArrowRight className="ml-2 h-3 w-3" />
                          View Project
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-300 text-sm line-clamp-2 leading-relaxed">
                        {project.brief_description || project.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {project.completion_time || "2-4 weeks"}
                      </span>
                      <span className="flex items-center">
                        <Award className="w-3 h-3 mr-1" />
                        {project.techniques?.length || 0} techniques
                      </span>
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
                      <Link href={`/portfolio/${project.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full group-hover:bg-violet-50 group-hover:border-violet-200 group-hover:text-violet-600 transition-colors"
                        >
                          View Details
                          <ArrowRight className="ml-2 h-3 w-3" />
                        </Button>
                      </Link>
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
                  onClick={() => {
                    console.warn("Load More button clicked");
                    loadMoreProjects();
                  }}
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
                      Load More Projects ({filteredProjects.length - displayedProjects.length}{" "}
                      remaining)
                    </>
                  )}
                </Button>
              </motion.div>

              {/* Debug Information - Remove this in production */}
              <div className="mt-4 text-xs text-gray-500 space-y-1">
                <div>Total Projects: {projects.length}</div>
                <div>Filtered Projects: {filteredProjects.length}</div>
                <div>Displayed Projects: {displayedProjects.length}</div>
                <div>Current Page: {currentPage}</div>
                <div>Projects Per Page: {projectsPerPage}</div>
                <div>Has More: {hasMoreProjects ? "Yes" : "No"}</div>
                <div>Is Loading: {isLoadingMore ? "Yes" : "No"}</div>
                <div>Filter: {filterType}</div>
              </div>
            </motion.div>
          )}

          {/* No projects message */}
          {displayedProjects.length === 0 && !isLoading && (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="text-center py-16"
            >
              <div className="text-6xl mb-6">🎨</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">No Projects Found</h3>
              <p className="text-slate-600 mb-6">
                {filterType === "all"
                  ? "No portfolio projects are available at the moment."
                  : `No projects found in the "${filterType}" category.`}
              </p>
              {filterType !== "all" && (
                <Button
                  variant="outline"
                  onClick={() => setFilterType("all")}
                  className="hover:bg-violet-50 hover:border-violet-200 hover:text-violet-600"
                >
                  View All Projects
                </Button>
              )}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
