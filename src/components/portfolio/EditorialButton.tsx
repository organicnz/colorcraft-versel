"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Edit3, Settings, Plus, Eye, EyeOff, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface EditorialButtonProps {
  className?: string;
  variant?: "floating" | "inline" | "fixed";
}

export default function EditorialButton({ className, variant = "floating" }: EditorialButtonProps) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const supabase = createClient();

      // Get current user
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      if (!currentUser) {
        setIsAdmin(false);
        setUser(null);
        return;
      }

      setUser(currentUser);

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

  // Don't render anything if not admin or still loading
  if (isLoading) {
    return variant === "floating" ? (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <div className="bg-primary/10 backdrop-blur-sm border border-primary/20 rounded-full p-3">
          <Loader2 className="h-5 w-5 text-primary animate-spin" />
        </div>
      </motion.div>
    ) : null;
  }

  if (!isAdmin) {
    return null;
  }

  const FloatingVariant = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="fixed bottom-6 right-6 z-50"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="relative">
        {/* Expanded menu */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-16 right-0 mb-2"
            >
              <div className="bg-background/95 backdrop-blur-sm border shadow-lg rounded-lg p-2 min-w-[200px]">
                <div className="flex items-center gap-2 p-2 border-b mb-2">
                  <div className="h-2 w-2 bg-success-500 rounded-full"></div>
                  <span className="text-sm font-medium">Admin Mode</span>
                </div>

                <Link href="/portfolio-dash/manage">
                  <Button variant="ghost" className="w-full justify-start h-9 text-sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Manage Portfolio
                  </Button>
                </Link>

                <Link href="/portfolio-dash/new">
                  <Button
                    variant="ghost"
                    className="w-full justify-start h-9 text-sm hover:bg-success-500/10 hover:text-success-500 transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Project
                  </Button>
                </Link>

                <Button
                  variant="ghost"
                  className="w-full justify-start h-9 text-sm"
                  onClick={() => {
                    const baseUrl = window.location.origin;
                    window.location.href = `${baseUrl}/portfolio-dash/manage`;
                  }}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Admin Dashboard
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main floating button */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative">
          <Button
            size="lg"
            className="rounded-full h-14 w-14 shadow-lg bg-primary/90 hover:bg-primary border-2 border-primary-foreground/10 backdrop-blur-sm"
          >
            <Edit3 className="h-6 w-6" />
          </Button>

          {/* Animated pulse ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-primary/30"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </div>
    </motion.div>
  );

  const InlineVariant = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "bg-primary/5 border-primary/20 hover:bg-primary/10 backdrop-blur-sm",
            className
          )}
        >
          <Edit3 className="h-4 w-4 mr-2" />
          Edit Portfolio
          <Badge variant="secondary" className="ml-2 text-xs">
            Admin
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="flex items-center gap-2 p-2">
          <div className="h-2 w-2 bg-success-500 rounded-full"></div>
          <span className="text-sm font-medium">Admin Panel</span>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/portfolio-dash/manage" className="cursor-pointer">
            <Settings className="h-4 w-4 mr-2" />
            Manage All Projects
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/portfolio-dash/new" className="cursor-pointer">
            <Plus className="h-4 w-4 mr-2" />
            Add New Project
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => {
            const baseUrl = window.location.origin;
            window.location.href = `${baseUrl}/portfolio-dash/manage`;
          }}
          className="cursor-pointer"
        >
          <Eye className="h-4 w-4 mr-2" />
          Open Admin Dashboard
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const FixedVariant = () => (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed top-1/2 right-0 -translate-y-1/2 z-50"
    >
      <div className="bg-primary/90 backdrop-blur-sm text-primary-foreground rounded-l-lg shadow-lg">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="lg"
              className="h-16 w-12 rounded-none rounded-l-lg text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Edit3 className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="left" align="center" className="w-56">
            <div className="flex items-center gap-2 p-2">
              <div className="h-2 w-2 bg-success-500 rounded-full"></div>
              <span className="text-sm font-medium">Portfolio Editor</span>
            </div>

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <Link href="/portfolio-dash/manage" className="cursor-pointer">
                <Settings className="h-4 w-4 mr-2" />
                Manage Portfolio
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link href="/portfolio-dash/new" className="cursor-pointer">
                <Plus className="h-4 w-4 mr-2" />
                Add New Project
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.div>
  );

  switch (variant) {
    case "inline":
      return <InlineVariant />;
    case "fixed":
      return <FixedVariant />;
    default:
      return <FloatingVariant />;
  }
}
