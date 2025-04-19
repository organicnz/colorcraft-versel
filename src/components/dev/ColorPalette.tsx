"use client";

import { colors } from "@/styles/colors";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Copy, FileText } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type ColorType = "primary" | "secondary" | "accent" | "neutral" | "success" | "warning" | "danger";
type ColorShade = string | { [key: string]: string };

// Helper to check if a color is an object with shades
const hasShades = (color: ColorShade): color is { [key: string]: string } => {
  return typeof color === "object";
};

export default function ColorPalette() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (value: string) => {
    navigator.clipboard.writeText(value);
    setCopied(value);
    toast.success(`Copied ${value} to clipboard`);
    setTimeout(() => setCopied(null), 2000);
  };

  // Render a single color swatch
  const renderSwatch = (color: string, name: string, shade?: string | number) => {
    const displayName = shade ? `${name}-${shade}` : name;
    const isCopied = copied === color;

    return (
      <div 
        key={displayName} 
        className="relative flex flex-col overflow-hidden rounded-md shadow-sm border border-border/30"
      >
        <div 
          className="h-16 w-full cursor-pointer flex items-center justify-center transition-all duration-200 hover:opacity-90"
          style={{ backgroundColor: color }}
          onClick={() => copyToClipboard(color)}
        >
          {isCopied && (
            <div className="absolute inset-0 bg-black/10 flex items-center justify-center text-white">
              Copied!
            </div>
          )}
          <Copy size={16} className={cn(
            "opacity-0 transition-opacity duration-200 group-hover:opacity-100",
            isLightColor(color) ? "text-black/70" : "text-white/70"
          )} />
        </div>
        <div className="p-2 text-xs bg-background">
          <div className="font-medium">{displayName}</div>
          <div className="text-muted-foreground mt-1 font-mono text-xs">{color}</div>
        </div>
      </div>
    );
  };

  // Helper to determine if text should be dark on light background
  const isLightColor = (hex: string): boolean => {
    // Remove the # if it exists
    hex = hex.replace("#", "");
    
    // Convert hex to RGB
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    // Calculate brightness
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    
    // Return true if the color is light
    return brightness > 128;
  };

  // Render a color category with all its shades
  const renderColorCategory = (colorType: ColorType, title: string) => {
    const colorData = colors[colorType];
    
    if (!colorData) return null;

    return (
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3">{title}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {hasShades(colorData) 
            ? Object.entries(colorData).map(([shade, value]) => 
                renderSwatch(value as string, colorType, shade)
              )
            : renderSwatch(colorData as string, colorType)
          }
        </div>
      </div>
    );
  };

  // Render gradients
  const renderGradients = () => {
    if (!colors.gradients) return null;
    
    return (
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3">Gradients</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(colors.gradients).map(([name, value]) => (
            <div 
              key={name}
              className="rounded-md overflow-hidden shadow-sm border border-border/30"
            >
              <div 
                className="h-24 w-full cursor-pointer flex items-center justify-center transition-all duration-200"
                style={{ background: value }}
                onClick={() => copyToClipboard(value)}
              >
                <span className={cn(
                  "font-medium text-sm",
                  name.includes("Glass") ? "text-black" : "text-white"
                )}>
                  {name}
                </span>
              </div>
              <div className="p-2 text-xs bg-background">
                <div className="font-mono text-xs break-all">{value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 bg-background">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Color Palette</h1>
        <Button variant="outline" size="sm" asChild>
          <Link href="/dev/colors/docs" className="flex items-center">
            <FileText className="mr-1 h-4 w-4" />
            View Documentation
          </Link>
        </Button>
      </div>
      
      <p className="text-muted-foreground mb-8">
        Click on any color to copy its hex value. This component visualizes all colors from the 
        <code className="mx-1 px-1 py-0.5 bg-muted rounded font-mono text-xs">src/styles/colors.ts</code>
        file.
      </p>
      
      {renderColorCategory("primary", "Primary Colors")}
      {renderColorCategory("secondary", "Secondary Colors")}
      {renderColorCategory("accent", "Accent Colors")}
      {renderColorCategory("neutral", "Neutral Colors")}
      {renderColorCategory("success", "Success Colors")}
      {renderColorCategory("warning", "Warning Colors")}
      {renderColorCategory("danger", "Danger Colors")}
      {renderGradients()}
    </div>
  );
} 