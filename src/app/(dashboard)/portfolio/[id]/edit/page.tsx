import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import PortfolioForm from '../../_components/PortfolioForm';
import { getPortfolioProject } from '@/services/portfolio.service';

export const metadata = {
  title: 'Edit Project | Dashboard',
  description: 'Edit an existing portfolio project',
};

interface EditProjectPageProps {
  params: {
    id: string;
  };
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const project = await getPortfolioProject(params.id, true); // Use admin access
  
  if (!project) {
    notFound();
  }
  
  return (
    <div className="container py-6">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/portfolio/manage">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Edit Project</h1>
      </div>
      
      <div className="max-w-3xl mx-auto">
        <PortfolioForm project={project} />
      </div>
    </div>
  );
} 