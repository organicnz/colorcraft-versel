import Image from "next/image";
import Link from "next/link";
import {
  Mail,
  Phone,
  ExternalLink,
  Linkedin,
  Instagram,
  Twitter,
  Facebook,
  Star,
  Sparkles,
  Users,
  Heart,
} from "lucide-react";
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
  const trimmedBio = bio && bio.length > 120 ? `${bio.substring(0, 120)}...` : bio;

  return (
    <GlassCard
      variant="light"
      intensity="strong"
      blur="lg"
      shadow="heavy"
      className="group transition-all duration-700 hover:scale-[1.02] hover:shadow-glass-heavy border-white/30 dark:border-white/20 overflow-hidden bg-white/20 dark:bg-black/20 backdrop-blur-xl"
    >
      <div className="flex items-center gap-6 h-full p-6">
        {/* Avatar Section */}
        <div className="relative flex-shrink-0">
          {/* Background glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-400/40 to-secondary-500/40 rounded-2xl blur-lg transform group-hover:scale-110 transition-transform duration-500"></div>

          <div className="relative w-28 h-28 rounded-2xl overflow-hidden ring-3 ring-white/40 dark:ring-white/30 shadow-xl transform group-hover:ring-white/60 transition-all duration-500">
            {avatar_url ? (
              <Image
                src={avatar_url}
                alt={full_name}
                width={112}
                height={112}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary-400 via-primary-500 to-primary-600 flex items-center justify-center text-white text-xl font-bold">
                {full_name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
            )}

            {/* Overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent"></div>
          </div>

          {/* Experience badge */}
          {years_experience && (
            <div className="absolute -bottom-2 -right-2">
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-lg backdrop-blur-sm px-2 py-1 text-xs transform group-hover:scale-110 transition-transform duration-300">
                <Star className="w-3 h-3 mr-1" />
                {years_experience}y
              </Badge>
            </div>
          )}

          {/* Hover sparkle effect */}
          <div className="absolute -top-1 -left-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <Sparkles className="w-5 h-5 text-primary-400 animate-pulse" />
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Name and Position */}
          <div className="space-y-1">
            <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
              {full_name}
            </h3>
            <p className="text-primary-600 dark:text-primary-400 font-semibold text-base">
              {position}
            </p>
          </div>

          {/* Bio */}
          {trimmedBio && (
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{trimmedBio}</p>
          )}

          {/* Specialties and Actions Row */}
          <div className="flex items-center justify-between gap-4">
            {/* Specialties */}
            {specialties && specialties.length > 0 && (
              <div className="flex flex-wrap gap-1 flex-1">
                {specialties.slice(0, 2).map((specialty) => (
                  <Badge
                    key={specialty}
                    variant="outline"
                    className="bg-white/60 dark:bg-gray-800/60 border-primary-200/50 dark:border-primary-700/50 backdrop-blur-sm text-xs px-2 py-1"
                  >
                    {specialty}
                  </Badge>
                ))}
                {specialties.length > 2 && (
                  <Badge
                    variant="outline"
                    className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm text-xs px-2 py-1"
                  >
                    +{specialties.length - 2}
                  </Badge>
                )}
              </div>
            )}

            {/* Contact Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {email && (
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="h-8 w-8 p-0 hover:bg-blue-500/20 backdrop-blur-sm border border-white/20 hover:border-blue-300/50 transition-all duration-300"
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
                  className="h-8 w-8 p-0 hover:bg-green-500/20 backdrop-blur-sm border border-white/20 hover:border-green-300/50 transition-all duration-300"
                >
                  <a href={`tel:${phone}`} title={`Call ${full_name}`}>
                    <Phone className="h-3.5 w-3.5" />
                  </a>
                </Button>
              )}

              {/* Social Links */}
              {social_links &&
                Object.entries(social_links as SocialLinks)
                  .slice(0, 1)
                  .map(([platform, url]) => {
                    if (!url) return null;
                    const IconComponent =
                      socialIcons[platform as keyof typeof socialIcons] || ExternalLink;

                    return (
                      <Button
                        key={platform}
                        variant="ghost"
                        size="sm"
                        asChild
                        className="h-8 w-8 p-0 hover:bg-purple-500/20 backdrop-blur-sm border border-white/20 hover:border-purple-300/50 transition-all duration-300"
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
    </GlassCard>
  );
}

export default async function TeamSection() {
  let teamMembers: TeamMember[] = [];
  let error: string | null = null;

  try {
    teamMembers = await getFeaturedTeamMembers();
  } catch (err) {
    console.error("Error loading team members:", err);
    error = "Unable to load team members at this time.";
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Multi-layer glassmorphism background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 via-purple-50/40 to-pink-50/60 dark:from-blue-900/30 dark:via-purple-900/20 dark:to-pink-900/30" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-100/30 via-transparent to-secondary-100/30 dark:from-primary-900/20 dark:via-transparent dark:to-secondary-900/20" />
      <div className="absolute inset-0 backdrop-blur-[2px]" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header with Enhanced Glassmorphism */}
        <GlassPanel className="text-center mb-16 bg-white/40 dark:bg-white/10 backdrop-blur-2xl border-white/60 dark:border-white/30 shadow-2xl">
          <div className="space-y-6 p-8">
            <Badge className="bg-gradient-to-r from-primary-500/30 to-secondary-500/30 border-primary-300/60 text-primary-800 dark:text-primary-200 px-6 py-2 backdrop-blur-sm">
              <Users className="w-4 h-4 mr-2" />
              Our Expert Team
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl">
              Meet Our
              <span className="bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-600 bg-clip-text text-transparent">
                {" "}
                Craftspeople
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Our passionate team of artisans and designers bring decades of experience to transform
              your furniture with expert care and creative vision.
            </p>
          </div>
        </GlassPanel>

        {/* Error State */}
        {error && (
          <GlassCard
            variant="light"
            intensity="medium"
            className="text-center py-8 bg-red-50/50 border-red-200/50"
          >
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </GlassCard>
        )}

        {/* Beautiful Horizontal Team Cards */}
        {teamMembers.length > 0 && (
          <div className="space-y-6">
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

        {/* Call to Action with Glassmorphism */}
        {teamMembers.length > 0 && (
          <div className="text-center mt-16">
            <GlassCard
              variant="primary"
              intensity="strong"
              className="inline-block p-0 overflow-hidden border-white/50 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 bg-primary-500/20 backdrop-blur-xl"
            >
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-8 py-4 font-semibold border-0 shadow-none"
              >
                <Link href="/contact" className="flex items-center">
                  <Heart className="mr-2 w-5 h-5" />
                  Work with Our Team
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
