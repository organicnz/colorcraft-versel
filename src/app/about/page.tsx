"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard, GlassPanel } from "@/components/ui/glass-card";
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
import { createClient } from "@/lib/supabase/client";
import type { TeamMember } from "@/types/team";
import { getTeamMembers } from "@/services/team.service";

export default function AboutPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTeamMembers() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('team')
          .select('*')
          .eq('is_featured', true)
          .eq('is_active', true)
          .order('display_order');

        if (error) {
          console.error('Error fetching team members:', error);
        } else {
          setTeamMembers(data || []);
        }
      } catch (error) {
        console.error('Error fetching team members:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTeamMembers();
  }, []);

  // Use fallback data if no team members loaded
  const fallbackTeamMembers = [
    {
      id: "sarah-mitchell-fallback",
      name: "Sarah Mitchell",
      role: "Lead Restoration Artist",
      specialty: "Vintage Restoration",
      achievement: "Master Craftsperson",
      bio: "Sarah brings over 15 years of experience in furniture restoration and color theory. She specializes in bringing antique and vintage pieces back to their original glory while preserving their historical character.",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b05c?w=400&h=400&fit=crop&auto=format&q=80"
    },
    {
      id: "james-wilson-fallback", 
      name: "James Wilson",
      role: "Custom Finish Specialist",
      specialty: "Modern Techniques",
      achievement: "Innovation Award",
      bio: "James is our go-to expert for contemporary finishes and modern paint techniques. His innovative approach has revolutionized how we approach furniture makeovers for modern homes.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&auto=format&q=80"
    },
    {
      id: "emma-rodriguez-fallback",
      name: "Emma Rodriguez", 
      role: "Design Consultant",
      specialty: "Color Coordination",
      achievement: "Design Excellence",
      bio: "Emma's keen eye for color and design helps clients envision the perfect finish for their furniture. She bridges the gap between artistic vision and practical application.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&auto=format&q=80"
    },
    {
      id: "michael-chen-fallback",
      name: "Michael Chen",
      role: "Workshop Manager", 
      specialty: "Quality Control",
      achievement: "Excellence Award",
      bio: "Michael ensures every project meets our exacting standards. His attention to detail and quality control processes guarantee exceptional results for every client.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&auto=format&q=80"
    }
  ];

  // Display real team members if available, otherwise show fallback
  const displayTeamMembers = teamMembers.length > 0 ? teamMembers : fallbackTeamMembers;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50">
      {/* Hero Section */}
      <section className="relative pt-20 lg:pt-32 pb-16 lg:pb-24 overflow-hidden">
        <div className="container mx-auto px-6 text-center">
          <div className="space-y-8">
            <div>
              <Badge className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 border-violet-200 text-violet-700 px-6 py-3 text-sm font-medium">
                <Sparkles className="w-4 h-4 mr-2" />
                About Color & Craft
              </Badge>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
              <span className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent">
                Where artistry meets
              </span>
              <br />
              <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                precision
              </span>
            </h1>

            <p className="text-xl lg:text-2xl text-slate-600 leading-relaxed max-w-3xl mx-auto font-light">
              At Color & Craft, we believe that furniture is more than just functional pieces;
              they're the foundation of your sanctuary where cherished memories are crafted.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                <Link href="/portfolio" className="flex items-center">
                  View Our Work
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-violet-200 text-violet-700 hover:bg-violet-50 px-8 py-4 rounded-full transition-all duration-300">
                <Link href="/contact" className="flex items-center">
                  Start Your Project
                  <Heart className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div>
                  <Badge className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-200 text-amber-800 px-4 py-2 mb-6">
                    <Award className="w-4 h-4 mr-2" />
                    Our Story
                  </Badge>
                  <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
                    Breathing life into
                    <span className="text-gradient bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent"> forgotten treasures</span>
                  </h2>
                </div>

                <div className="space-y-6 text-lg text-slate-600 leading-relaxed">
                  <p>
                    Founded in 2018, Color & Craft began as a passion project in a small garage workshop.
                    Our founder, inspired by the beauty hidden within worn and weathered furniture,
                    started with a simple mission: to rescue discarded pieces and transform them into stunning centerpieces.
                  </p>
                  <p>
                    Today, we've grown into a team of dedicated artisans, each bringing unique expertise
                    in restoration techniques, color theory, and design innovation. We've helped over
                    1,000 families rediscover the beauty in their cherished pieces.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-8 py-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-violet-600">1000+</div>
                    <div className="text-sm text-slate-500 uppercase tracking-wide">Projects Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-violet-600">5</div>
                    <div className="text-sm text-slate-500 uppercase tracking-wide">Years Experience</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-violet-600">100%</div>
                    <div className="text-sm text-slate-500 uppercase tracking-wide">Satisfaction</div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="relative h-[600px] rounded-3xl overflow-hidden shadow-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=800&fit=crop&auto=format&q=80"
                    alt="Our workshop"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-violet-900/20 to-transparent"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-24 bg-gradient-to-br from-slate-50 to-violet-50">
        <div className="container mx-auto px-6">
          <div className="text-center space-y-16">
            <div className="space-y-6">
              <Badge className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-blue-200 text-blue-800 px-4 py-2">
                <CheckCircle className="w-4 h-4 mr-2" />
                Our Values
              </Badge>
              <h2 className="text-4xl lg:text-5xl font-bold text-slate-900">
                What drives us
                <span className="text-gradient bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> every day</span>
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Our core values shape every project we undertake and every relationship we build.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: Palette,
                  title: "Artistry",
                  description: "Every piece is a canvas for creative expression and masterful craftsmanship."
                },
                {
                  icon: Heart,
                  title: "Passion",
                  description: "We pour our hearts into every restoration, treating each piece as our own."
                },
                {
                  icon: Shield,
                  title: "Quality",
                  description: "Premium materials and meticulous attention to detail in every project."
                },
                {
                  icon: TreePine,
                  title: "Sustainability",
                  description: "Giving new life to furniture while protecting our environment."
                }
              ].map((value, index) => (
                <div key={value.title} className="group cursor-pointer">
                  <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-100 h-full">
                    <div className="space-y-6">
                      <div className="w-16 h-16 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                        <value.icon className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">{value.title}</h3>
                        <p className="text-slate-600 leading-relaxed">{value.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Meet Our Team Section - Enhanced with glassmorphism and horizontal layout */}
      {displayTeamMembers.length > 0 && (
        <section className="py-24 relative">
          {/* Background with glassmorphism effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-pink-50/30 to-blue-50/50 dark:from-purple-900/20 dark:via-pink-900/10 dark:to-blue-900/20" />
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="space-y-16">
              {/* Section Header with glassmorphism */}
              <GlassPanel className="text-center space-y-6 bg-white/40 dark:bg-white/10 backdrop-blur-xl border-white/40 dark:border-white/20">
                <Badge className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-200 text-amber-800 px-4 py-2">
                  <Users className="w-4 h-4 mr-2" />
                  Meet Our Team
                </Badge>
                <h2 className="text-4xl lg:text-5xl font-bold text-slate-900">
                  The artisans behind
                  <span className="text-gradient bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent"> the magic</span>
                </h2>
                <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                  Meet the talented individuals who bring passion, expertise, and creativity to every project.
                </p>
              </GlassPanel>

              {/* Team Members - Horizontal Layout */}
              <div className="space-y-6">
                {displayTeamMembers.map((member, index) => {
                  // Trim bio to ensure consistent card heights
                  const trimmedBio = member.bio && member.bio.length > 180 ? `${member.bio.substring(0, 180)}...` : member.bio;
                  return (
                    <GlassCard 
                      key={member.id} 
                      variant="light" 
                      intensity="strong" 
                      blur="lg"
                      shadow="heavy"
                      className={`group transition-all duration-500 hover:scale-[1.01] hover:shadow-glass-heavy border-white/30 dark:border-white/20 ${
                        index % 2 === 0 ? 'ml-0 mr-8' : 'ml-8 mr-0'
                      }`}
                    >
                      <div className={`flex items-center gap-8 h-full p-4 ${
                        index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                      }`}>
                        {/* Avatar */}
                        <div className="relative flex-shrink-0">
                          <div className="w-32 h-32 rounded-3xl overflow-hidden ring-4 ring-white/30 shadow-xl">
                            <Image
                              src={member.image}
                              alt={member.name}
                              width={128}
                              height={128}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              sizes="(max-width: 768px) 100vw, 50vw"
                            />
                          </div>
                          
                          {/* Achievement badge */}
                          <div className="absolute -bottom-2 -right-2">
                            <Badge variant="secondary" className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-lg backdrop-blur-sm">
                              <Star className="w-3 h-3 mr-1" />
                              {member.achievement}
                            </Badge>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 space-y-4">
                          {/* Name and Role */}
                          <div className={`space-y-2 ${index % 2 === 0 ? 'text-left' : 'text-right'}`}>
                            <h3 className="text-2xl font-bold text-slate-900">{member.name}</h3>
                            <p className="text-violet-600 font-medium text-lg">{member.role}</p>
                          </div>

                          {/* Bio */}
                          <p className={`text-slate-600 leading-relaxed ${index % 2 === 0 ? 'text-left' : 'text-right'}`}>
                            {trimmedBio}
                          </p>

                          {/* Specialty */}
                          <div className={`flex ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                            <Badge 
                              variant="outline" 
                              className="bg-white/60 dark:bg-gray-800/60 border-violet-200/50 text-violet-700 backdrop-blur-sm px-4 py-2"
                            >
                              {member.specialty}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Call to Action Section */}
      <section className="py-24 bg-gradient-to-r from-violet-600 to-purple-700 text-white relative overflow-hidden">
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="space-y-8">
            <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
              Ready to transform your furniture?
            </h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto leading-relaxed">
              Let's discuss your vision and create something beautiful together. Every great transformation starts with a conversation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-violet-700 hover:bg-gray-50 px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                <Link href="/contact" className="flex items-center">
                  Get Free Consultation
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-violet-700 px-8 py-4 rounded-full transition-all duration-300">
                <Link href="/portfolio" className="flex items-center">
                  View Portfolio
                  <Sparkles className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}