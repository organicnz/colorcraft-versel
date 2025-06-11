"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import {
  MapPin,
  Phone,
  Clock,
  Navigation,
  Star,
  Camera,
  Palette,
  Award,
  ExternalLink,
} from "lucide-react";
import { motion } from "framer-motion";

const STUDIO_ADDRESS = {
  street: "123 Artisan Lane",
  city: "Creative District",
  state: "CD",
  zip: "12345",
  phone: "(555) 123-CRAFT",
  email: "hello@colorcraft.studio",
};

const HOURS = [
  { day: "Monday - Friday", hours: "9:00 AM - 6:00 PM" },
  { day: "Saturday", hours: "10:00 AM - 4:00 PM" },
  { day: "Sunday", hours: "Closed" },
];

const FEATURES = [
  {
    icon: <Palette className="w-5 h-5" />,
    title: "Color Consultation",
    description: "Expert color matching and design advice",
  },
  {
    icon: <Camera className="w-5 h-5" />,
    title: "Project Gallery",
    description: "See before & after transformations",
  },
  {
    icon: <Award className="w-5 h-5" />,
    title: "Expert Craftsmen",
    description: "15+ years of furniture restoration experience",
  },
];

interface StudioLocationProps {
  className?: string;
  showContactForm?: boolean;
}

export default function StudioLocation({ className = "", showContactForm = false }: StudioLocationProps) {
  const getDirections = () => {
    const address = encodeURIComponent(
      `${STUDIO_ADDRESS.street}, ${STUDIO_ADDRESS.city}, ${STUDIO_ADDRESS.state} ${STUDIO_ADDRESS.zip}`
    );
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${address}`, "_blank");
  };

  return (
    <section className={`py-16 bg-gradient-to-br from-slate-50 via-amber-50/30 to-orange-50/40 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 ${className}`}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
            <MapPin className="w-4 h-4 mr-2" />
            Visit Our Studio
          </Badge>
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Come See Us in Person
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Experience our craftsmanship firsthand. Visit our creative studio where furniture transformations come to life.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Map Placeholder / Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <GlassCard className="overflow-hidden">
              <div className="relative h-96 w-full bg-gradient-to-br from-primary-100 to-amber-100 dark:from-primary-900/20 dark:to-amber-900/20 flex items-center justify-center">
                {/* Placeholder for map - can be replaced with actual MapBox later */}
                <div className="text-center">
                  <div className="w-24 h-24 bg-primary-200 dark:bg-primary-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-12 h-12 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    ColorCraft Studio
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                    {STUDIO_ADDRESS.street}<br />
                    {STUDIO_ADDRESS.city}, {STUDIO_ADDRESS.state} {STUDIO_ADDRESS.zip}
                  </p>
                  <Button
                    onClick={getDirections}
                    className="bg-primary-600 hover:bg-primary-700 text-white"
                    size="sm"
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    Get Directions
                  </Button>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Studio Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            {/* Address & Contact */}
            <GlassCard>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" />
                  Studio Address
                </h3>
                <div className="space-y-2 text-slate-600 dark:text-slate-300">
                  <p className="font-medium">{STUDIO_ADDRESS.street}</p>
                  <p>{STUDIO_ADDRESS.city}, {STUDIO_ADDRESS.state} {STUDIO_ADDRESS.zip}</p>
                  <div className="pt-2 space-y-1">
                    <p className="flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-primary-600 dark:text-primary-400" />
                      {STUDIO_ADDRESS.phone}
                    </p>
                    <p className="flex items-center">
                      <ExternalLink className="w-4 h-4 mr-2 text-primary-600 dark:text-primary-400" />
                      {STUDIO_ADDRESS.email}
                    </p>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Hours */}
            <GlassCard>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" />
                  Studio Hours
                </h3>
                <div className="space-y-2">
                  {HOURS.map((schedule, index) => (
                    <div key={index} className="flex justify-between text-slate-600 dark:text-slate-300">
                      <span>{schedule.day}</span>
                      <span className="font-medium">{schedule.hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>

            {/* Features */}
            <GlassCard>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                  <Star className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" />
                  What You&apos;ll Find
                </h3>
                <div className="space-y-4">
                  {FEATURES.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center text-primary-600 dark:text-primary-400">
                        {feature.icon}
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-900 dark:text-white">{feature.title}</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-300">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>

            {/* Call to Action */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={getDirections}
                className="flex-1 bg-primary-600 hover:bg-primary-700 text-white"
              >
                <Navigation className="w-4 h-4 mr-2" />
                Get Directions
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-primary-200 text-primary-700 hover:bg-primary-50 dark:border-primary-800 dark:text-primary-300 dark:hover:bg-primary-900/20"
                onClick={() => {
                  window.location.href = '/contact';
                }}
              >
                <Phone className="w-4 h-4 mr-2" />
                Schedule Visit
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Contact Form Section (optional) */}
        {showContactForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-16"
          >
            <GlassCard className="max-w-2xl mx-auto">
              <div className="p-8 text-center">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                  Schedule Your Visit
                </h3>
                <p className="text-slate-600 dark:text-slate-300 mb-6">
                  Let us know when you&apos;d like to visit and we&apos;ll have everything ready for your consultation.
                </p>
                <Button
                  size="lg"
                  className="bg-primary-600 hover:bg-primary-700 text-white"
                  onClick={() => {
                    window.location.href = '/contact';
                  }}
                >
                  Book Your Visit
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </div>
    </section>
  );
} 