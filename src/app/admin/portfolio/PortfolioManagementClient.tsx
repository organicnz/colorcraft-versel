"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Search,
  Calendar,
  User,
  Eye,
  Pencil,
  Trash2,
  Archive,
  Star,
  MoreHorizontal,
  Filter,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import RandomShowcaseImage from "@/components/portfolio/RandomShowcaseImage";
import { PortfolioProject } from "@/types/crm";

interface PortfolioManagementClientProps {
  projects: PortfolioProject[];
  isAdmin: boolean;
  stats: {
    total: number;
    published: number;
    drafts: number;
    archived: number;
  };
}

const statusColors = {
  published: "bg-green-100 text-green-800 border-green-200",
  draft: "bg-orange-100 text-orange-800 border-orange-200",
  archived: "bg-slate-100 text-slate-800 border-slate-200",
};

const statusIcons = {
  published: Eye,
  draft: Pencil,
  archived: Archive,
};

export default function PortfolioManagementClient({
  projects,
  isAdmin,
  stats,
}: PortfolioManagementClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("active");

  // Filter projects based on search and tab
  const filteredProjects = useMemo(() => {
    let filtered = projects;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (project) =>
          project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.brief_description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.client_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply tab filter (admin only)
    if (isAdmin) {
      if (activeTab === "active") {
        filtered = filtered.filter((p) => p.status !== "archived");
      } else if (activeTab === "archived") {
        filtered = filtered.filter((p) => p.status === "archived");
      }
    }

    return filtered;
  }, [projects, searchTerm, activeTab, isAdmin]);

  // Non-admin view: Simple portfolio gallery
  if (!isAdmin) {
    return (
      <div className="space-y-6">
        {/* Search for non-admin */}
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card
              key={project.id}
              className="overflow-hidden group hover:shadow-lg transition-shadow"
            >
              <div className="relative aspect-[4/3] bg-muted">
                <RandomShowcaseImage
                  portfolioId={project.id}
                  title={project.title}
                  fallbackImage={project.after_images?.[0] || "/placeholder-image.jpg"}
                  className="object-cover transition-transform group-hover:scale-105"
                  width={400}
                  height={300}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {project.is_featured && (
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                      <Star className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  </div>
                )}
              </div>

              <CardHeader>
                <CardTitle className="line-clamp-1 group-hover:text-primary">
                  {project.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {project.brief_description}
                </p>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  {project.completion_date && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {new Date(project.completion_date).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  )}
                  {project.client_name && (
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span className="truncate">{project.client_name}</span>
                    </div>
                  )}
                </div>

                <Button asChild variant="outline" className="w-full">
                  <Link href={`/portfolio/${project.id}`}>View Project</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No projects found matching your search.</p>
          </div>
        )}
      </div>
    );
  }

  // Admin view: Full management interface
  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="active">Active ({stats.published + stats.drafts})</TabsTrigger>
          <TabsTrigger value="archived">Archived ({stats.archived})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Active Projects</h3>
            <p className="text-sm text-muted-foreground">
              Published projects and drafts that are currently active
            </p>
          </div>

          <ProjectsList projects={filteredProjects} isAdmin={true} />
        </TabsContent>

        <TabsContent value="archived" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Archived Projects</h3>
            <p className="text-sm text-muted-foreground">
              Projects that have been archived and are no longer active
            </p>
          </div>

          <ProjectsList projects={filteredProjects} isAdmin={true} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ProjectsList({ projects, isAdmin }: { projects: PortfolioProject[]; isAdmin: boolean }) {
  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No projects found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => {
        const StatusIcon = statusIcons[project.status as keyof typeof statusIcons] || Eye;

        return (
          <Card
            key={project.id}
            className="overflow-hidden group hover:shadow-lg transition-shadow"
          >
            <div className="relative aspect-[4/3] bg-muted">
              <RandomShowcaseImage
                portfolioId={project.id}
                title={project.title}
                fallbackImage={project.after_images?.[0] || "/placeholder-image.jpg"}
                className="object-cover transition-transform group-hover:scale-105"
                width={400}
                height={300}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />

              {/* Status Badge */}
              <div className="absolute top-2 left-2">
                <Badge className={statusColors[project.status as keyof typeof statusColors]}>
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {project.status}
                </Badge>
              </div>

              {/* Featured Badge */}
              {project.is_featured && (
                <div className="absolute top-2 right-2">
                  <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                    <Star className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                </div>
              )}

              {/* Admin Actions */}
              {isAdmin && (
                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="secondary" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href={`/portfolio/${project.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/portfolio-dash/${project.id}/edit`}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>

            <CardHeader>
              <CardTitle className="line-clamp-1 group-hover:text-primary">
                {project.title}
              </CardTitle>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {project.brief_description}
              </p>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                {project.completion_date && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {new Date(project.completion_date).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                )}
                {project.client_name && (
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span className="truncate">{project.client_name}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button asChild variant="outline" size="sm" className="flex-1">
                  <Link href={`/portfolio/${project.id}`}>
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Link>
                </Button>
                {isAdmin && (
                  <Button asChild variant="outline" size="sm" className="flex-1">
                    <Link href={`/portfolio-dash/${project.id}/edit`}>
                      <Pencil className="h-3 w-3 mr-1" />
                      Edit
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
