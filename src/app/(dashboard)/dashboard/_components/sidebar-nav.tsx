"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Settings,
  Users,
  Briefcase,
  Palette,
  MessageSquare,
  FileText,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarNavProps {
  items: {
    href: string;
    title: string;
    icon: any;
    admin?: boolean;
  }[];
  className?: string;
  isAdmin: boolean;
}

export function SidebarNav({ className, items, isAdmin, ...props }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav className={cn("flex flex-col gap-1", className)} {...props}>
      {items
        .filter((item) => !item.admin || isAdmin)
        .map((item) => {
          const Icon = item.icon || FileText;
          return (
            <Button
              key={item.href}
              variant={pathname?.startsWith(item.href) ? "secondary" : "ghost"}
              className={cn(
                "justify-start",
                pathname?.startsWith(item.href) ? "bg-muted shadow-none" : "hover:bg-muted/50"
              )}
              asChild
            >
              <Link href={item.href}>
                <Icon className="mr-2 h-4 w-4" />
                {item.title}
              </Link>
            </Button>
          );
        })}
    </nav>
  );
}

export const sidebarNavItems = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Portfolio",
    href: "/admin/portfolio",
    icon: Palette,
  },
  {
    title: "Services",
    href: "/services",
    icon: Briefcase,
    admin: true,
  },
  {
    title: "Clients",
    href: "/dashboard/clients",
    icon: Users,
    admin: true,
  },
  {
    title: "Inquiries",
    href: "/dashboard/inquiries",
    icon: MessageSquare,
  },
  {
    title: "Chat Support",
    href: "/dashboard/chat",
    icon: MessageSquare,
    admin: true,
  },
  {
    title: "Content",
    href: "/dashboard/content",
    icon: BookOpen,
    admin: true,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];
