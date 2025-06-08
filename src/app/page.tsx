import Link from 'next/link'
import Image from 'next/image'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GlassPanel, GlassCard } from "@/components/ui/glass-card";
import { ArrowRight, Award, Palette, Send, Settings, Sparkles } from "lucide-react";
import { getPortfolioProjects } from "@/services/portfolio.service";
import ClientHomePage from "./client-home-page";

// Force dynamic rendering for each request to enable randomization
export const dynamic = 'force-dynamic';

const services = [
  {
    icon: "Palette",
    title: "Custom Painting",
    description: "Transform your furniture with our expert painting techniques and premium finishes.",
    features: ["Chalk Paint", "Milk Paint", "Custom Colors", "Distressing"]
  },
  {
    icon: "Settings",
    title: "Restoration",
    description: "Bring antique and vintage pieces back to their former glory with careful restoration.",
    features: ["Wood Repair", "Hardware Restoration", "Period-Accurate Finishes", "Structural Repairs"]
  },
  {
    icon: "Sparkles",
    title: "Upcycling",
    description: "Give new life to old furniture with creative upcycling and modern design touches.",
    features: ["Design Consultation", "Modern Updates", "Eco-Friendly Materials", "Custom Hardware"]
  }
];

const testimonials = [
  {
    name: "Sarah Johnson",
    text: "Color & Craft transformed my grandmother's old dresser into a stunning centerpiece. The attention to detail is incredible!",
    rating: 5,
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150"
  },
  {
    name: "Michael Chen",
    text: "Professional service and amazing results. They turned our dated dining set into something we absolutely love.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
  },
  {
    name: "Emily Rodriguez",
    text: "The team's creativity and skill exceeded our expectations. Highly recommend for any furniture restoration project.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150"
  }
];

const properties = [
  {
    title: "Vintage Armoire Restoration",
    type: "Antique",
    location: "Victorian Era",
    price: "$850",
    return: "Heirloom Quality",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800"
  },
  {
    title: "Modern Bookshelf Design",
    type: "Contemporary",
    location: "Custom Built",
    price: "$420",
    return: "Lifetime Warranty",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800"
  },
  {
    title: "Rustic Coffee Table",
    type: "Farmhouse",
    location: "Reclaimed Wood",
    price: "$380",
    return: "Eco-Friendly",
    image: "https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=800"
  }
];

export default async function Home() {
  // Fetch featured projects from the database
  let featuredProjects = [];

  try {
    featuredProjects = await getPortfolioProjects({
      featuredOnly: true,
      useAdmin: true, // Use admin client to bypass RLS for public portfolio display
      orderBy: [
        { column: 'completion_date', ascending: false }
      ]
    });
  } catch (error) {
    console.error('Failed to fetch featured projects:', error);
    // Use fallback data if database fetch fails
  }

  // Transform all featured projects to send to client for randomization
  const transformedProjects = featuredProjects.map((project) => ({
    id: project.id,
    title: project.title,
    description: project.brief_description || project.description,
    material: project.materials?.join(', ') || 'Custom finish',
    image: project.after_images?.[0] || "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800",
    price: "Contact for pricing",
  }));

  // If no featured projects, use fallback data
  const projectsToShow = transformedProjects.length > 0 ? transformedProjects : [
    {
      id: "sample-1",
      title: "Victorian Dresser Revival",
      description: "Antique restoration with modern flair",
      material: "Oak with chalk paint finish",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800",
      price: "Contact for pricing",
    },
    {
      id: "sample-2",
      title: "Modern Coffee Table",
      description: "Contemporary geometric design",
      material: "Reclaimed wood and steel",
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800",
      price: "Contact for pricing",
    },
    {
      id: "sample-3",
      title: "Vintage Chair Makeover",
      description: "Classic comfort meets bold color",
      material: "Upholstered with premium fabric",
      image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800",
      price: "Contact for pricing",
    },
  ];

  return (
    <ClientHomePage
      featuredProjects={projectsToShow}
      services={services}
      testimonials={testimonials}
      properties={[]} // Not using hardcoded properties anymore
    />
  );
}
