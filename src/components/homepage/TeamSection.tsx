import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, ExternalLink, Linkedin, Instagram, Twitter, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
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
  const trimmedBio = bio && bio.length > 100 ? `${bio.substring(0, 100)}...` : bio;

  return (
    <GlassCard 
      variant="light" 
      intensity="medium" 
      className="group transition-all duration-300 hover:scale-[1.02] hover:shadow-glass-heavy h-full"
    >
      <div className="flex flex-col items-center text-center space-y-4 h-full">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-white/20 shadow-lg">
            {avatar_url ? (
              <Image
                src={avatar_url}
                alt={full_name}
                width={128}
                height={128}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-2xl font-bold">
                {full_name.split(' ').map(n => n[0]).join('')}
              </div>
            )}
          </div>
          
          {/* Experience badge */}
          {years_experience && (
            <div className="absolute -bottom-2 -right-2">
              <Badge variant="secondary" className="bg-primary-500/90 text-white border-0 shadow-lg">
                {years_experience}+ years
              </Badge>
            </div>
          )}
        </div>

        {/* Name and Position */}
        <div className="space-y-1 flex-shrink-0">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {full_name}
          </h3>
          <p className="text-primary-600 dark:text-primary-400 font-medium">
            {position}
          </p>
        </div>

        {/* Bio - Fixed height container */}
        <div className="flex-grow flex items-start justify-center">
          {trimmedBio && (
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed text-center max-w-full h-16 overflow-hidden">
              {trimmedBio}
            </p>
          )}
        </div>

        {/* Specialties */}
        {specialties && specialties.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center flex-shrink-0">
            {specialties.slice(0, 2).map((specialty) => (
              <Badge 
                key={specialty} 
                variant="outline" 
                className="text-xs bg-white/50 dark:bg-gray-800/50 border-primary-200 dark:border-primary-700"
              >
                {specialty}
              </Badge>
            ))}
            {specialties.length > 2 && (
              <Badge variant="outline" className="text-xs bg-white/50 dark:bg-gray-800/50">
                +{specialties.length - 2} more
              </Badge>
            )}
          </div>
        )}

        {/* Contact and Social */}
        <div className="flex items-center gap-2 pt-2 flex-shrink-0">
          {email && (
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="h-8 w-8 p-0 hover:bg-white/20 dark:hover:bg-white/10"
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
              className="h-8 w-8 p-0 hover:bg-white/20 dark:hover:bg-white/10"
            >
              <a href={`tel:${phone}`} title={`Call ${full_name}`}>
                <Phone className="h-4 w-4" />
              </a>
            </Button>
          )}

          {/* Social Links */}
          {social_links && Object.entries(social_links as SocialLinks).map(([platform, url]) => {
            if (!url) return null;
            const IconComponent = socialIcons[platform as keyof typeof socialIcons] || ExternalLink;
            
            return (
              <Button
                key={platform}
                variant="ghost"
                size="sm"
                asChild
                className="h-8 w-8 p-0 hover:bg-white/20 dark:hover:bg-white/10"
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
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl mb-4">
            Meet Our Expert Team
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Our passionate team of craftspeople and artists bring decades of experience 
            to every project, ensuring your furniture receives the care and attention it deserves.
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="text-center py-8">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Team Grid */}
        {teamMembers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <TeamCard key={member.id} member={member} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!error && teamMembers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No team members to display at this time.
            </p>
          </div>
        )}

        {/* Call to Action */}
        {teamMembers.length > 0 && (
          <div className="text-center mt-12">
            <Button asChild size="lg" className="bg-primary-600 hover:bg-primary-700">
              <Link href="/contact">
                Get in Touch with Our Team
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
} 