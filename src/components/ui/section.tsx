import React from "react";
import { cn } from "@/lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLDivElement> {
  heading?: string;
  subheading?: string;
  centered?: boolean;
  withBackground?: boolean;
  variant?: "default" | "primary" | "secondary" | "accent" | "neutral";
  withPattern?: boolean;
  withGlow?: boolean;
  children: React.ReactNode;
}

export function Section({
  heading,
  subheading,
  centered = false,
  withBackground = false,
  variant = "default",
  withPattern = false,
  withGlow = false,
  className,
  children,
  ...props
}: SectionProps) {
  // Get background class based on variant
  const getBackground = () => {
    if (!withBackground) return "";
    
    switch (variant) {
      case "primary":
        return "bg-primary-50/50 dark:bg-primary-900/10";
      case "secondary":
        return "bg-secondary-50/50 dark:bg-secondary-900/10";
      case "accent":
        return "bg-accent-50/50 dark:bg-accent-900/10";
      case "neutral":
        return "bg-neutral-50 dark:bg-neutral-900";
      default:
        return "bg-white dark:bg-neutral-900";
    }
  };

  // Get heading color based on variant
  const getHeadingColor = () => {
    switch (variant) {
      case "primary":
        return "text-primary-700 dark:text-primary-300";
      case "secondary":
        return "text-secondary-700 dark:text-secondary-300";
      case "accent":
        return "text-accent-700 dark:text-accent-300";
      default:
        return "text-neutral-900 dark:text-white";
    }
  };

  // Get pattern style based on variant
  const getPatternStyle = () => {
    if (!withPattern) return {};
    
    return {
      backgroundImage: variant === "primary" 
        ? "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d3a273' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
        : variant === "secondary"
          ? "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2340baa9' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
          : variant === "accent"
            ? "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e67a91' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
            : "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
    };
  };

  return (
    <section
      className={cn(
        "py-16 md:py-24 overflow-hidden relative",
        getBackground(),
        withGlow && "isolation",
        className
      )}
      style={{
        ...getPatternStyle()
      }}
      {...props}
    >
      {withGlow && (
        <div 
          className={cn(
            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-2/3 rounded-full opacity-30 blur-[100px] -z-10",
            variant === "primary" ? "bg-primary-300" :
            variant === "secondary" ? "bg-secondary-300" :
            variant === "accent" ? "bg-accent-300" : "bg-neutral-300"
          )}
        />
      )}

      <div className="container px-6 mx-auto">
        {(heading || subheading) && (
          <div className={cn(
            "max-w-3xl mb-12 md:mb-16",
            centered ? "mx-auto text-center" : ""
          )}>
            {subheading && (
              <p 
                className={cn(
                  "text-sm uppercase font-medium tracking-wide mb-2",
                  variant === "primary" ? "text-primary-500" :
                  variant === "secondary" ? "text-secondary-500" :
                  variant === "accent" ? "text-accent-500" : "text-neutral-500"
                )}
              >
                {subheading}
              </p>
            )}
            
            {heading && (
              <h2 
                className={cn(
                  "text-3xl md:text-4xl font-bold leading-tight",
                  getHeadingColor()
                )}
              >
                {heading}
              </h2>
            )}
          </div>
        )}
        
        <div>
          {children}
        </div>
      </div>
    </section>
  );
}
