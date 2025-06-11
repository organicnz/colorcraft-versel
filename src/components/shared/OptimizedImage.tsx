"use client";

import Image from "next/image";
import { useState, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
  quality?: number;
  placeholder?: "blur" | "empty";
  sizes?: string;
  className?: string;
  fallbackSrc?: string;
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
}

const OptimizedImage = forwardRef<HTMLImageElement, OptimizedImageProps>(
  (
    {
      src,
      alt,
      width,
      height,
      fill = false,
      priority = false,
      quality = 75,
      placeholder = "empty",
      sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
      className,
      fallbackSrc = "/images/placeholder.jpg",
      blurDataURL,
      onLoad,
      onError,
      ...props
    },
    ref
  ) => {
    const [imageSrc, setImageSrc] = useState(src);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    const handleLoad = () => {
      setIsLoading(false);
      onLoad?.();
    };

    const handleError = () => {
      setHasError(true);
      setIsLoading(false);
      setImageSrc(fallbackSrc);
      onError?.();
    };

    // Generate blur data URL if none provided
    const defaultBlurDataURL =
      blurDataURL ||
      `data:image/svg+xml;base64,${Buffer.from(
        `<svg width="${width || 400}" height="${height || 300}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#f3f4f6;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#e5e7eb;stop-opacity:1" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#grad)" />
        </svg>`
      ).toString("base64")}`;

    const imageProps = {
      src: imageSrc,
      alt,
      quality,
      priority,
      onLoad: handleLoad,
      onError: handleError,
      className: cn(
        "transition-opacity duration-300",
        isLoading && "opacity-0",
        !isLoading && "opacity-100",
        className
      ),
      ...(placeholder === "blur" && {
        placeholder: "blur" as const,
        blurDataURL: defaultBlurDataURL,
      }),
      ...props,
    };

    if (fill) {
      return (
        <div className="relative overflow-hidden">
          <Image {...imageProps} fill sizes={sizes} style={{ objectFit: "cover" }} />
          {isLoading && (
            <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 to-gray-300" />
          )}
        </div>
      );
    }

    return (
      <div className="relative">
        <Image {...imageProps} width={width!} height={height!} sizes={sizes} />
        {isLoading && (
          <div
            className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 to-gray-300 rounded"
            style={{ width, height }}
          />
        )}
      </div>
    );
  }
);

OptimizedImage.displayName = "OptimizedImage";

export default OptimizedImage;
