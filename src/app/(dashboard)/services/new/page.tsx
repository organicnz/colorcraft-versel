import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import ServiceForm from '../_components/ServiceForm';

export const metadata = {
  title: 'Add New Service | Dashboard',
  description: 'Add a new service to your offerings',
};

export default function NewServicePage() {
  return (
    <div className="container py-6">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/services">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Add New Service</h1>
      </div>
      
      <div className="max-w-3xl mx-auto">
        <ServiceForm />
      </div>
    </div>
  );
} 