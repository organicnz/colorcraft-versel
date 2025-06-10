import React from 'react';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, BarChart3, FolderOpen, Archive, Eye, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { getPortfolioProjects } from '@/services/portfolio.service';
import { auth } from '@/lib/supabase/server';
import { createClient } from '@/lib/supabase/server';
import PortfolioManagementClient from './PortfolioManagementClient';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

export default async function PortfolioManagementPage() {
  // Get current user authentication and role
  const { data: { session } } = await auth();
  
  if (!session) {
    redirect('/login');
  }

  // Check user role
  const supabase = await createClient();
  const { data: userProfile } = await supabase
    .from('users')
    .select('role')
    .eq('id', session.user.id)
    .single();

  const isAdmin = userProfile?.role === 'admin';

  // Fetch all projects for admin, only published for non-admin
  const allProjects = await getPortfolioProjects({
    featuredOnly: false,
    useAdmin: isAdmin, // Use admin access if user is admin
    orderBy: [
      { column: 'created_at', ascending: false }
    ]
  });

  // Filter projects based on user role
  const visibleProjects = isAdmin 
    ? allProjects 
    : allProjects.filter(project => project.status === 'published');

  // Calculate statistics (admin only)
  const stats = isAdmin ? {
    total: allProjects.length,
    published: allProjects.filter(p => p.status === 'published').length,
    drafts: allProjects.filter(p => p.status === 'draft').length,
    archived: allProjects.filter(p => p.status === 'archived').length,
  } : {
    total: visibleProjects.length,
    published: visibleProjects.length,
    drafts: 0,
    archived: 0,
  };

  return (
    <div className="container py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              {isAdmin ? 'Portfolio Management' : 'Portfolio Gallery'}
            </h1>
            <p className="text-muted-foreground mt-2">
              {isAdmin 
                ? 'Manage your portfolio projects with status tracking and organization'
                : 'Browse our beautiful furniture restoration portfolio'
              }
            </p>
          </div>
          
          {isAdmin && (
            <Button asChild className="bg-[#3ECF8E] hover:bg-[#38BC81] text-white border border-[#3ECF8E]/30 transition-all duration-300 hover:shadow-lg">
              <Link href="/admin/portfolio/new">
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Statistics Cards (Admin Only) */}
      {isAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card glass={true} glassVariant="light" glassIntensity="medium">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card glass={true} glassVariant="light" glassIntensity="medium">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Published</CardTitle>
              <Eye className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.published}</div>
            </CardContent>
          </Card>

          <Card glass={true} glassVariant="light" glassIntensity="medium">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Drafts</CardTitle>
              <Pencil className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.drafts}</div>
            </CardContent>
          </Card>

          <Card glass={true} glassVariant="light" glassIntensity="medium">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Archived</CardTitle>
              <Archive className="h-4 w-4 text-slate-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-600">{stats.archived}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Projects List */}
      <PortfolioManagementClient 
        projects={visibleProjects}
        isAdmin={isAdmin}
        stats={stats}
      />
    </div>
  );
} 