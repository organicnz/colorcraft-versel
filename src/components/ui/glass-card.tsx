import React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "light" | "dark";
  intensity?: "low" | "medium" | "high";
  borderEffect?: boolean;
  blurIntensity?: number;
  children: React.ReactNode;
}

export function GlassCard({
  variant = "light",
  intensity = "medium",
  borderEffect = true,
  blurIntensity = 8,
  className,
  children,
  ...props
}: GlassCardProps) {
  // Define opacity based on intensity
  const getOpacity = () => {
    if (variant === "light") {
      return intensity === "low" 
        ? "bg-opacity-20" 
        : intensity === "medium" 
          ? "bg-opacity-40" 
          : "bg-opacity-60";
    } else {
      return intensity === "low" 
        ? "bg-opacity-40" 
        : intensity === "medium" 
          ? "bg-opacity-60" 
          : "bg-opacity-80";
    }
  };

  // Define background color based on variant
  const getBgColor = () => {
    return variant === "light" ? "bg-white" : "bg-neutral-900";
  };

  // Define border effect
  const getBorder = () => {
    if (!borderEffect) return "";
    
    return variant === "light" 
      ? "border border-white/20" 
      : "border border-neutral-700/30";
  };

  return (
    <div
      className={cn(
        getBgColor(),
        getOpacity(),
        getBorder(),
        `backdrop-blur-[${blurIntensity}px]`,
        "rounded-xl shadow-md p-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function GlassPanel({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800",
        "bg-white/50 dark:bg-neutral-900/50 backdrop-blur-md shadow-lg",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary-100/20 to-secondary-100/20 dark:from-primary-900/10 dark:to-secondary-900/10" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
