"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PortfolioItem from "./PortfolioItem";
import { fetchPortfolioProjects } from "@/actions/portfolioActions";
import { Loader2, Archive, Eye, EyeOff, FolderOpen, Trash2, Plus } from "lucide-react";
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
  status: "published" | "draft" | "archived";
  created_by?: string;
  updated_by?: string;
  created_at: string;
  updated_at: string;
  created_by_user?: { full_name?: string; email: string };
  updated_by_user?: { full_name?: string; email: string };
};

export default function PortfolioTabs() {
  const [publishedProjects, setPublishedProjects] = useState<PortfolioProject[]>([]);
  const [draftProjects, setDraftProjects] = useState<PortfolioProject[]>([]);
  const [archivedProjects, setArchivedProjects] = useState<PortfolioProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("active");

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      // Fetch active projects (published + drafts)
      const activeResult = await fetchPortfolioProjects("active");
      if (activeResult.success && activeResult.data) {
        // Separate published and draft projects
        const published = activeResult.data.filter((p) => p.status === "published");
        const drafts = activeResult.data.filter((p) => p.status === "draft");
        setPublishedProjects(published);
        setDraftProjects(drafts);
      }

      // Fetch archived projects
      const archivedResult = await fetchPortfolioProjects("archived");
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
    const publishedCount = publishedProjects.length;
    const draftCount = draftProjects.length;
    const archivedCount = archivedProjects.length;
    const totalCount = publishedCount + draftCount + archivedCount;

    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card glass={true} glassVariant="light" glassIntensity="medium">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Total Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <FolderOpen className="h-4 w-4 text-blue-600 mr-2" />
              <span className="text-2xl font-bold">{totalCount}</span>
            </div>
          </CardContent>
        </Card>

        <Card glass={true} glassVariant="light" glassIntensity="medium">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Published
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Eye className="h-4 w-4 text-green-600 mr-2" />
              <span className="text-2xl font-bold text-green-600">{publishedCount}</span>
            </div>
          </CardContent>
        </Card>

        <Card glass={true} glassVariant="light" glassIntensity="medium">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Drafts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <EyeOff className="h-4 w-4 text-yellow-600 mr-2" />
              <span className="text-2xl font-bold text-yellow-600">{draftCount}</span>
            </div>
          </CardContent>
        </Card>

        <Card glass={true} glassVariant="light" glassIntensity="medium">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Archived
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Trash2 className="h-4 w-4 text-slate-600 mr-2" />
              <span className="text-2xl font-bold text-slate-600">{archivedCount}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderProjectGrid = (projects: PortfolioProject[], tabType: string) => {
    if (projects.length === 0) {
      const emptyMessages = {
        active: "No published projects yet. Publish some draft projects to see them here!",
        draft: "No draft projects yet. Create your first draft project to get started!",
        archived: "No archived projects yet.",
      };

      return (
        <div className="text-center py-12">
          <div className="bg-white/70 backdrop-blur-md border border-white/30 rounded-3xl p-8 max-w-md mx-auto shadow-lg">
            <div className="mb-6">
              <div className="bg-orange-200/60 backdrop-blur-sm p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center border border-orange-300/30">
                <FolderOpen className="h-8 w-8 text-orange-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No projects found</h3>
            <p className="text-slate-600 mb-6">
              {emptyMessages[tabType as keyof typeof emptyMessages]}
            </p>
            {(tabType === "active" || tabType === "draft") && (
              <Button
                asChild
                size="lg"
                className="bg-[#3ECF8E] hover:bg-[#38BC81] backdrop-blur-md text-white font-semibold px-6 py-3 rounded-full shadow-lg border border-[#3ECF8E]/30 transition-all duration-300 hover:shadow-xl"
              >
                <Link href="/portfolio-dash/new">
                  <Plus className="mr-2 h-5 w-5" />
                  Create New Project
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
            <PortfolioItem project={project} showAdminControls={true} onUpdate={loadProjects} />

            {/* Creator info */}
            {project.created_by_user && (
              <div className="mt-2 text-xs text-slate-500">
                Created by: {project.created_by_user.full_name || project.created_by_user.email}
                {project.updated_by_user &&
                  project.updated_by_user.email !== project.created_by_user.email && (
                    <span>
                      {" "}
                      • Updated by:{" "}
                      {project.updated_by_user.full_name || project.updated_by_user.email}
                    </span>
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
            <p className="text-lg text-slate-600">
              Manage your portfolio projects with status tracking and organization
            </p>
          </div>
          <div className="mt-4 md:mt-0 text-center md:text-right">
            <Button
              asChild
              size="lg"
              className="bg-[#3ECF8E] hover:bg-[#38BC81] backdrop-blur-md text-white font-semibold px-6 py-3 rounded-full shadow-lg border border-[#3ECF8E]/30 transition-all duration-300 hover:shadow-xl"
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
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="active" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Published ({publishedProjects.length})
          </TabsTrigger>
          <TabsTrigger value="draft" className="flex items-center gap-2">
            <EyeOff className="h-4 w-4" />
            Draft ({draftProjects.length})
          </TabsTrigger>
          <TabsTrigger value="archived" className="flex items-center gap-2">
            <Archive className="h-4 w-4" />
            Archived ({archivedProjects.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <div className="mb-4">
            <h2 className="text-2xl font-semibold mb-2">Published Projects</h2>
            <p className="text-slate-600">Live projects visible on your public portfolio</p>
          </div>
          {renderProjectGrid(publishedProjects, "active")}
        </TabsContent>

        <TabsContent value="draft">
          <div className="mb-4">
            <h2 className="text-2xl font-semibold mb-2">Draft Projects</h2>
            <p className="text-slate-600">Projects in development that are not yet published</p>
          </div>
          {renderProjectGrid(draftProjects, "draft")}
        </TabsContent>

        <TabsContent value="archived">
          <div className="mb-4">
            <h2 className="text-2xl font-semibold mb-2">Archived Projects</h2>
            <p className="text-slate-600">Projects that have been archived (soft deleted)</p>
          </div>
          {renderProjectGrid(archivedProjects, "archived")}
        </TabsContent>
      </Tabs>
    </div>
  );
}
