"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getRandomAfterImage } from '@/utils/portfolio-images';

interface RandomShowcaseImageProps {
  portfolioId: string;
  title: string;
  afterImages?: string[];  // Optional: use database array if available
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
  afterImages,  // New prop for database array
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

        // If afterImages array is provided from database, use it
        if (afterImages && afterImages.length > 0) {
          const randomIndex = Math.floor(Math.random() * afterImages.length);
          const randomImage = afterImages[randomIndex];
          setShowcaseImage(randomImage);
          return;
        }

        // Fallback to storage lookup if no database array
        const randomImage = await getRandomAfterImage(portfolioId);
        
        if (randomImage) {
          setShowcaseImage(randomImage);
        } else {
          // No images found in storage, use fallback
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