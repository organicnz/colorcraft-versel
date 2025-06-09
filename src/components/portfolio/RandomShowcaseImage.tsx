"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getRandomAfterImage } from '@/utils/portfolio-images';

interface RandomShowcaseImageProps {
  portfolioId: string;
  title: string;
  afterImages?: string[];  // Database array populated by edge function
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
  afterImages,  // Database array populated by edge function
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
    async function loadRandomImage() {
      try {
        setIsLoading(true);

        // Priority 1: Use database array if available (populated by edge function)
        if (afterImages && afterImages.length > 0) {
          // Filter out any invalid URLs
          const validImages = afterImages.filter(img => img && img.length > 0);
          if (validImages.length > 0) {
            const randomIndex = Math.floor(Math.random() * validImages.length);
            const randomImage = validImages[randomIndex];
            setShowcaseImage(randomImage);
            setIsLoading(false);
            return;
          }
        }

        // Priority 2: Fallback to storage API lookup (slower)
        const randomImage = await getRandomAfterImage(portfolioId);
        
        if (randomImage) {
          setShowcaseImage(randomImage);
        } else {
          // Priority 3: Use fallback image
          setShowcaseImage(fallbackImage);
        }
      } catch (err) {
        console.error('Error loading random showcase image:', err);
        setError(true);
        setShowcaseImage(fallbackImage);
      } finally {
        setIsLoading(false);
      }
    }

    loadRandomImage();
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
        if (!error) {
          setError(true);
          setShowcaseImage(fallbackImage);
        }
      }}
    />
  );
} 