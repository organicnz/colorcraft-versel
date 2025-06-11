"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
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
import { createClient } from "@/lib/supabase/client";
import type { TeamMember } from "@/types/team";

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

  // Transform team members for display
  const displayTeamMembers = teamMembers.map((member, index) => ({
    id: member.id,
    name: member.full_name,
    role: member.position,
    bio: member.bio || `Expert in ${member.specialties?.[0] || 'furniture restoration'}`,
    image: member.avatar_url || (index % 2 === 0 ?
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face" :
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face"
    ),
    specialty: member.specialties?.[0] || 'Furniture Expert',
    achievement: member.years_experience ? `${member.years_experience}+ years` : 'Expert Craftsperson',
    email: member.email,
    phone: member.phone,
    social_links: member.social_links
  }));

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

      {/* Meet Our Team Section */}
      {displayTeamMembers.length > 0 && (
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <div className="space-y-16">
              <div className="text-center space-y-6">
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
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayTeamMembers.map((member) => (
                  <div key={member.id} className="group">
                    <div className="relative overflow-hidden rounded-3xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                      <div className="relative h-80 overflow-hidden">
                        <Image
                          src={member.image}
                          alt={member.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute bottom-4 left-4 right-4 text-white">
                            <div className="flex items-center space-x-2 mb-2">
                              <Star className="w-4 h-4 text-yellow-400" />
                              <span className="text-sm font-medium">{member.achievement}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 space-y-4">
                        <div>
                          <h3 className="text-xl font-bold text-slate-900">{member.name}</h3>
                          <p className="text-violet-600 font-medium">{member.role}</p>
                        </div>

                        <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
                          {member.bio}
                        </p>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                          <Badge variant="secondary" className="bg-violet-50 text-violet-700 border-violet-200">
                            {member.specialty}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
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