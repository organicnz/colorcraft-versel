import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { getServiceById } from "@/actions/servicesActions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Service Details | ColorCraft Dashboard",
  description: "View service details",
};

export const dynamic = "force-dynamic";

type ServicePageProps = {
  params: Promise<{ id: string }>;
};

export default async function ServicePage({ params }: ServicePageProps) {
  // Await params since they're now a Promise in Next.js 15
  const { id } = await params;
  const supabase = await createClient();

  // Get current session (middleware already checks auth, but we need user info)
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/auth/signin");
  }

  // Fetch the service data
  const { data: service, error } = await getServiceById(id);

  if (error || !service) {
    return (
      <div className="container py-10">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error || "Service not found"}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <Card>
        <CardHeader>
          <CardTitle>{service.title}</CardTitle>
          <CardDescription>Service Details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Description</h3>
              <p className="text-muted-foreground">{service.description}</p>
            </div>
            {service.price && (
              <div>
                <h3 className="font-medium">Price</h3>
                <p className="text-muted-foreground">${service.price}</p>
              </div>
            )}
            <div className="flex gap-4">
              <Button asChild>
                <Link href={`/dashboard/services-management/${id}/edit`}>Edit Service</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/dashboard/services-management">Back to Services</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
