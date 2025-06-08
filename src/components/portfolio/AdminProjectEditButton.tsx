"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { Pencil, Settings, ExternalLink, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface AdminProjectEditButtonProps {
  projectId: string;
  variant?: "button" | "dropdown" | "icon";
  className?: string;
}

export default function AdminProjectEditButton({
  projectId,
  variant = "button",
  className = "",
}: AdminProjectEditButtonProps) {
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

  // Don't render if not admin
  if (!isAdmin) {
    return null;
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className={`inline-flex items-center ${className}`}>
        <Button variant="outline" size="sm" disabled>
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          Loading...
        </Button>
      </div>
    );
  }

  if (variant === "icon") {
    return (
      <Button
        asChild
        size="sm"
        variant="outline"
        className={`h-8 w-8 p-0 ${className}`}
      >
        <Link href={`/portfolio-dash/${projectId}/edit`}>
          <Pencil className="h-4 w-4" />
        </Link>
      </Button>
    );
  }

  if (variant === "button") {
    return (
      <Button
        asChild
        variant="outline"
        size="sm"
        className={`bg-primary/5 border-primary/20 hover:bg-primary/10 ${className}`}
      >
        <Link href={`/portfolio-dash/${projectId}/edit`}>
          <Pencil className="h-4 w-4 mr-2" />
          Edit Project
          <Badge variant="secondary" className="ml-2 text-xs">
            Admin
          </Badge>
        </Link>
      </Button>
    );
  }

  if (variant === "dropdown") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={`bg-primary/5 border-primary/20 hover:bg-primary/10 ${className}`}
          >
            <Settings className="h-4 w-4 mr-2" />
            Admin Actions
            <Badge variant="secondary" className="ml-2 text-xs">
              Admin
            </Badge>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem asChild>
            <Link href={`/portfolio-dash/${projectId}/edit`}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit Project
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/portfolio-dash/manage" target="_blank">
              <ExternalLink className="h-4 w-4 mr-2" />
              Portfolio Dashboard
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/portfolio-dash/new" target="_blank">
              <Settings className="h-4 w-4 mr-2" />
              Add New Project
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return null;
} 