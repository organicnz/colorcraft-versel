import { createPublicClient } from "@/utils/supabase/public";
import { Metadata } from "next";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Services | Color & Craft",
  description: "Explore our furniture painting and restoration services",
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
      .order("title");
    
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
          <div key={service.id} className="grid md:grid-cols-2 gap-8 items-center p-6 border rounded-lg hover:shadow-md transition-shadow">
            <div className="order-2 md:order-1">
              <h2 className="text-2xl font-bold mb-3">{service.title}</h2>
              <p className="text-muted-foreground mb-4">{service.description}</p>
              
              {service.price > 0 && (
                <p className="font-medium mb-4">
                  Price: <span className="text-primary">${service.price.toFixed(2)}</span>
                </p>
              )}
              
              <Button asChild>
                <Link href={`/contact?service=${encodeURIComponent(service.title)}`}>
                  Request a Quote
                </Link>
              </Button>
            </div>
            
            <div className="order-1 md:order-2">
              {service.image_url ? (
                <Image
                  src={service.image_url}
                  alt={service.title}
                  width={600}
                  height={400}
                  className="rounded-lg object-cover w-full h-[300px]"
                />
              ) : (
                <div className="bg-muted rounded-lg w-full h-[300px] flex items-center justify-center">
                  <p className="text-muted-foreground">Image coming soon</p>
                </div>
              )}
            </div>
          </div>
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