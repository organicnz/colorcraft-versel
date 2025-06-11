import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, ExternalLink, Linkedin, Instagram, Twitter, Facebook, Star, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassCard, GlassPanel } from "@/components/ui/glass-card";
import { getFeaturedTeamMembers } from "@/services/team.service";
import type { TeamMember, SocialLinks } from "@/types/team";

// Social icon mapping
const socialIcons = {
  linkedin: Linkedin,
  instagram: Instagram,
  twitter: Twitter,
  facebook: Facebook,
  portfolio: ExternalLink,
  website: ExternalLink,
};

interface TeamCardProps {
  member: TeamMember;
  index: number;
}

function TeamCard({ member, index }: TeamCardProps) {
  const {
    full_name,
    position,
    bio,
    avatar_url,
    email,
    phone,
    specialties,
    social_links,
    years_experience,
  } = member;

  // Trim bio to ensure consistent card heights
  const trimmedBio = bio && bio.length > 140 ? `${bio.substring(0, 140)}...` : bio;
  const isEven = index % 2 === 0;

  return (
    <GlassCard 
      variant="light" 
      intensity="strong" 
      blur="lg"
      shadow="heavy"
      className={`group transition-all duration-700 hover:scale-[1.03] hover:shadow-glass-heavy border-white/40 dark:border-white/25 overflow-hidden ${
        isEven ? 'ml-0 mr-12' : 'ml-12 mr-0'
      }`}
    >
      <div className={`flex items-center gap-8 h-full p-6 ${
        isEven ? 'flex-row' : 'flex-row-reverse'
      }`}>
        {/* Avatar Section */}
        <div className="relative flex-shrink-0">
          {/* Glow effect behind avatar */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-400/30 to-purple-500/30 rounded-3xl blur-xl transform group-hover:scale-110 transition-transform duration-700"></div>
          
          <div className="relative w-32 h-32 rounded-3xl overflow-hidden ring-4 ring-white/40 shadow-2xl transform group-hover:ring-white/60 transition-all duration-500">
            {avatar_url ? (
              <Image
                src={avatar_url}
                alt={full_name}
                width={128}
                height={128}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary-400 via-primary-500 to-primary-600 flex items-center justify-center text-white text-2xl font-bold">
                {full_name.split(' ').map(n => n[0]).join('')}
              </div>
            )}
            
            {/* Overlay gradient for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent"></div>
          </div>
          
          {/* Experience badge with animation */}
          {years_experience && (
            <div className="absolute -bottom-3 -right-3">
              <Badge className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white border-0 shadow-xl backdrop-blur-sm px-3 py-1.5 transform group-hover:scale-110 transition-transform duration-300">
                <Star className="w-3 h-3 mr-1" />
                {years_experience}+ yrs
              </Badge>
            </div>
          )}

          {/* Sparkles animation */}
          <div className="absolute -top-2 -left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <Sparkles className="w-6 h-6 text-primary-400 animate-pulse" />
          </div>
        </div>

        {/* Content Section */}
        <div className={`flex-1 min-w-0 space-y-4 ${isEven ? 'text-left' : 'text-right'}`}>
          {/* Name and Position with enhanced typography */}
          <div className="space-y-2">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
              {full_name}
            </h3>
            <p className="text-primary-600 dark:text-primary-400 font-semibold text-lg tracking-wide">
              {position}
            </p>
          </div>

          {/* Bio with better typography */}
          {trimmedBio && (
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed font-medium">
              {trimmedBio}
            </p>
          )}

          {/* Enhanced Specialties */}
          {specialties && specialties.length > 0 && (
            <div className={`flex flex-wrap gap-2 ${isEven ? 'justify-start' : 'justify-end'}`}>
              {specialties.slice(0, 3).map((specialty, i) => (
                <Badge 
                  key={specialty} 
                  variant="outline" 
                  className="bg-gradient-to-r from-white/70 to-white/50 dark:from-gray-800/70 dark:to-gray-800/50 border-primary-200/60 dark:border-primary-700/60 backdrop-blur-sm text-xs font-medium px-3 py-1.5 hover:scale-105 transition-transform duration-200"
                >
                  {specialty}
                </Badge>
              ))}
              {specialties.length > 3 && (
                <Badge 
                  variant="outline" 
                  className="bg-gradient-to-r from-primary-50/80 to-primary-100/60 dark:from-primary-900/60 dark:to-primary-800/80 border-primary-300/60 text-primary-700 dark:text-primary-300 backdrop-blur-sm text-xs px-3 py-1.5"
                >
                  +{specialties.length - 3} more
                </Badge>
              )}
            </div>
          )}

          {/* Enhanced Contact and Social Section */}
          <div className={`flex items-center gap-3 ${isEven ? 'justify-start' : 'justify-end'}`}>
            {/* Contact Buttons */}
            {email && (
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="h-9 w-9 p-0 hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-blue-600/20 dark:hover:from-blue-400/20 dark:hover:to-blue-500/20 backdrop-blur-sm border border-white/30 dark:border-white/20 hover:border-blue-300/60 transition-all duration-300 hover:scale-110"
              >
                <a href={`mailto:${email}`} title={`Email ${full_name}`}>
                  <Mail className="h-4 w-4" />
                </a>
              </Button>
            )}
            
            {phone && (
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="h-9 w-9 p-0 hover:bg-gradient-to-r hover:from-green-500/20 hover:to-green-600/20 dark:hover:from-green-400/20 dark:hover:to-green-500/20 backdrop-blur-sm border border-white/30 dark:border-white/20 hover:border-green-300/60 transition-all duration-300 hover:scale-110"
              >
                <a href={`tel:${phone}`} title={`Call ${full_name}`}>
                  <Phone className="h-4 w-4" />
                </a>
              </Button>
            )}

            {/* Enhanced Social Links */}
            {social_links && Object.entries(social_links as SocialLinks).slice(0, 2).map(([platform, url]) => {
              if (!url) return null;
              const IconComponent = socialIcons[platform as keyof typeof socialIcons] || ExternalLink;
              
              return (
                <Button
                  key={platform}
                  variant="ghost"
                  size="sm"
                  asChild
                  className="h-9 w-9 p-0 hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-pink-500/20 dark:hover:from-purple-400/20 dark:hover:to-pink-400/20 backdrop-blur-sm border border-white/30 dark:border-white/20 hover:border-purple-300/60 transition-all duration-300 hover:scale-110"
                >
                  <a 
                    href={url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    title={`${full_name} on ${platform}`}
                  >
                    <IconComponent className="h-4 w-4" />
                  </a>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

export default async function TeamSection() {
  let teamMembers: TeamMember[] = [];
  let error: string | null = null;

  try {
    teamMembers = await getFeaturedTeamMembers();
  } catch (err) {
    console.error('Error loading team members:', err);
    error = 'Unable to load team members at this time.';
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Enhanced Background with multiple layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 via-purple-50/40 to-pink-50/60 dark:from-blue-900/30 dark:via-purple-900/20 dark:to-pink-900/30" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-100/30 via-transparent to-secondary-100/30 dark:from-primary-900/20 dark:via-transparent dark:to-secondary-900/20" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Enhanced Section Header */}
        <GlassPanel className="text-center mb-16 bg-white/50 dark:bg-white/15 backdrop-blur-xl border-white/50 dark:border-white/25 shadow-2xl">
          <div className="space-y-6">
            <Badge className="bg-gradient-to-r from-primary-500/20 to-secondary-500/20 border-primary-300/50 text-primary-800 dark:text-primary-200 px-6 py-2">
              <Star className="w-4 h-4 mr-2" />
              Meet Our Experts
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl mb-4">
              Our Talented
              <span className="bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-600 bg-clip-text text-transparent"> Artisans</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Meet the passionate craftspeople and designers who bring decades of experience 
              to every project, ensuring your furniture receives the expert care it deserves.
            </p>
          </div>
        </GlassPanel>

        {/* Error State */}
        {error && (
          <GlassCard variant="light" intensity="medium" className="text-center py-8 bg-red-50/50 border-red-200/50">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </GlassCard>
        )}

        {/* Enhanced Team Grid - Beautiful Horizontal Layout */}
        {teamMembers.length > 0 && (
          <div className="space-y-8">
            {teamMembers.map((member, index) => (
              <TeamCard key={member.id} member={member} index={index} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!error && teamMembers.length === 0 && (
          <GlassCard variant="light" intensity="medium" className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No team members to display at this time.
            </p>
          </GlassCard>
        )}

        {/* Enhanced Call to Action */}
        {teamMembers.length > 0 && (
          <div className="text-center mt-16">
            <GlassCard 
              variant="primary" 
              intensity="strong" 
              className="inline-block p-0 overflow-hidden border-white/40 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105"
            >
              <Button asChild size="lg" className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-600 hover:from-primary-700 hover:via-primary-800 hover:to-primary-700 backdrop-blur-sm border-0 shadow-none text-white px-8 py-4 font-semibold">
                <Link href="/contact" className="flex items-center">
                  Connect with Our Team
                  <Sparkles className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </GlassCard>
          </div>
        )}
      </div>
    </section>
  );
} 