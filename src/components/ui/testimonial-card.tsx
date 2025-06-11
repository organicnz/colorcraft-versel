import React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Quote } from "lucide-react";

interface TestimonialCardProps extends React.HTMLAttributes<HTMLDivElement> {
  quote: string;
  name: string;
  title?: string;
  location?: string;
  imageSrc?: string;
  variant?: "default" | "minimal" | "featured";
}

export function TestimonialCard({
  quote,
  name,
  title,
  location,
  imageSrc,
  variant = "default",
  className,
  ...props
}: TestimonialCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl overflow-hidden relative",
        variant === "featured"
          ? "bg-gradient-to-br from-primary-500/10 to-secondary-500/10 dark:from-primary-500/20 dark:to-secondary-500/20 backdrop-blur-sm border border-white/20 dark:border-neutral-800/30 shadow-xl"
          : variant === "minimal"
            ? "bg-transparent"
            : "bg-white/30 dark:bg-white/10 backdrop-blur-md shadow-glass border border-white/30 dark:border-white/10 transition-all duration-300 hover:bg-white/40 hover:shadow-glass-heavy",
        className
      )}
      {...props}
    >
      {variant === "featured" && (
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-24 h-24 opacity-10 rounded-full bg-accent-500 blur-xl" />
      )}

      {(variant === "default" || variant === "featured") && (
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent dark:from-white/5 pointer-events-none rounded-xl" />
      )}

      <div className={cn("p-6 md:p-8", variant !== "minimal" && "relative z-10")}>
        <Quote
          className={cn(
            "h-8 w-8 mb-4 opacity-20",
            variant === "featured" ? "text-primary-500" : "text-neutral-400"
          )}
        />

        <p className="text-lg mb-6 italic text-neutral-700 dark:text-neutral-300">{quote}</p>

        <div className="flex items-center">
          {imageSrc && (
            <div className="mr-4 flex-shrink-0">
              <Image
                src={imageSrc}
                alt={name}
                width={56}
                height={56}
                className="rounded-full object-cover border-2 border-white dark:border-neutral-700"
              />
            </div>
          )}

          <div>
            <h4 className="font-semibold text-primary-800 dark:text-primary-300">{name}</h4>
            {(title || location) && (
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                {title && <span>{title}</span>}
                {title && location && <span> • </span>}
                {location && <span>{location}</span>}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
