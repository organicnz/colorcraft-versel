"use client";

import Link from "next/link";
import { Code, Palette, Settings, Wrench, LayoutDashboard } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface DevTool {
  href: string;
  label: string;
  description: string;
  icon: React.ReactNode;
}

export default function DevToolsIndex() {
  const devTools: DevTool[] = [
    {
      href: "/dev/colors",
      label: "Color Palette",
      description: "View and copy the complete color system used throughout the application.",
      icon: <Palette className="w-8 h-8 text-primary" />,
    },
    {
      href: "/dev/components",
      label: "Component Showcase",
      description: "Explore UI components with different color variants and styles.",
      icon: <Code className="w-8 h-8 text-secondary-500" />,
    },
    {
      href: "/env-check",
      label: "Environment Check",
      description: "Verify environment variables and configuration settings.",
      icon: <Settings className="w-8 h-8 text-accent-500" />,
    },
    {
      href: "/debug",
      label: "Debug Tools",
      description: "Tools for debugging and testing application features.",
      icon: <Wrench className="w-8 h-8 text-neutral-600" />,
    },
    {
      href: "/dashboard",
      label: "Back to Dashboard",
      description: "Return to the application dashboard.",
      icon: <LayoutDashboard className="w-8 h-8 text-primary-400" />,
    },
  ];

  return (
    <div className="container max-w-7xl py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-3">Developer Tools</h1>
        <p className="text-muted-foreground">
          Welcome to the Color & Craft developer tools. Here you'll find resources
          to help you build and maintain the application.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {devTools.map((tool) => (
          <Card key={tool.href} className="overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                {tool.icon}
              </div>
              <CardTitle className="mt-3">{tool.label}</CardTitle>
              <CardDescription>{tool.description}</CardDescription>
            </CardHeader>
            <CardFooter className="pt-2">
              <Button asChild className="w-full">
                <Link href={tool.href}>Open {tool.label}</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
} 