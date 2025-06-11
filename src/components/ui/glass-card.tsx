import React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "light" | "dark" | "primary" | "accent";
  intensity?: "subtle" | "medium" | "strong";
  blur?: "sm" | "md" | "lg" | "xl";
  border?: boolean;
  shadow?: "light" | "medium" | "heavy";
  children: React.ReactNode;
}

export function GlassCard({
  variant = "light",
  intensity = "medium",
  blur = "md",
  border = true,
  shadow = "medium",
  className,
  children,
  ...props
}: GlassCardProps) {
  // Background configurations
  const backgroundVariants = {
    light: {
      subtle: "bg-white/20 dark:bg-white/10",
      medium: "bg-white/30 dark:bg-white/15",
      strong: "bg-white/50 dark:bg-white/25",
    },
    dark: {
      subtle: "bg-black/20 dark:bg-black/30",
      medium: "bg-black/30 dark:bg-black/40",
      strong: "bg-black/50 dark:bg-black/60",
    },
    primary: {
      subtle: "bg-primary-100/30 dark:bg-primary-900/20",
      medium: "bg-primary-100/50 dark:bg-primary-900/30",
      strong: "bg-primary-100/70 dark:bg-primary-900/50",
    },
    accent: {
      subtle: "bg-accent-100/30 dark:bg-accent-900/20",
      medium: "bg-accent-100/50 dark:bg-accent-900/30",
      strong: "bg-accent-100/70 dark:bg-accent-900/50",
    },
  };

  // Border configurations
  const borderVariants = {
    light: "border border-white/20 dark:border-white/10",
    dark: "border border-black/20 dark:border-black/30",
    primary: "border border-primary-200/50 dark:border-primary-700/30",
    accent: "border border-accent-200/50 dark:border-accent-700/30",
  };

  // Blur configurations
  const blurConfig = {
    sm: "backdrop-blur-sm",
    md: "backdrop-blur-md",
    lg: "backdrop-blur-lg",
    xl: "backdrop-blur-xl",
  };

  // Shadow configurations
  const shadowConfig = {
    light: "shadow-glass-light",
    medium: "shadow-glass",
    heavy: "shadow-glass-heavy",
  };

  return (
    <div
      className={cn(
        // Base styles
        "relative rounded-xl overflow-hidden",
        // Background
        backgroundVariants[variant][intensity],
        // Backdrop blur
        blurConfig[blur],
        // Border
        border && borderVariants[variant],
        // Shadow
        shadowConfig[shadow],
        // Hover effects
        "transition-all duration-300 hover:shadow-glass-heavy",
        "before:absolute before:inset-0 before:rounded-xl before:p-[1px]",
        "before:bg-glass-border before:mask-linear-gradient",
        "before:-z-10 before:bg-clip-padding before:backdrop-blur-sm",
        className
      )}
      {...props}
    >
      {/* Inner content with padding */}
      <div className="relative z-10 p-6">{children}</div>

      {/* Optional shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-glass-shimmer opacity-50" />
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
        // Base glassmorphism styles
        "relative overflow-hidden rounded-xl",
        "bg-white/20 dark:bg-white/10",
        "backdrop-blur-md",
        "border border-white/20 dark:border-white/10",
        "shadow-glass",
        // Hover effects
        "transition-all duration-300 hover:bg-white/30 dark:hover:bg-white/15",
        "hover:shadow-glass-heavy",
        className
      )}
      {...props}
    >
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent dark:from-white/5" />

      {/* Content */}
      <div className="relative z-10 p-6">{children}</div>
    </div>
  );
}

export function GlassNavbar({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        // Glass navbar specific styles
        "sticky top-0 z-50 w-full",
        "bg-white/70 dark:bg-slate-900/70",
        "backdrop-blur-xl",
        "border-b border-white/20 dark:border-white/10",
        "shadow-glass-light",
        // Smooth transitions
        "transition-all duration-300",
        "supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-slate-900/60",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function GlassButton({
  variant = "light",
  className,
  children,
  ...props
}: GlassCardProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const buttonVariants = {
    light: "bg-white/20 hover:bg-white/30 text-slate-900 dark:text-white",
    dark: "bg-black/20 hover:bg-black/30 text-white",
    primary: "bg-primary-500/20 hover:bg-primary-500/30 text-primary-900 dark:text-primary-100",
    accent: "bg-accent-500/20 hover:bg-accent-500/30 text-accent-900 dark:text-accent-100",
  };

  return (
    <button
      className={cn(
        // Base button styles
        "relative overflow-hidden rounded-lg px-6 py-3",
        "backdrop-blur-md",
        "border border-white/20 dark:border-white/10",
        "shadow-glass-light",
        // Variant styles
        buttonVariants[variant],
        // Transitions and effects
        "transition-all duration-300",
        "hover:shadow-glass-heavy hover:scale-[1.02]",
        "active:scale-[0.98]",
        "focus:outline-none focus:ring-2 focus:ring-white/20",
        // Disabled state
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    >
      {/* Shimmer effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-700" />

      {/* Button content */}
      <span className="relative z-10 font-medium">{children}</span>
    </button>
  );
}

export function GlassModal({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        // Modal backdrop
        "fixed inset-0 z-50 flex items-center justify-center p-4",
        "bg-black/20 backdrop-blur-sm",
        className
      )}
      {...props}
    >
      <div className="relative max-w-lg w-full">
        <GlassCard variant="light" intensity="strong" blur="xl" shadow="heavy">
          {children}
        </GlassCard>
      </div>
    </div>
  );
}
