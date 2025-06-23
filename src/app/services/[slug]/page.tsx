import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft, Phone, Mail, CheckCircle } from "lucide-react";

// Service data mapping
const serviceData = {
  "custom-painting": {
    id: "custom-painting",
    name: "Custom Painting",
    brief_description: "Transform your furniture with custom paint finishes, from chalk paint to modern lacquers.",
    description: "Our custom painting service brings new life to your furniture pieces. We specialize in various techniques including chalk paint, milk paint, spray finishes, and decorative techniques. Whether you want a vintage distressed look or a sleek modern finish, our skilled artisans will create the perfect custom solution for your space.",
    price_range: "$150 - $800",
    features: [
      "Chalk paint finishes",
      "Milk paint techniques",
      "Spray lacquer finishes",
      "Distressed and aged looks",
      "Color matching services",
      "Custom stenciling",
      "Protective topcoats",
      "Color consultation included"
    ],
    process: [
      "Initial consultation and color selection",
      "Surface preparation and cleaning",
      "Primer application if needed",
      "Paint application using chosen technique",
      "Decorative details and finishing",
      "Protective coating application",
      "Quality inspection and touch-ups",
      "Final delivery and setup"
    ],
    timeline: "3-7 business days",
    is_active: true,
  },
  "restoration": {
    id: "restoration",
    name: "Furniture Restoration",
    brief_description: "Professional restoration of antique and vintage furniture to preserve their original beauty.",
    description: "Our furniture restoration service carefully preserves the integrity and character of your cherished pieces. We handle everything from structural repairs to wood refinishing, ensuring your antique and vintage furniture maintains its value while being functional for modern use. Each piece receives individual attention and expert craftsmanship.",
    price_range: "$200 - $1,500",
    features: [
      "Structural repairs",
      "Wood refinishing",
      "Hardware restoration",
      "Veneer repair",
      "French polishing",
      "Stain matching",
      "Joint reinforcement",
      "Historical accuracy maintained"
    ],
    process: [
      "Detailed assessment and documentation",
      "Disassembly if required",
      "Cleaning and stripping",
      "Structural repairs",
      "Wood treatment and conditioning",
      "Staining and finishing",
      "Hardware restoration or replacement",
      "Final assembly and inspection"
    ],
    timeline: "1-3 weeks",
    is_active: true,
  },
  "upcycling": {
    id: "upcycling",
    name: "Creative Upcycling",
    brief_description: "Give old furniture new purpose with creative upcycling and repurposing solutions.",
    description: "Turn forgotten furniture into stunning statement pieces with our creative upcycling services. We transform outdated or damaged furniture into functional art that fits your modern lifestyle. From converting old dressers into bathroom vanities to turning vintage suitcases into unique storage solutions.",
    price_range: "$100 - $600",
    features: [
      "Functional redesign",
      "Purpose conversion",
      "Modern hardware upgrades",
      "Creative storage solutions",
      "Mixed material integration",
      "Custom modifications",
      "Eco-friendly approach",
      "Unique design concepts"
    ],
    process: [
      "Creative consultation and design",
      "Feasibility assessment",
      "Design sketches and planning",
      "Structural modifications",
      "Material selection and sourcing",
      "Assembly and construction",
      "Finishing and detailing",
      "Function testing and delivery"
    ],
    timeline: "1-2 weeks",
    is_active: true,
  },
  "consultation": {
    id: "consultation",
    name: "Color Consultation",
    brief_description: "Expert color advice and design consultation for your furniture transformation projects.",
    description: "Not sure which colors or finishes will work best? Our color consultation service provides expert guidance on paint colors, finishes, and design approaches that will complement your space. We consider lighting, existing decor, and your personal style to recommend the perfect transformation approach.",
    price_range: "$75 - $200",
    features: [
      "Color psychology guidance",
      "Lighting consideration",
      "Style assessment",
      "Finish recommendations",
      "Sample preparations",
      "Design mockups",
      "Trend insights",
      "Follow-up support"
    ],
    process: [
      "Initial style and space assessment",
      "Color preference discussion",
      "Lighting and environment analysis",
      "Color palette development",
      "Sample preparation",
      "Presentation and explanation",
      "Final recommendations",
      "Implementation guidance"
    ],
    timeline: "1-3 days",
    is_active: true,
  },
  "antique": {
    id: "antique",
    name: "Antique Revival",
    brief_description: "Specialized restoration and revival of antique furniture with period-appropriate techniques.",
    description: "Our antique revival service specializes in bringing historic furniture back to its former glory. Using traditional techniques and period-appropriate materials, we carefully restore antique pieces while preserving their historical significance and value. Perfect for family heirlooms and valuable antique collections.",
    price_range: "$300 - $2,000",
    features: [
      "Period-appropriate techniques",
      "Historical research",
      "Traditional materials",
      "Value preservation",
      "Authentication support",
      "Detailed documentation",
      "Museum-quality work",
      "Conservation ethics"
    ],
    process: [
      "Historical research and authentication",
      "Condition assessment and documentation",
      "Conservation planning",
      "Careful cleaning and preparation",
      "Traditional restoration techniques",
      "Period-appropriate finishing",
      "Quality control and testing",
      "Documentation and certification"
    ],
    timeline: "2-6 weeks",
    is_active: true,
  },
};

type ServicePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = serviceData[slug as keyof typeof serviceData];
  
  if (!service) {
    return {
      title: "Service Not Found | ColorCraft",
    };
  }

  return {
    title: `${service.name} | ColorCraft - Professional Furniture Services`,
    description: service.description,
    keywords: `${service.name.toLowerCase()}, furniture ${service.name.toLowerCase()}, ${service.brief_description}`,
    openGraph: {
      title: `${service.name} | ColorCraft`,
      description: service.brief_description,
      images: [`/images/services/${slug}.jpg`],
    },
  };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const supabase = await createClient();
  
  // Try to get service from database first
  const { data: dbService } = await supabase
    .from("services")
    .select("*")
    .eq("id", slug)
    .eq("is_active", true)
    .single();
  
  // Fall back to static service data
  const service = dbService || serviceData[slug as keyof typeof serviceData];
  
  if (!service) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Header */}
      <section className="py-8 px-4 border-b border-slate-200 dark:border-slate-700">
        <div className="container mx-auto max-w-4xl">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/services" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Services
            </Link>
          </Button>
        </div>
      </section>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-white mb-4">
              {service.name}
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-6 max-w-2xl mx-auto">
              {service.brief_description}
            </p>
            {service.price_range && (
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {service.price_range}
              </Badge>
            )}
          </div>
        </div>
      </section>

      {/* Service Details */}
      <section className="py-16 px-4 bg-white/50 dark:bg-slate-800/50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Description */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
                  About This Service
                </h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {service.description}
                </p>
              </div>

              {/* Features */}
              <div>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">
                  What's Included
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {service.features?.map((feature: string, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-slate-600 dark:text-slate-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Process & Timeline */}
            <div className="space-y-8">
              {/* Timeline */}
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">
                  Timeline
                </h3>
                <p className="text-2xl font-bold text-primary mb-2">
                  {service.timeline}
                </p>
                <p className="text-slate-600 dark:text-slate-300 text-sm">
                  Typical completion time for most projects
                </p>
              </div>

              {/* Process */}
              <div>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">
                  Our Process
                </h3>
                <div className="space-y-3">
                  {service.process?.map((step: string, index: number) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <span className="text-slate-600 dark:text-slate-300">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
            Contact us today for a free consultation and quote for your {service.name.toLowerCase()} project.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/contact" className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Get Free Quote
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="tel:+17477557695" className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Call Now
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
} 