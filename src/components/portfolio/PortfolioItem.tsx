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
      <div className="group relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-md border border-white/20 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 hover:bg-white/90 h-[480px] flex flex-col">
        {/* Status Badge - Top Left (only show in admin mode) */}
        {showAdminControls && (
          <div className="absolute top-3 left-3 z-10">
            {project.status === 'archived' ? (
              <Badge variant="secondary" className="bg-white/20 backdrop-blur-md text-gray-800 shadow-lg border border-white/30">
                Archived
              </Badge>
            ) : project.status === 'published' ? (
              <Badge className="bg-green-500/20 backdrop-blur-md text-green-800 shadow-lg border border-green-300/30">
                Published
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-yellow-400/20 backdrop-blur-md text-yellow-800 border border-yellow-300/40 shadow-lg">
                Draft
              </Badge>
            )}
          </div>
        )}

        {/* Admin Controls - Top Right */}
        {isAdmin && !isLoading && showAdminControls && (
          <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  disabled={actionLoading}
                  className="h-9 w-9 p-0 bg-white/20 backdrop-blur-md hover:bg-white/30 text-slate-700 hover:text-slate-900 shadow-lg border border-white/30 rounded-full"
                >
                  {actionLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Pencil className="h-4 w-4" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white/80 backdrop-blur-md border border-white/20">
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
                  <AlertDialogContent className="bg-white/90 backdrop-blur-md border border-white/30">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the project "
                        {project.title}" and remove all associated images from storage.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-white/20 backdrop-blur-md border border-white/30">Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handlePermanentDelete}
                        className="bg-red-600/90 hover:bg-red-700/90 backdrop-blur-md"
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
          <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  asChild
                  size="sm"
                  className="h-9 w-9 p-0 bg-white/20 backdrop-blur-md hover:bg-white/30 text-slate-700 hover:text-slate-900 shadow-lg border border-white/30 rounded-full"
                >
                  <Link href={`/portfolio-dash/${project.id}/edit`}>
                    <Pencil className="h-4 w-4" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-white/80 backdrop-blur-md border border-white/20">
                <p>Edit this project</p>
              </TooltipContent>
            </Tooltip>
          </div>
        )}

        {/* Loading indicator for admin check */}
        {isLoading && (
          <div className="absolute top-3 right-3 z-20">
            <div className="h-9 w-9 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
              <Loader2 className="h-4 w-4 animate-spin text-slate-600" />
            </div>
          </div>
        )}

        {/* Fixed height image container */}
        <div className="h-64 overflow-hidden rounded-t-2xl relative flex-shrink-0">
          {project.id ? (
            <RandomShowcaseImage
              portfolioId={project.id}
              title={project.title || "Furniture transformation"}
              afterImages={project.after_images}
              fallbackImage={fallbackImage}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              width={600}
              height={256}
            />
          ) : (
            <Image
              src={fallbackImage}
              alt={project.title || "Furniture transformation"}
              width={600}
              height={256}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          )}

          {/* Glassmorphism overlay on image */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>

        {/* Enhanced glassmorphism gradient overlay with better positioning */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 backdrop-blur-sm">
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-lg">
              <h3 className="text-2xl font-bold mb-2 leading-tight line-clamp-2">{project.title}</h3>
              <p className="text-sm text-gray-100 mb-4 line-clamp-3 leading-relaxed">
                {project.brief_description}
              </p>

              {project.techniques && project.techniques.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {project.techniques.slice(0, 2).map((technique) => (
                    <span
                      key={technique}
                      className="inline-block rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-xs font-medium border border-white/30 shadow-sm"
                    >
                      {technique}
                    </span>
                  ))}
                  {project.techniques.length > 2 && (
                    <span className="inline-block rounded-full bg-orange-500/20 backdrop-blur-md px-3 py-1 text-xs font-medium border border-orange-400/30 shadow-sm">
                      +{project.techniques.length - 2} more
                    </span>
                  )}
                </div>
              )}

              <Button
                asChild
                variant="outline"
                size="sm"
                className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 hover:text-white font-medium transition-all duration-300 shadow-lg"
              >
                <Link href={`/portfolio/${project.id}`}>
                  View Details
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Content section for non-hover state with glassmorphism - flex-grow to fill remaining space */}
        <div className="flex-grow p-6 group-hover:opacity-0 transition-opacity duration-500 bg-white/40 backdrop-blur-sm rounded-b-2xl flex flex-col">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 leading-tight">{project.title}</h3>
          <p className="text-gray-700 text-sm mb-4 line-clamp-3 leading-relaxed flex-grow">
            {project.brief_description}
          </p>

          {project.techniques && project.techniques.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {project.techniques.slice(0, 2).map((technique) => (
                <span
                  key={technique}
                  className="inline-block rounded-full bg-orange-200/60 backdrop-blur-sm text-orange-800 px-3 py-1 text-xs font-medium border border-orange-300/30"
                >
                  {technique}
                </span>
              ))}
              {project.techniques.length > 2 && (
                <span className="inline-block rounded-full bg-gray-200/60 backdrop-blur-sm text-gray-600 px-3 py-1 text-xs font-medium border border-gray-300/30">
                  +{project.techniques.length - 2}
                </span>
              )}
            </div>
          )}

          <div className="mt-auto">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="text-orange-600 border-orange-300/40 hover:bg-orange-100/60 backdrop-blur-sm font-medium bg-white/30 w-full"
            >
              <Link href={`/portfolio/${project.id}`}>
                View Project
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
