"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  CheckCircle
} from "lucide-react";

interface ModernHomePageProps {
  featuredProjects: any[];
  services: any[];
  testimonials: any[];
}

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const stagger = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function ModernHomePage({
  featuredProjects,
  services,
  testimonials,
}: ModernHomePageProps) {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Newsletter signup:", email);
    setEmail("");
  };

  // Team members data
  const teamMembers = [
    {
      name: "Sarah Mitchell",
      role: "Lead Furniture Artist",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face",
      description: "15+ years in furniture restoration and custom painting"
    },
    {
      name: "James Wilson",
      role: "Restoration Specialist",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
      description: "Expert in antique furniture and period-accurate finishes"
    },
    {
      name: "Emma Rodriguez",
      role: "Design Consultant",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
      description: "Creative visionary specializing in modern upcycling"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1920&h=1080&fit=crop"
            alt="Beautiful furniture transformation"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 to-white/70" />
        </div>

        <div className="relative container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            className="space-y-8 max-w-xl"
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            <motion.div variants={fadeIn} className="space-y-4">
              <Badge className="bg-primary-100 text-primary-800 border-primary-200">
                ✨ Premium Furniture Transformations
              </Badge>
              <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
                Crafting sanctuaries that embrace
                <span className="text-primary-600"> warmth</span> and
                <span className="text-accent-600"> tranquility</span>
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed">
                Every piece is a canvas for cherished memories, where comfort and connection thrive.
                Transform your furniture into heirloom pieces that tell your story.
              </p>
            </motion.div>

            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-primary-600 hover:bg-primary-700 text-white px-8">
                View Our Work
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50">
                Get Free Quote
              </Button>
            </motion.div>

            <motion.div variants={fadeIn} className="flex items-center gap-8 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">200+</div>
                <div className="text-sm text-slate-600">Pieces Transformed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">15+</div>
                <div className="text-sm text-slate-600">Years Experience</div>
              </div>
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map((star) => (
                  <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="ml-2 text-sm text-slate-600">5.0 rating</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <div className="relative">
              <Image
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=700&fit=crop"
                alt="Featured furniture piece"
                width={600}
                height={700}
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg border border-slate-200">
                <div className="text-sm text-slate-600">Featured Transformation</div>
                <div className="font-semibold text-slate-900">Victorian Dresser Revival</div>
                <div className="text-primary-600 font-medium">$2,500</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center space-y-12">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="space-y-4"
            >
              <h2 className="text-4xl font-bold text-slate-900">About ColorCraft</h2>
              <p className="text-xl text-slate-600 leading-relaxed">
                At ColorCraft, we believe that furniture is more than just functional pieces;
                they're the foundation of your sanctuary where cherished memories are crafted,
                and where warmth and tranquility thrive. Our mission is to guide you on your
                journey to creating the perfect living space, providing unparalleled service
                and expertise every step of the way.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="grid md:grid-cols-2 gap-12"
            >
              <motion.div variants={fadeIn} className="text-left space-y-3">
                <h3 className="text-2xl font-semibold text-slate-900">Mission</h3>
                <p className="text-slate-600">
                  At ColorCraft, our mission is to help you transform your furniture pieces
                  into beautiful, functional art that perfectly aligns with your lifestyle
                  and aspirations. We're committed to making the restoration and transformation
                  process seamless and inspiring.
                </p>
              </motion.div>

              <motion.div variants={fadeIn} className="text-left space-y-3">
                <h3 className="text-2xl font-semibold text-slate-900">Values</h3>
                <p className="text-slate-600">
                  Integrity, craftsmanship, and client satisfaction drive us. We uphold the
                  highest quality standards, deliver exceptional results, and offer personalized
                  guidance tailored to your unique vision and needs.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Projects - RealVantage Style */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center space-y-4 mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-900">Featured Transformations</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Discover our portfolio of stunning furniture transformations that showcase
              our expertise and attention to detail.
            </p>
          </motion.div>

          {/* Featured Projects Grid - RealVantage Style */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {featuredProjects.slice(0, 4).map((project, index) => (
              <motion.div key={project.id} variants={fadeIn}>
                <div className="group cursor-pointer">
                  {/* Project Image */}
                  <div className="relative overflow-hidden rounded-lg mb-4">
                    <Image
                      src={project.image}
                      alt={project.title}
                      width={400}
                      height={300}
                      className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-primary-600 text-white border-0 px-3 py-1">
                        Featured
                      </Badge>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button variant="secondary" size="sm" className="w-full bg-white/90 text-slate-900 hover:bg-white">
                        View Details
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Project Details - RealVantage Style */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-slate-900 text-lg group-hover:text-primary-600 transition-colors">
                        {project.title}
                      </h3>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-slate-900">$2,500</div>
                        <div className="text-sm text-slate-500">Starting from</div>
                      </div>
                    </div>

                    <p className="text-slate-600 text-sm leading-relaxed">
                      {project.description}
                    </p>

                    <div className="flex items-center justify-between text-sm text-slate-500 pt-2">
                      <span>{project.material || "Premium Materials"}</span>
                      <span>2-3 weeks</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* View All Projects Button */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mt-12"
          >
            <Link href="/portfolio">
              <Button size="lg" variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50 px-8">
                View All Transformations
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center space-y-4 mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-900">Services Offered</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Comprehensive furniture transformation services tailored to bring your vision to life.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              { icon: Palette, title: "Custom Painting", description: "Premium finishes and techniques" },
              { icon: Settings, title: "Furniture Restoration", description: "Bring antiques back to life" },
              { icon: Sparkles, title: "Creative Upcycling", description: "Modern design updates" },
              { icon: Award, title: "Design Consultation", description: "Professional guidance" },
              { icon: CheckCircle, title: "Color Matching", description: "Perfect color coordination" },
              { icon: Settings, title: "Hardware Upgrade", description: "Quality hardware installation" },
              { icon: Palette, title: "Distressing Techniques", description: "Vintage and rustic finishes" },
              { icon: Sparkles, title: "Custom Stenciling", description: "Unique decorative elements" }
            ].map((service, index) => (
              <motion.div key={index} variants={fadeIn}>
                <Card className="text-center p-6 h-full hover:shadow-lg transition-shadow duration-300 border-slate-200">
                  <CardContent className="p-0 space-y-4">
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
                      <service.icon className="w-8 h-8 text-primary-600" />
                    </div>
                    <h3 className="font-semibold text-slate-900">{service.title}</h3>
                    <p className="text-slate-600 text-sm">{service.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center space-y-4 mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-900">Our Team</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Meet the skilled artisans behind every beautiful transformation.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            {teamMembers.map((member, index) => (
              <motion.div key={index} variants={fadeIn}>
                <Card className="text-center p-8 hover:shadow-lg transition-shadow duration-300 border-0 bg-white">
                  <CardContent className="p-0 space-y-4">
                    <div className="relative w-32 h-32 mx-auto">
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="rounded-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 text-lg">{member.name}</h3>
                      <p className="text-primary-600 font-medium">{member.role}</p>
                      <p className="text-slate-600 text-sm mt-2">{member.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="text-center space-y-4 mb-16"
            >
              <h2 className="text-4xl font-bold text-slate-900">Get In Touch</h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Ready to transform your furniture? Let's discuss your vision and create something beautiful together.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="grid md:grid-cols-3 gap-8 text-center"
            >
              <motion.div variants={fadeIn} className="space-y-3">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
                  <MapPin className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="font-semibold text-slate-900">Visit Our Studio</h3>
                <p className="text-slate-600">
                  123 Artisan Lane<br />
                  Creative District, CD 12345
                </p>
              </motion.div>

              <motion.div variants={fadeIn} className="space-y-3">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
                  <Phone className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="font-semibold text-slate-900">Call Us</h3>
                <p className="text-slate-600">
                  (555) 123-4567<br />
                  Mon-Sat: 9AM-6PM
                </p>
              </motion.div>

              <motion.div variants={fadeIn} className="space-y-3">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
                  <Mail className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="font-semibold text-slate-900">Email Us</h3>
                <p className="text-slate-600">
                  hello@colorcraft.com<br />
                  quotes@colorcraft.com
                </p>
              </motion.div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="mt-16 text-center"
            >
              <div className="bg-slate-50 rounded-2xl p-8 max-w-md mx-auto">
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  Get Project Updates
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-slate-300"
                  />
                  <Button type="submit" className="w-full bg-primary-600 hover:bg-primary-700">
                    Subscribe
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}