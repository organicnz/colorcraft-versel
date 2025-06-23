import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Palette, Wrench, Recycle, Eye, Crown } from "lucide-react";

export const metadata: Metadata = {
  title: "Our Services | ColorCraft - Professional Furniture Painting & Restoration",
  description: "Discover our comprehensive furniture transformation services including custom painting, restoration, upcycling, color consultation, and antique revival. Transform your furniture with expert craftsmanship.",
  keywords: "furniture painting, restoration, upcycling, custom painting, color consultation, antique revival, furniture transformation",
  openGraph: {
    title: "Our Services | ColorCraft",
    description: "Professional furniture transformation services with expert craftsmanship",
    images: ["/images/og-services.jpg"],
  },
};

// Service icons mapping
const serviceIcons = {
  "custom-painting": Palette,
  "restoration": Wrench,
  "upcycling": Recycle,
  "consultation": Eye,
  "antique": Crown,
};

// Default services if none exist in database
const defaultServices = [
  {
    id: "custom-painting",
    name: "Custom Painting",
    brief_description: "Transform your furniture with custom paint finishes, from chalk paint to modern lacquers.",
    description: "Our custom painting service brings new life to your furniture pieces. We specialize in various techniques including chalk paint, milk paint, spray finishes, and decorative techniques. Whether you want a vintage distressed look or a sleek modern finish, our skilled artisans will create the perfect custom solution for your space.",
    price_range: "$150 - $800",
    is_active: true,
  },
  {
    id: "restoration",
    name: "Furniture Restoration",
    brief_description: "Professional restoration of antique and vintage furniture to preserve their original beauty.",
    description: "Our furniture restoration service carefully preserves the integrity and character of your cherished pieces. We handle everything from structural repairs to wood refinishing, ensuring your antique and vintage furniture maintains its value while being functional for modern use. Each piece receives individual attention and expert craftsmanship.",
    price_range: "$200 - $1,500",
    is_active: true,
  },
  {
    id: "upcycling",
    name: "Creative Upcycling",
    brief_description: "Give old furniture new purpose with creative upcycling and repurposing solutions.",
    description: "Turn forgotten furniture into stunning statement pieces with our creative upcycling services. We transform outdated or damaged furniture into functional art that fits your modern lifestyle. From converting old dressers into bathroom vanities to turning vintage suitcases into unique storage solutions.",
    price_range: "$100 - $600",
    is_active: true,
  },
  {
    id: "consultation",
    name: "Color Consultation",
    brief_description: "Expert color advice and design consultation for your furniture transformation projects.",
    description: "Not sure which colors or finishes will work best? Our color consultation service provides expert guidance on paint colors, finishes, and design approaches that will complement your space. We consider lighting, existing decor, and your personal style to recommend the perfect transformation approach.",
    price_range: "$75 - $200",
    is_active: true,
  },
  {
    id: "antique",
    name: "Antique Revival",
    brief_description: "Specialized restoration and revival of antique furniture with period-appropriate techniques.",
    description: "Our antique revival service specializes in bringing historic furniture back to its former glory. Using traditional techniques and period-appropriate materials, we carefully restore antique pieces while preserving their historical significance and value. Perfect for family heirlooms and valuable antique collections.",
    price_range: "$300 - $2,000",
    is_active: true,
  },
];

export default async function ServicesPage() {
  const supabase = await createClient();
  
  // Try to fetch services from database
  const { data: dbServices } = await supabase
    .from("services")
    .select("*")
    .eq("is_active", true)
    .order("name");
  
  // Use database services if available, otherwise use defaults
  const services = dbServices && dbServices.length > 0 ? dbServices : defaultServices;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-800 dark:text-white mb-6">
            Our <span className="text-primary">Services</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
            Transform your furniture with our comprehensive range of professional painting, restoration, and design services. Expert craftsmanship meets artistic vision.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => {
              const IconComponent = serviceIcons[service.id as keyof typeof serviceIcons] || Palette;
              const serviceSlug = service.id || service.name.toLowerCase().replace(/\s+/g, '-');
              
              return (
                <Card key={service.id || service.name} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-dark p-3 group-hover:scale-110 transition-transform duration-300">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl font-bold text-slate-800 dark:text-white">
                          {service.name}
                        </CardTitle>
                        {service.price_range && (
                          <Badge variant="secondary" className="mt-1">
                            {service.price_range}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                      {service.brief_description}
                    </CardDescription>
                    <Button asChild className="w-full group-hover:bg-primary-dark transition-colors">
                      <Link href={`/services/${serviceSlug}`} className="flex items-center justify-center gap-2">
                        Learn More
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="py-16 px-4 bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-8">
            Our Process
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold mx-auto">
                1
              </div>
              <h3 className="text-xl font-semibold text-slate-800 dark:text-white">Consultation</h3>
              <p className="text-slate-600 dark:text-slate-300">
                We discuss your vision, assess your furniture, and provide expert recommendations.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold mx-auto">
                2
              </div>
              <h3 className="text-xl font-semibold text-slate-800 dark:text-white">Transformation</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Our skilled artisans carefully transform your piece using premium materials and techniques.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold mx-auto">
                3
              </div>
              <h3 className="text-xl font-semibold text-slate-800 dark:text-white">Delivery</h3>
              <p className="text-slate-600 dark:text-slate-300">
                We deliver your beautifully transformed furniture, ready to enhance your space.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 text-center">
        <div className="container mx-auto max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-6">
            Ready to Transform Your Furniture?
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
            Contact us today for a free consultation and let's bring your vision to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/contact">Get Free Quote</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/portfolio">View Our Work</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
} 