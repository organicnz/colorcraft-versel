"use client";

import { useEffect, useState } from "react";
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { Pencil, Loader2 } from "lucide-react";
import { PortfolioProject } from "@/types/crm"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type PortfolioItemProps = {
  project: Partial<PortfolioProject>
}

export default function PortfolioItem({ project }: PortfolioItemProps) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAdminStatus();
  }, []);

    const checkAdminStatus = async () => {
    try {
      const supabase = createClient();

      // Get current user
      const { data: { user: currentUser } } = await supabase.auth.getUser();

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

  // Get the first "after" image as the main display image
  const mainImage = project.after_images?.[0] || "/placeholder-image.jpg"

  return (
    <TooltipProvider>
      <div className="group relative overflow-hidden rounded-lg transition-all hover:shadow-xl">
        {/* Admin Edit Button - Top Right */}
        {isAdmin && !isLoading && (
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

        <div className="aspect-square overflow-hidden">
          <Image
            src={mainImage}
            alt={project.title || "Furniture transformation"}
            width={500}
            height={500}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <h3 className="text-xl font-bold">{project.title}</h3>
            <p className="mt-1 line-clamp-2 text-sm text-gray-200">
              {project.brief_description}
            </p>

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
  )
}