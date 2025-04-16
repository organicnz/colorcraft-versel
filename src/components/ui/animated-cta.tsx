import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { ButtonHTMLAttributes } from "react";

interface AnimatedCtaProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent";
  showArrow?: boolean;
  glowEffect?: boolean;
  children: React.ReactNode;
  size?: "default" | "sm" | "lg" | "icon";
}

export function AnimatedCta({
  variant = "primary",
  showArrow = true,
  glowEffect = true,
  className,
  children,
  size = "default",
  ...props
}: AnimatedCtaProps) {
  // Define gradient based on variant
  const getGradient = () => {
    switch (variant) {
      case "secondary":
        return "from-secondary-500 to-secondary-600";
      case "accent":
        return "from-accent-500 to-accent-600";
      default:
        return "from-primary-500 to-primary-600";
    }
  };

  // Define hover gradient
  const getHoverGradient = () => {
    switch (variant) {
      case "secondary":
        return "group-hover:from-secondary-600 group-hover:to-secondary-700";
      case "accent":
        return "group-hover:from-accent-600 group-hover:to-accent-700";
      default:
        return "group-hover:from-primary-600 group-hover:to-primary-700";
    }
  };

  // Define glow effect if enabled
  const getGlowEffect = () => {
    if (!glowEffect) return "";
    
    switch (variant) {
      case "secondary":
        return "after:bg-secondary-500/20";
      case "accent":
        return "after:bg-accent-500/20";
      default:
        return "after:bg-primary-500/20";
    }
  };

  return (
    <Button
      className={cn(
        "group relative overflow-hidden font-medium transition-all duration-300 ease-out",
        "bg-gradient-to-r",
        getGradient(),
        getHoverGradient(),
        glowEffect && "after:absolute after:inset-0 after:z-[-1] after:opacity-0 after:transition-opacity after:duration-500 group-hover:after:opacity-100 after:blur-xl",
        getGlowEffect(),
        className
      )}
      size={size}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">
        {children}
        {showArrow && (
          <motion.span
            initial={{ x: 0 }}
            animate={{ x: [0, 5, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
              repeatDelay: 1,
            }}
          >
            <ArrowRight className="ml-1 h-4 w-4" />
          </motion.span>
        )}
      </span>
    </Button>
  );
}
