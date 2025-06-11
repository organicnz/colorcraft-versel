import * as React from "react";

import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
  glassVariant?: "light" | "dark" | "primary" | "accent";
  glassIntensity?: "subtle" | "medium" | "strong";
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    { className, glass = false, glassVariant = "light", glassIntensity = "medium", ...props },
    ref
  ) => (
    <div
      ref={ref}
      className={cn(
        glass
          ? cn(
              // Glassmorphism styles
              "relative overflow-hidden rounded-lg border backdrop-blur-md shadow-glass transition-all duration-300 hover:shadow-glass-heavy",
              // Glass background variants
              glassVariant === "light" &&
                glassIntensity === "subtle" &&
                "bg-white/20 dark:bg-white/10 border-white/20 dark:border-white/10",
              glassVariant === "light" &&
                glassIntensity === "medium" &&
                "bg-white/30 dark:bg-white/15 border-white/20 dark:border-white/10",
              glassVariant === "light" &&
                glassIntensity === "strong" &&
                "bg-white/50 dark:bg-white/25 border-white/30 dark:border-white/15",
              glassVariant === "dark" &&
                glassIntensity === "subtle" &&
                "bg-black/20 dark:bg-black/30 border-black/20 dark:border-black/30",
              glassVariant === "dark" &&
                glassIntensity === "medium" &&
                "bg-black/30 dark:bg-black/40 border-black/20 dark:border-black/30",
              glassVariant === "dark" &&
                glassIntensity === "strong" &&
                "bg-black/50 dark:bg-black/60 border-black/30 dark:border-black/40",
              glassVariant === "primary" &&
                "bg-primary-100/30 dark:bg-primary-900/20 border-primary-200/50 dark:border-primary-700/30",
              glassVariant === "accent" &&
                "bg-accent-100/30 dark:bg-accent-900/20 border-accent-200/50 dark:border-accent-700/30"
            )
          : "rounded-lg border bg-card text-card-foreground shadow-sm",
        className
      )}
      {...props}
    >
      {glass && (
        <>
          {/* Gradient overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent dark:from-white/2 pointer-events-none" />
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
        </>
      )}
      {props.children}
    </div>
  )
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  )
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("text-2xl font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  )
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
  )
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
