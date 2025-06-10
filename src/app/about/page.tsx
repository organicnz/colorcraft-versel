"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Award,
  Heart,
  Sparkles,
  Users,
  CheckCircle,
  Palette,
  Shield,
  TreePine,
  Star
} from "lucide-react";

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
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

const scaleOnHover = {
  scale: 1.02,
  transition: { type: "spring", stiffness: 300, damping: 20 }
};

// Enhanced team data with modern styling
const teamMembers = [
  {
    id: 1,
    name: "Rustam Avanesian",
    role: "Lead Designer & Master Craftsman",
    bio: "15+ years of experience in furniture design and restoration. Pioneer in sustainable design practices and modern upcycling techniques.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    specialty: "Vintage Revival & Custom Finishes",
    achievement: "Master Craftsman",
    gradient: "from-violet-500 to-purple-600"
  },
  {
    id: 2,
    name: "Kseniia Avanesian",
    role: "Creative Director & Project Manager",
    bio: "Interior design expert with exceptional project management skills. Ensures every project exceeds expectations through clear communication and attention to detail.",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
    specialty: "Interior Design & Client Relations",
    achievement: "Design Excellence Award",
    gradient: "from-emerald-500 to-teal-600"
  }
];

// Modern values with enhanced icons
const companyValues = [
  {
    icon: Award,
    title: "Excellence in Craftsmanship",
    description: "Every piece is meticulously crafted with attention to detail and commitment to quality that exceeds expectations.",
    gradient: "from-violet-500 to-purple-600",
    bgGradient: "from-violet-50 to-purple-50"
  },
  {
    icon: TreePine,
    title: "Sustainable Practices",
    description: "Eco-friendly materials and processes that minimize environmental impact while creating healthier living spaces.",
    gradient: "from-emerald-500 to-teal-600",
    bgGradient: "from-emerald-50 to-teal-50"
  },
  {
    icon: Heart,
    title: "Customer-Centric Approach",
    description: "We listen, understand, and collaborate to bring your vision to life with care, precision, and personal attention.",
    gradient: "from-rose-500 to-pink-600",
    bgGradient: "from-rose-50 to-pink-50"
  },
  {
    icon: Sparkles,
    title: "Innovation & Creativity",
    description: "Cutting-edge techniques combined with artistic vision to create unique, modern transformations.",
    gradient: "from-amber-500 to-orange-600",
    bgGradient: "from-amber-50 to-orange-50"
  }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Modern Hero Section with Glassmorphism */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Advanced Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20" />
          <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-violet-400/10 to-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-cyan-500/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-6 @container relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="space-y-8"
            >
              <motion.div variants={fadeInUp}>
                <Badge className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 border-violet-200 text-violet-800 px-4 py-2 mb-6">
                  <Users className="w-4 h-4 mr-2" />
                  About Our Story
                </Badge>
                <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent leading-tight">
                  Crafting stories through
                  <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent"> transformation</span>
                </h1>
              </motion.div>

              <motion.div variants={fadeInUp} className="space-y-6">
                <p className="text-xl lg:text-2xl text-slate-600 leading-relaxed font-light">
                  We believe every piece of furniture has a story to tell. Our mission is to preserve that heritage while creating something extraordinary for modern living.
                </p>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Since 2015, we've transformed hundreds of pieces through sustainable practices, premium materials, and innovative techniques that honor the past while embracing the future.
                </p>
              </motion.div>

              <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
                <motion.div whileHover={scaleOnHover}>
                  <Link href="/portfolio">
                    <Button size="lg" className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl shadow-xl">
                      View Our Work
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </motion.div>
                <motion.div whileHover={scaleOnHover}>
                  <Link href="/contact">
                    <Button size="lg" variant="outline" className="border-2 border-slate-200 text-slate-700 hover:bg-slate-50 px-8 py-4 rounded-2xl backdrop-blur-sm bg-white/50">
                      Get In Touch
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="relative"
            >
              <div className="relative h-[600px] w-full overflow-hidden rounded-3xl shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&auto=format&q=80"
                  alt="Master craftsman at work in our modern workshop"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                {/* Glassmorphism overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                    <div className="flex items-center gap-3 text-white">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">500+ Transformations Completed</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Modern Values Section */}
      <section className="py-32 bg-gradient-to-br from-slate-50 to-white relative overflow-hidden">
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
            <motion.div variants={fadeInUp} className="text-center space-y-6 max-w-4xl mx-auto">
              <Badge className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-emerald-200 text-emerald-800 px-4 py-2">
                <Shield className="w-4 h-4 mr-2" />
                Our Values
              </Badge>
              <h2 className="text-5xl lg:text-6xl font-bold bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent">
                What drives us forward
              </h2>
              <p className="text-xl lg:text-2xl text-slate-600 leading-relaxed font-light">
                Our commitment to excellence, sustainability, and innovation guides everything we do.
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              className="grid grid-cols-1 @md:grid-cols-2 gap-8 max-w-6xl mx-auto"
            >
              {companyValues.map((value, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="group"
                >
                  <motion.div
                    className={`relative p-8 rounded-3xl bg-gradient-to-br ${value.bgGradient} border border-white/50 shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden h-full`}
                    whileHover={{ y: -5, scale: 1.02 }}
                  >
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${value.gradient} opacity-10 rounded-full blur-2xl transform translate-x-8 -translate-y-8`} />

                    <div className="relative space-y-6">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${value.gradient} p-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <value.icon className="w-8 h-8 text-white" />
                      </div>

                      <div className="space-y-3">
                        <h3 className="text-2xl font-bold text-slate-900 group-hover:text-slate-800 transition-colors">
                          {value.title}
                        </h3>
                        <p className="text-slate-600 leading-relaxed text-lg">
                          {value.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Ultra-Modern Team Section */}
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
                <Users className="w-4 h-4 mr-2" />
                Meet Our Team
              </Badge>
              <h2 className="text-5xl lg:text-6xl font-bold bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent">
                The artisans behind the magic
              </h2>
              <p className="text-xl lg:text-2xl text-slate-600 leading-relaxed max-w-3xl mx-auto font-light">
                Meet the passionate experts who bring decades of combined experience to every transformation.
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              className="grid grid-cols-1 @lg:grid-cols-2 gap-12 max-w-5xl mx-auto"
            >
              {teamMembers.map((member) => (
                <motion.div
                  key={member.id}
                  variants={fadeInUp}
                  className="group"
                >
                  <motion.div
                    className="relative overflow-hidden rounded-3xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500"
                    whileHover={{ y: -8 }}
                  >
                    <div className="relative h-80 overflow-hidden">
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      <div className="absolute top-4 left-4">
                        <Badge className={`bg-gradient-to-r ${member.gradient} text-white shadow-lg`}>
                          {member.achievement}
                        </Badge>
                      </div>
                    </div>

                    <div className="p-8 space-y-4">
                      <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-slate-900">
                          {member.name}
                        </h3>
                        <p className={`text-lg font-medium bg-gradient-to-r ${member.gradient} bg-clip-text text-transparent`}>
                          {member.role}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="text-sm font-medium text-slate-500">Specialty</div>
                        <div className="text-slate-700 font-medium">
                          {member.specialty}
                        </div>
                      </div>

                      <p className="text-slate-600 leading-relaxed">
                        {member.bio}
                      </p>
                    </div>
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
      </section>
    </div>
  );
}