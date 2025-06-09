"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface RandomShowcaseImageProps {
  portfolioId: string;
  title: string;
  afterImages?: string[];  // JSONB array from database
  fallbackImage?: string;
  className?: string;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
}

export default function RandomShowcaseImage({
  portfolioId,
  title,
  afterImages,
  fallbackImage = '/placeholder-image.jpg',
  className = 'h-full w-full object-cover',
  width = 500,
  height = 500,
  sizes,
  priority = false,
}: RandomShowcaseImageProps) {
  const [showcaseImage, setShowcaseImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setImageError(false);

    // Use database JSONB array if available
    if (afterImages && Array.isArray(afterImages) && afterImages.length > 0) {
      // Filter out any invalid URLs
      const validImages = afterImages.filter(img => img && typeof img === 'string' && img.length > 0);

      if (validImages.length > 0) {
        // Pick a random image from the valid ones
        const randomIndex = Math.floor(Math.random() * validImages.length);
        const selectedImage = validImages[randomIndex];
        setShowcaseImage(selectedImage);
        setIsLoading(false);
        return;
      }
    }

    // Fallback to placeholder
    setShowcaseImage(fallbackImage);
    setIsLoading(false);
  }, [afterImages, fallbackImage]);

  if (isLoading) {
    return (
      <div className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 animate-pulse bg-muted flex items-center justify-center">
        <div className="w-8 h-8 bg-muted-foreground/20 rounded"></div>
      </div>
    );
  }

  if (imageError || !showcaseImage) {
    return (
      <div className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 bg-muted flex items-center justify-center">
        <div className="w-8 h-8 bg-muted-foreground/20 rounded"></div>
      </div>
    );
  }

  return (
    <Image
      src={showcaseImage}
      alt={title}
      width={width}
      height={height}
      className={`${className} transition-transform duration-300 group-hover:scale-105`}
      sizes={sizes}
      priority={priority}
      onError={() => setImageError(true)}
    />
  );
} 