import Link from "next/link";
import { Code, Palette, Settings, Tool, LayoutDashboard } from "lucide-react";

export const metadata = {
  title: "Developer Tools - Color & Craft",
  description: "Developer tools and utilities for Color & Craft website",
};

interface DevToolLink {
  href: string;
  label: string;
  icon: React.ReactNode;
}

export default function DevLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const devTools: DevToolLink[] = [
    {
      href: "/dev/colors",
      label: "Color Palette",
      icon: <Palette className="w-4 h-4 mr-2" />,
    },
    {
      href: "/dev/components",
      label: "Components",
      icon: <Code className="w-4 h-4 mr-2" />,
    },
    {
      href: "/dev/env-check",
      label: "Environment Check",
      icon: <Settings className="w-4 h-4 mr-2" />,
    },
    {
      href: "/dev/debug",
      label: "Debug Tools",
      icon: <Tool className="w-4 h-4 mr-2" />,
    },
    {
      href: "/dashboard",
      label: "Back to Dashboard",
      icon: <LayoutDashboard className="w-4 h-4 mr-2" />,
    },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 border-r border-border bg-muted/50 p-4 hidden md:block">
        <div className="flex items-center space-x-2 mb-8 px-2">
          <span className="font-bold text-primary">Dev Tools</span>
        </div>
        
        <nav className="space-y-1">
          {devTools.map((tool) => (
            <Link 
              key={tool.href}
              href={tool.href}
              className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
            >
              {tool.icon}
              {tool.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden w-full border-b border-border px-4 py-3 bg-background sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <span className="font-bold text-primary">Dev Tools</span>
          <select 
            className="py-1 px-2 bg-background border border-border rounded-md text-sm"
            onChange={(e) => {
              window.location.href = e.target.value;
            }}
          >
            <option value="">Select Tool</option>
            {devTools.map((tool) => (
              <option key={tool.href} value={tool.href}>
                {tool.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 md:ml-64 md:pl-0 relative">
        <div className="md:hidden">
          {/* This div compensates for the fixed header on mobile */}
          <div className="h-12"></div>
        </div>
        {children}
      </div>
    </div>
  );
} 