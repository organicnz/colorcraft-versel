import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusIcon } from 'lucide-react';
import ServicesTable from './_components/ServicesTable';

export const metadata = {
  title: 'Manage Services | Dashboard',
  description: 'Manage your service offerings',
};

async function getServices() {
  const supabase = createClient();
  
  const { data: services, error } = await supabase
    .from('services')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching services:', error);
    throw new Error('Failed to fetch services');
  }
  
  return services || [];
}

export default async function DashboardServicesPage() {
  let services = [];
  let error = null;
  
  try {
    services = await getServices();
  } catch (err) {
    console.error('Error in dashboard services page:', err);
    error = 'Failed to load services. Please try again.';
  }
  
  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Services</h1>
        <Button asChild>
          <Link href="/dashboard/services/new">
            <PlusIcon className="mr-2 h-4 w-4" />
            Add New Service
          </Link>
        </Button>
      </div>
      
      {error ? (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-6">
          {error}
        </div>
      ) : services.length === 0 ? (
        <div className="text-center py-12 border rounded-md bg-muted/30">
          <h2 className="text-xl font-medium mb-2">No services added yet</h2>
          <p className="text-muted-foreground mb-4">
            Add your first service to display on your website.
          </p>
          <Button asChild>
            <Link href="/dashboard/services/new">
              <PlusIcon className="mr-2 h-4 w-4" />
              Add Your First Service
            </Link>
          </Button>
        </div>
      ) : (
        <ServicesTable services={services} />
      )}
    </div>
  );
} 