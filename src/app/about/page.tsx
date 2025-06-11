"use client";

import React from "react";
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
import { getFeaturedTeamMembers } from "@/services/team.service";
import type { TeamMember } from "@/types/team";

interface AboutPageProps {
  teamMembers: TeamMember[];
}

function AboutPageClient({ teamMembers }: AboutPageProps) {
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
    achievement: member.years_experience ? `${member.years_experience}+ years` : 'Expert Craftsman',
    gradient: index % 2 === 0 ? "from-violet-500 to-purple-600" : "from-emerald-500 to-teal-600"
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-40 h-40 bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-60 h-60 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-6 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center rounded-full border border-violet-200 bg-gradient-to-r from-violet-50 to-purple-50 px-6 py-3 text-sm font-semibold text-violet-800 shadow-sm">
              <Sparkles className="w-4 h-4 mr-2" />
              About Color & Craft
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
              <Button asChild className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                <Link href="/portfolio">
                  <Award className="w-5 h-5 mr-2" />
                  View Our Work
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>

              <Button variant="outline" asChild className="border-2 border-slate-200 text-slate-700 hover:bg-slate-50 px-8 py-4 rounded-2xl backdrop-blur-sm bg-white/50">
                <Link href="/contact">
                  Get Free Quote
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-32 bg-gradient-to-br from-slate-50 to-white relative">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-6 mb-16">
              <div className="inline-flex items-center rounded-full border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 text-xs font-semibold text-blue-800">
                About ColorCraft
              </div>
              <h2 className="text-5xl lg:text-6xl font-bold bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent">
                Where artistry meets precision
              </h2>
              <p className="text-xl lg:text-2xl text-slate-600 leading-relaxed max-w-4xl mx-auto font-light">
                At ColorCraft, we believe that furniture is more than just functional pieces;
                they're the foundation of your sanctuary where cherished memories are crafted,
                and where warmth and tranquility thrive.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
              <div className="p-8 rounded-3xl bg-white/60 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 p-4 shadow-lg">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Mission</h3>
                <p className="text-slate-600 leading-relaxed">
                  At ColorCraft, our mission is to help you transform your furniture pieces into beautiful,
                  functional art that perfectly aligns with your lifestyle and aspirations. We're committed
                  to making the restoration and transformation process seamless and inspiring.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-white/60 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-4 shadow-lg">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Values</h3>
                <p className="text-slate-600 leading-relaxed">
                  Integrity, craftsmanship, and client satisfaction drive us. We uphold the highest quality
                  standards, deliver exceptional results, and offer personalized guidance tailored to your
                  unique vision and needs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-32 bg-white relative">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div className="space-y-6">
                  <div className="inline-flex items-center rounded-full border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 px-4 py-2 text-xs font-semibold text-emerald-800">
                    <TreePine className="w-4 h-4 mr-2" />
                    Our Journey
                  </div>
                  <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent">
                    Crafting stories, one piece at a time
                  </h2>
                  <p className="text-lg text-slate-600 leading-relaxed">
                    Founded with a passion for breathing new life into forgotten furniture,
                    Color & Craft has grown from a small workshop into a trusted name in furniture restoration.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 p-2 flex-shrink-0">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2">Expert Craftsmanship</h4>
                      <p className="text-slate-600">
                        Our team combines traditional techniques with modern innovations to deliver unmatched quality.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 p-2 flex-shrink-0">
                      <Palette className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2">Custom Solutions</h4>
                      <p className="text-slate-600">
                        Every project is unique, and we tailor our approach to match your vision and requirements.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 p-2 flex-shrink-0">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2">Personal Touch</h4>
                      <p className="text-slate-600">
                        We understand the emotional value of your furniture and treat each piece with the care it deserves.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=600&h=800&fit=crop&auto=format&q=80"
                    alt="Artisan working on furniture restoration"
                    width={600}
                    height={800}
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                
                <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-6 shadow-xl border border-white/20">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                      <Star className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-slate-900">500+</div>
                      <div className="text-sm text-slate-600">Happy Customers</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-32 bg-gradient-to-br from-slate-50 to-white relative">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-6 mb-16">
              <div className="inline-flex items-center rounded-full border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-2 text-xs font-semibold text-amber-800">
                <Users className="w-4 h-4 mr-2" />
                Meet Our Team
              </div>
              <h2 className="text-5xl lg:text-6xl font-bold bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent">
                The artisans behind every transformation
              </h2>
              <p className="text-xl lg:text-2xl text-slate-600 leading-relaxed max-w-3xl mx-auto font-light">
                Our passionate team of experts brings decades of combined experience to every project.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
              {displayTeamMembers.map((member) => (
                <div key={member.id} className="group">
                  <div className="relative overflow-hidden rounded-3xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500">
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
                      <div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-1">{member.name}</h3>
                        <p className="text-lg font-medium bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                          {member.role}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="text-sm font-medium text-slate-500">Specialty</div>
                        <div className="text-slate-700 font-medium">{member.specialty}</div>
                      </div>

                      <p className="text-slate-600 leading-relaxed">{member.bio}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-32 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-6 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-5xl lg:text-6xl font-bold bg-gradient-to-br from-white via-white to-slate-200 bg-clip-text text-transparent">
              Ready to transform your furniture?
            </h2>
            <p className="text-xl lg:text-2xl text-slate-300 leading-relaxed max-w-3xl mx-auto font-light">
              Let's discuss your vision and create something beautiful together.
              Contact us today for a free consultation.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-12 py-4 rounded-2xl shadow-xl">
                <Link href="/contact">
                  Start Your Project
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              
              <Button variant="outline" asChild className="border-2 border-white/20 text-white hover:bg-white/10 px-12 py-4 rounded-2xl backdrop-blur-sm">
                <Link href="/portfolio">
                  View Portfolio
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default async function AboutPage() {
  // Fetch team members from Supabase
  const teamMembers = await getFeaturedTeamMembers();

  return <AboutPageClient teamMembers={teamMembers} />;
}