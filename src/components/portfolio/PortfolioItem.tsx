"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { Pencil, Loader2, Archive, RotateCcw, Trash2 } from "lucide-react";
import { PortfolioProject } from "@/types/crm";
import RandomShowcaseImage from "./RandomShowcaseImage";
import {
  archivePortfolioProject,
  restorePortfolioProject,
  deletePortfolioProject,
} from "@/actions/portfolioActions";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Badge } from "@/components/ui/badge";

type PortfolioItemProps = {
  project: Partial<PortfolioProject>;
  showAdminControls?: boolean;
  onUpdate?: () => void;
};

export default function PortfolioItem({
  project,
  showAdminControls = false,
  onUpdate,
}: PortfolioItemProps) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (showAdminControls) {
      setIsAdmin(true);
      setIsLoading(false);
    } else {
      checkAdminStatus();
    }
  }, [showAdminControls]);

  const checkAdminStatus = async () => {
    try {
      const supabase = createClient();

      // Get current user
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      if (!currentUser) {
        setIsAdmin(false);
        return;
      }

      // Check if user is admin
      const { data: userData, error } = await supabase
        .from("users")
        .select("role")
        .eq("id", currentUser.id)
        .single();

      if (!error && userData?.role === "admin") {
        setIsAdmin(true);
      }
    } catch (error) {
      console.error("Error checking admin status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleArchive = async () => {
    if (!project.id) return;

    setActionLoading(true);
    try {
      const result = await archivePortfolioProject(project.id);
      if (result.success) {
        toast.success(result.message);
        onUpdate?.();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Failed to archive project");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRestore = async () => {
    if (!project.id) return;

    setActionLoading(true);
    try {
      const result = await restorePortfolioProject(project.id);
      if (result.success) {
        toast.success(result.message);
        onUpdate?.();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Failed to restore project");
    } finally {
      setActionLoading(false);
    }
  };

  const handlePermanentDelete = async () => {
    if (!project.id) return;

    setActionLoading(true);
    try {
      const result = await deletePortfolioProject(project.id);
      if (result.success) {
        toast.success(result.message);
        onUpdate?.();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Failed to delete project");
    } finally {
      setActionLoading(false);
    }
  };

  // Fallback to first after image if no storage images found
  const fallbackImage = project.after_images?.[0] || "/placeholder-image.jpg";

  return (
    <TooltipProvider>
      <div className="group relative overflow-hidden rounded-lg transition-all hover:shadow-xl">
        {/* Admin Controls - Top Right */}
        {isAdmin && !isLoading && showAdminControls && (
          <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  disabled={actionLoading}
                  className="h-8 w-8 p-0 bg-white/90 hover:bg-white text-slate-700 hover:text-slate-900 shadow-lg backdrop-blur-sm"
                >
                  {actionLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Pencil className="h-4 w-4" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/portfolio-dash/${project.id}/edit`}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit Project
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {project.status === 'archived' ? (
                  <DropdownMenuItem onClick={handleRestore}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Restore
                  </DropdownMenuItem>
                ) : project.status === 'published' ? (
                  <DropdownMenuItem onClick={handleArchive}>
                    <Archive className="h-4 w-4 mr-2" />
                    Archive
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={handleArchive}>
                    <Archive className="h-4 w-4 mr-2" />
                    Archive
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem
                      className="text-red-600 focus:text-red-600"
                      onSelect={(e) => e.preventDefault()}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Permanently
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the project "
                        {project.title}" and remove all associated images from storage.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handlePermanentDelete}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Delete Permanently
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        {/* Simple Edit Button for non-admin or non-showAdminControls */}
        {isAdmin && !isLoading && !showAdminControls && (
          <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  asChild
                  size="sm"
                  className="h-8 w-8 p-0 bg-white/90 hover:bg-white text-slate-700 hover:text-slate-900 shadow-lg backdrop-blur-sm"
                >
                  <Link href={`/portfolio-dash/${project.id}/edit`}>
                    <Pencil className="h-4 w-4" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit this project</p>
              </TooltipContent>
            </Tooltip>
          </div>
        )}

        {/* Loading indicator for admin check */}
        {isLoading && (
          <div className="absolute top-3 right-3 z-20">
            <div className="h-8 w-8 bg-white/20 rounded flex items-center justify-center backdrop-blur-sm">
              <Loader2 className="h-3 w-3 animate-spin text-white" />
            </div>
          </div>
        )}

        <div className="absolute top-2 right-2 flex gap-2">
          {project.status === 'archived' ? (
            <Badge variant="secondary" className="bg-gray-100 text-gray-800">
              Archived
            </Badge>
          ) : project.status === 'published' ? (
            <Badge className="bg-green-100 text-green-800">
              Published
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">
              Draft
            </Badge>
          )}
        </div>

        <div className="aspect-square overflow-hidden">
          {project.id ? (
            <RandomShowcaseImage
              portfolioId={project.id}
              title={project.title || "Furniture transformation"}
              afterImages={project.after_images}
              fallbackImage={fallbackImage}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              width={500}
              height={500}
            />
          ) : (
            <Image
              src={fallbackImage}
              alt={project.title || "Furniture transformation"}
              width={500}
              height={500}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          )}
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <h3 className="text-xl font-bold">{project.title}</h3>
            <p className="mt-1 line-clamp-2 text-sm text-gray-200">{project.brief_description}</p>

            {project.techniques && project.techniques.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {project.techniques.slice(0, 3).map((technique) => (
                  <span
                    key={technique}
                    className="inline-block rounded-full bg-primary-600/40 px-2 py-0.5 text-xs"
                  >
                    {technique}
                  </span>
                ))}
              </div>
            )}

            <Link
              href={`/portfolio/${project.id}`}
              className="mt-3 inline-block rounded-lg border border-white px-4 py-1 text-sm font-medium text-white hover:bg-white hover:text-primary-700 transition-colors"
            >
              View Project
            </Link>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
