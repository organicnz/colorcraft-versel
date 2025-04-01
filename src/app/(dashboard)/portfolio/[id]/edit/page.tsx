import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import PortfolioForm from '../../_components/PortfolioForm';
import { createClient } from '@/lib/supabase/server';

export const metadata = {
  title: 'Edit Project | Dashboard',
  description: 'Edit an existing portfolio project',
};

interface EditProjectPageProps {
  params: {
    id: string;
  };
}

async function getProject(id: string) {
  const supabase = createClient();
  
  const { data: project, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching project:', error);
    return null;
  }
  
  return project;
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const project = await getProject(params.id);
  
  if (!project) {
    notFound();
  }
  
  return (
    <div className="container py-6">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/portfolio">
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