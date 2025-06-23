"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  Star,
  ArrowUpDown,
  Calendar,
  CheckCircle,
  Info,
  ExternalLink,
  Clock,
  Camera,
  Palette,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { deletePortfolioProject } from "@/actions/portfolioActions";

// Define a type for the project props
type Project = {
  id: string;
  title: string;
  brief_description?: string;
  description?: string;
  before_images?: string[];
  after_images?: string[];
  techniques?: string[];
  materials?: string[];
  completion_date?: string;
  client_name?: string;
  client_testimonial?: string;
  is_featured?: boolean;
  featured?: boolean;
  created_at?: string;
  updated_at?: string;
};

interface PortfolioTableProps {
  projects: Project[];
}

export default function PortfolioTable({ projects }: PortfolioTableProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [sortField, setSortField] = React.useState<"title" | "created_at" | "is_featured">(
    "is_featured"
  );
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">("desc");

  // Sort projects based on current sort settings
  const sortedProjects = React.useMemo(() => {
    return [...projects].sort((a, b) => {
      if (sortField === "is_featured") {
        const aFeatured = a.is_featured || a.featured || false;
        const bFeatured = b.is_featured || b.featured || false;
        if (aFeatured === bFeatured) {
          const aDate = new Date(a.created_at || "");
          const bDate = new Date(b.created_at || "");
          return sortDirection === "desc"
            ? bDate.getTime() - aDate.getTime()
            : aDate.getTime() - bDate.getTime();
        }
        return sortDirection === "desc" ? (aFeatured ? -1 : 1) : aFeatured ? 1 : -1;
              } else if (sortField === "created_at") {
          const aDate = new Date(a.created_at || "");
          const bDate = new Date(b.created_at || "");
          return sortDirection === "desc"
            ? bDate.getTime() - aDate.getTime()
            : aDate.getTime() - bDate.getTime();
      } else {
        return sortDirection === "desc"
          ? b.title.localeCompare(a.title)
          : a.title.localeCompare(b.title);
      }
    });
  }, [projects, sortField, sortDirection]);

  const toggleSort = (field: "title" | "created_at" | "is_featured") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    setDeleteId(id);

    try {
      const result = await deletePortfolioProject(id);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(result.success || "Project deleted successfully");
        router.refresh();
      }
    } catch (error: any) {
      console.error("Error deleting project:", error);
      toast.error(error.message || "Failed to delete project");
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const getSortIcon = (field: "title" | "created_at" | "is_featured") => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4 ml-1 opacity-50" />;
    return sortDirection === "asc" ? (
      <ArrowUpDown className="h-4 w-4 ml-1 rotate-180 text-primary" />
    ) : (
      <ArrowUpDown className="h-4 w-4 ml-1 text-primary" />
    );
  };

  const getProjectThumbnail = (project: Project) => {
    const afterImage = project.after_images?.[0];
    if (afterImage) {
      return afterImage;
    }
    return null;
  };

  return (
    <TooltipProvider>
      <div className="rounded-lg border-0 shadow-sm overflow-hidden bg-white/30 dark:bg-white/10 backdrop-blur-md shadow-glass border border-white/30 dark:border-white/10 transition-all duration-300 hover:shadow-glass-heavy">
        {/* Glass gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent dark:from-white/5 pointer-events-none" />

        <div className="relative z-10">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-slate-50/50 to-blue-50/50 dark:from-slate-800/50 dark:to-slate-700/50 hover:bg-gradient-to-r hover:from-slate-100/50 hover:to-blue-100/50 dark:hover:from-slate-700/50 dark:hover:to-slate-600/50">
                <TableHead className="w-16"></TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => toggleSort("title")}
                    className="h-auto p-0 font-semibold hover:bg-transparent"
                  >
                    Project
                    {getSortIcon("title")}
                  </Button>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => toggleSort("created_at")}
                    className="h-auto p-0 font-semibold hover:bg-transparent"
                  >
                    Created
                    {getSortIcon("created_at")}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => toggleSort("is_featured")}
                    className="h-auto p-0 font-semibold hover:bg-transparent"
                  >
                    Featured
                    {getSortIcon("is_featured")}
                  </Button>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedProjects.map((project, index) => {
                const thumbnail = getProjectThumbnail(project);
                return (
                  <TableRow
                    key={project.id}
                    className="group hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 dark:hover:from-blue-950/20 dark:hover:to-purple-950/20 transition-all duration-200"
                  >
                    <TableCell className="w-16">
                      <div className="relative">
                        {thumbnail ? (
                          <Avatar className="h-12 w-12 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                            <AvatarImage
                              src={thumbnail}
                              alt={project.title}
                              className="object-cover"
                            />
                            <AvatarFallback className="rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900">
                              <Palette className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </AvatarFallback>
                          </Avatar>
                        ) : (
                          <Avatar className="h-12 w-12 rounded-lg border-2 border-slate-200 dark:border-slate-800">
                            <AvatarFallback className="rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700">
                              <Camera className="h-6 w-6 text-slate-500" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                        {(project.is_featured || project.featured) && (
                          <div className="absolute -top-1 -right-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          </div>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-semibold text-foreground group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                          {project.title}
                        </div>
                        <div className="text-sm text-muted-foreground line-clamp-2 max-w-sm">
                          {project.brief_description || "No description available"}
                        </div>
                        {project.techniques && project.techniques.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {project.techniques.slice(0, 3).map((technique, i) => (
                              <Badge
                                key={i}
                                variant="secondary"
                                className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                              >
                                {technique}
                              </Badge>
                            ))}
                            {project.techniques.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{project.techniques.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {(project.is_featured || project.featured) && (
                          <Badge className="w-fit bg-yellow-100 text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-300">
                            <Star className="w-3 h-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium">
                          {format(new Date(project.created_at || ""), "MMM dd, yyyy")}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(project.created_at || ""), "h:mm a")}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center justify-center">
                        {(project.is_featured || project.featured) ? (
                          <Tooltip>
                            <TooltipTrigger>
                              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Featured on homepage</p>
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          <Star className="h-5 w-5 text-slate-300 dark:text-slate-600" />
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0">
                              <Link href={`/portfolio/${project.id}`} target="_blank">
                                <ExternalLink className="h-4 w-4" />
                              </Link>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>View public page</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0">
                              <DropdownMenuItem asChild>
                                <Link
                                  href={`/portfolio-management/edit/${project.id}`}
                                  className="flex items-center"
                                >
                                  <Pencil className="h-4 w-4" />
                                </Link>
                              </DropdownMenuItem>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Edit project</p>
                          </TooltipContent>
                        </Tooltip>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                              disabled={isDeleting && deleteId === project.id}
                            >
                              {isDeleting && deleteId === project.id ? (
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Project</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{project.title}"? This action
                                cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(project.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete Project
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </TooltipProvider>
  );
}
