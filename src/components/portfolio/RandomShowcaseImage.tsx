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
  const [error, setError] = useState(false);

  useEffect(() => {
    console.log('RandomShowcaseImage for:', portfolioId);
    console.log('afterImages:', afterImages);
    console.log('afterImages type:', typeof afterImages, 'isArray:', Array.isArray(afterImages));

    // Use database JSONB array if available
    if (afterImages && Array.isArray(afterImages) && afterImages.length > 0) {
      console.log('Using afterImages from database, length:', afterImages.length);

      // Filter out any invalid URLs
      const validImages = afterImages.filter(img => img && typeof img === 'string' && img.length > 0);
      console.log('Valid images after filtering:', validImages.length);

      if (validImages.length > 0) {
        const randomIndex = Math.floor(Math.random() * validImages.length);
        const randomImage = validImages[randomIndex];
        console.log('Selected random image:', randomImage);
        setShowcaseImage(randomImage);
        setIsLoading(false);
        return;
      }
    }

    console.log('No valid afterImages found, using fallback:', fallbackImage);
    // Use fallback image if no valid images found
    setShowcaseImage(fallbackImage);
    setIsLoading(false);
  }, [portfolioId, afterImages, fallbackImage]);

  if (isLoading) {
    return (
      <div className={`${className} animate-pulse bg-muted flex items-center justify-center`}>
        <div className="w-8 h-8 bg-muted-foreground/20 rounded"></div>
      </div>
    );
  }

  return (
    <Image
      src={showcaseImage || fallbackImage}
      alt={`${title} - Showcase image`}
      width={width}
      height={height}
      className={className}
      sizes={sizes}
      priority={priority}
      onError={() => {
        console.error('Image failed to load:', showcaseImage);
        if (!error) {
          setError(true);
          setShowcaseImage(fallbackImage);
        }
      }}
    />
  );
} 