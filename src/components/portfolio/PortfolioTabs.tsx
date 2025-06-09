"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PortfolioItem from "./PortfolioItem";
import { fetchPortfolioProjects } from "@/actions/portfolioActions";
import { 
  Loader2, 
  Archive, 
  Eye, 
  EyeOff,
  FolderOpen,
  Trash2,
  Plus
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type PortfolioProject = {
  id: string;
  title: string;
  description?: string;
  brief_description: string;
  before_images: string[];
  after_images: string[];
  techniques?: string[];
  materials?: string[];
  completion_date?: string;
  client_name?: string;
  client_testimonial?: string;
  is_featured: boolean;
  status: 'published' | 'draft' | 'archived';
  created_by?: string;
  updated_by?: string;
  created_at: string;
  updated_at: string;
  created_by_user?: { full_name?: string; email: string };
  updated_by_user?: { full_name?: string; email: string };
};

export default function PortfolioTabs() {
  const [activeProjects, setActiveProjects] = useState<PortfolioProject[]>([]);
  const [archivedProjects, setArchivedProjects] = useState<PortfolioProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("active");

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      // Fetch active projects (published + drafts)
      const activeResult = await fetchPortfolioProjects('active');
      if (activeResult.success && activeResult.data) {
        setActiveProjects(activeResult.data);
      }

      // Fetch archived projects
      const archivedResult = await fetchPortfolioProjects('archived');
      if (archivedResult.success && archivedResult.data) {
        setArchivedProjects(archivedResult.data);
      }
    } catch (error) {
      console.error("Error loading projects:", error);
      toast.error("Failed to load portfolio projects");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);



  const getStatsCards = () => {
    const publishedCount = activeProjects.filter(p => p.status === 'published').length;
    const draftCount = activeProjects.filter(p => p.status === 'draft').length;
    const archivedCount = archivedProjects.length;
    const totalCount = activeProjects.length + archivedCount;

    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <FolderOpen className="h-4 w-4 text-blue-600 mr-2" />
              <span className="text-2xl font-bold">{totalCount}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Published</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Eye className="h-4 w-4 text-green-600 mr-2" />
              <span className="text-2xl font-bold text-green-600">{publishedCount}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Drafts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <EyeOff className="h-4 w-4 text-yellow-600 mr-2" />
              <span className="text-2xl font-bold text-yellow-600">{draftCount}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Archived</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Trash2 className="h-4 w-4 text-gray-600 mr-2" />
              <span className="text-2xl font-bold text-gray-600">{archivedCount}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderProjectGrid = (projects: PortfolioProject[]) => {
    if (projects.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="bg-white/70 backdrop-blur-md border border-white/30 rounded-3xl p-8 max-w-md mx-auto shadow-lg">
            <div className="mb-6">
              <div className="bg-orange-200/60 backdrop-blur-sm p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center border border-orange-300/30">
                <FolderOpen className="h-8 w-8 text-orange-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No projects found
            </h3>
            <p className="text-gray-600 mb-6">
              {activeTab === "active" ? "Create your first portfolio project to get started!" : "No archived projects yet."}
            </p>
            {activeTab === "active" && (
              <Button
                asChild
                size="lg"
                className="bg-orange-600/90 hover:bg-orange-700/90 backdrop-blur-md text-white font-semibold px-6 py-3 rounded-full shadow-lg"
              >
                <Link href="/portfolio-dash/new">
                  <Plus className="mr-2 h-5 w-5" />
                  Create First Project
                </Link>
              </Button>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="relative">
            <PortfolioItem 
              project={project} 
              showAdminControls={true}
              onUpdate={loadProjects}
            />

            {/* Creator info */}
            {project.created_by_user && (
              <div className="mt-2 text-xs text-gray-500">
                Created by: {project.created_by_user.full_name || project.created_by_user.email}
                {project.updated_by_user && project.updated_by_user.email !== project.created_by_user.email && (
                  <span> • Updated by: {project.updated_by_user.full_name || project.updated_by_user.email}</span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="container py-12">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2 text-lg">Loading portfolio...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold mb-2">Portfolio Management</h1>
            <p className="text-lg text-gray-600">
              Manage your portfolio projects with status tracking and organization
            </p>
          </div>
          <div className="mt-4 md:mt-0 text-center md:text-right">
            <Button
              asChild
              size="lg"
              className="bg-orange-600/90 hover:bg-orange-700/90 backdrop-blur-md text-white font-semibold px-6 py-3 rounded-full shadow-lg border border-orange-500/30 transition-all duration-300 hover:shadow-xl"
            >
              <Link href="/portfolio-dash/new">
                <Plus className="mr-2 h-5 w-5" />
                Create New Project
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {getStatsCards()}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="active" className="flex items-center gap-2">
            <FolderOpen className="h-4 w-4" />
            Active ({activeProjects.length})
          </TabsTrigger>
          <TabsTrigger value="archived" className="flex items-center gap-2">
            <Archive className="h-4 w-4" />
            Archived ({archivedProjects.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <div className="mb-4">
            <h2 className="text-2xl font-semibold mb-2">Active Projects</h2>
            <p className="text-gray-600">Published projects and drafts that are currently active</p>
          </div>
          {renderProjectGrid(activeProjects)}
        </TabsContent>

        <TabsContent value="archived">
          <div className="mb-4">
            <h2 className="text-2xl font-semibold mb-2">Archived Projects</h2>
            <p className="text-gray-600">Projects that have been archived (soft deleted)</p>
          </div>
          {renderProjectGrid(archivedProjects)}
        </TabsContent>
      </Tabs>
    </div>
  );
} 