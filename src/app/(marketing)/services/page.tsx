import { createPublicClient } from "@/utils/supabase/public";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Services | Color & Craft",
  description: "View our furniture painting and restoration services",
};

export default async function ServicesPage() {
  let servicesList = [];
  let error = null;
  
  try {
    const supabase = createPublicClient();
    
    // Fetch services with error handling
    const response = await supabase
      .from("services")
      .select("*")
      .order("name");
    
    if (response.error) {
      error = response.error;
      console.error("Error fetching services:", error);
    } else {
      servicesList = response.data || [];
    }
  } catch (err) {
    console.error("Failed to fetch services:", err);
    error = err;
  }
  
  return (
    <main className="container py-12 md:py-20">
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Professional furniture painting and restoration services to transform your space.
        </p>
      </section>
      
      <section className="grid gap-8 md:gap-12">
        {servicesList.length === 0 && !error && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No services available at the moment.</p>
          </div>
        )}
        
        {error && (
          <div className="text-center py-12 bg-muted/30 rounded-lg p-8">
            <h3 className="text-xl font-medium mb-2">Temporarily Unavailable</h3>
            <p className="text-muted-foreground mb-4">
              We're currently updating our services information. Please check back soon or contact us directly.
            </p>
            <Button asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        )}
        
        {servicesList.map((service) => (
          <Card key={service.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2 gap-6">
                {service.image_url && (
                  <div className="relative aspect-video md:aspect-square">
                    <Image
                      src={service.image_url}
                      alt={service.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                )}
                <div className="p-6 flex flex-col justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{service.name}</h2>
                    <p className="text-muted-foreground mb-4">{service.brief_description}</p>
                    <div className="prose max-w-none">
                      <p>{service.description}</p>
                    </div>
                  </div>
                  {service.price_range && (
                    <div className="mt-6">
                      <p className="text-lg font-medium text-primary">{service.price_range}</p>
                    </div>
                  )}
                  <div className="mt-4">
                    <Button asChild className="w-full sm:w-auto">
                      <Link href="/contact">Request a Quote</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
      
      <section className="mt-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Need a Custom Service?</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
          Don't see what you're looking for? We offer custom solutions for your unique furniture pieces.
        </p>
        <Button asChild size="lg">
          <Link href="/contact">Contact Us</Link>
        </Button>
      </section>
    </main>
  );
} 