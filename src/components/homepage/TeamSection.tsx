import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, ExternalLink, Linkedin, Instagram, Twitter, Facebook } from "lucide-react";
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
}

function TeamCard({ member }: TeamCardProps) {
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
  const trimmedBio = bio && bio.length > 120 ? `${bio.substring(0, 120)}...` : bio;

  return (
    <GlassCard 
      variant="light" 
      intensity="strong" 
      blur="lg"
      shadow="heavy"
      className="group transition-all duration-500 hover:scale-[1.02] hover:shadow-glass-heavy h-full border-white/30 dark:border-white/20"
    >
      <div className="flex items-center gap-6 h-full p-2">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-24 h-24 rounded-2xl overflow-hidden ring-4 ring-white/30 shadow-lg">
            {avatar_url ? (
              <Image
                src={avatar_url}
                alt={full_name}
                width={96}
                height={96}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-lg font-bold">
                {full_name.split(' ').map(n => n[0]).join('')}
              </div>
            )}
          </div>
          
          {/* Experience badge */}
          {years_experience && (
            <div className="absolute -bottom-1 -right-1">
              <Badge variant="secondary" className="bg-primary-500/90 backdrop-blur-sm text-white border-0 shadow-lg text-xs px-2 py-1">
                {years_experience}+ yrs
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="space-y-3">
            {/* Name and Position */}
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                {full_name}
              </h3>
              <p className="text-primary-600 dark:text-primary-400 font-medium text-sm">
                {position}
              </p>
            </div>

            {/* Bio */}
            {trimmedBio && (
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-2">
                {trimmedBio}
              </p>
            )}

            {/* Specialties and Contact Row */}
            <div className="flex items-center justify-between gap-4">
              {/* Specialties */}
              {specialties && specialties.length > 0 && (
                <div className="flex flex-wrap gap-1 flex-1">
                  {specialties.slice(0, 2).map((specialty) => (
                    <Badge 
                      key={specialty} 
                      variant="outline" 
                      className="text-xs bg-white/60 dark:bg-gray-800/60 border-primary-200/50 dark:border-primary-700/50 backdrop-blur-sm"
                    >
                      {specialty}
                    </Badge>
                  ))}
                  {specialties.length > 2 && (
                    <Badge variant="outline" className="text-xs bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm">
                      +{specialties.length - 2}
                    </Badge>
                  )}
                </div>
              )}

              {/* Contact and Social */}
              <div className="flex items-center gap-1 flex-shrink-0">
                {email && (
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="h-7 w-7 p-0 hover:bg-white/30 dark:hover:bg-white/20 backdrop-blur-sm"
                  >
                    <a href={`mailto:${email}`} title={`Email ${full_name}`}>
                      <Mail className="h-3.5 w-3.5" />
                    </a>
                  </Button>
                )}
                
                {phone && (
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="h-7 w-7 p-0 hover:bg-white/30 dark:hover:bg-white/20 backdrop-blur-sm"
                  >
                    <a href={`tel:${phone}`} title={`Call ${full_name}`}>
                      <Phone className="h-3.5 w-3.5" />
                    </a>
                  </Button>
                )}

                {/* Social Links */}
                {social_links && Object.entries(social_links as SocialLinks).slice(0, 2).map(([platform, url]) => {
                  if (!url) return null;
                  const IconComponent = socialIcons[platform as keyof typeof socialIcons] || ExternalLink;
                  
                  return (
                    <Button
                      key={platform}
                      variant="ghost"
                      size="sm"
                      asChild
                      className="h-7 w-7 p-0 hover:bg-white/30 dark:hover:bg-white/20 backdrop-blur-sm"
                    >
                      <a 
                        href={url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        title={`${full_name} on ${platform}`}
                      >
                        <IconComponent className="h-3.5 w-3.5" />
                      </a>
                    </Button>
                  );
                })}
              </div>
            </div>
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
    <section className="py-16 px-4 sm:px-6 lg:px-8 relative">
      {/* Background with glassmorphism effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/50 dark:from-blue-900/20 dark:via-purple-900/10 dark:to-pink-900/20" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header with enhanced glassmorphism */}
        <GlassPanel className="text-center mb-12 bg-white/40 dark:bg-white/10 backdrop-blur-xl border-white/40 dark:border-white/20">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl mb-4">
            Meet Our Expert Team
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Our passionate team of craftspeople and artists bring decades of experience 
            to every project, ensuring your furniture receives the care and attention it deserves.
          </p>
        </GlassPanel>

        {/* Error State */}
        {error && (
          <GlassCard variant="light" intensity="medium" className="text-center py-8 bg-red-50/50 border-red-200/50">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </GlassCard>
        )}

        {/* Team Grid - Horizontal Layout */}
        {teamMembers.length > 0 && (
          <div className="space-y-4">
            {teamMembers.map((member) => (
              <TeamCard key={member.id} member={member} />
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

        {/* Call to Action with glassmorphism */}
        {teamMembers.length > 0 && (
          <div className="text-center mt-12">
            <GlassCard variant="primary" intensity="medium" className="inline-block p-0 overflow-hidden">
              <Button asChild size="lg" className="bg-primary-600/90 hover:bg-primary-700/90 backdrop-blur-sm border-0 shadow-none">
                <Link href="/contact">
                  Get in Touch with Our Team
                </Link>
              </Button>
            </GlassCard>
          </div>
        )}
      </div>
    </section>
  );
} 