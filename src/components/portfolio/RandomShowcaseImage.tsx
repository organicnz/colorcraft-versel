"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface RandomShowcaseImageProps {
  portfolioId: string;
  title: string;
  afterImages?: string[];  // Now receives full URLs from server
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
    // Debug: Log what we're receiving
    console.log('RandomShowcaseImage Debug:', {
      portfolioId,
      afterImages,
      afterImagesType: typeof afterImages,
      afterImagesLength: afterImages?.length,
      isArray: Array.isArray(afterImages)
    });

    if (!afterImages || !Array.isArray(afterImages) || afterImages.length === 0) {
      console.log('No valid afterImages, using fallback');
      setShowcaseImage(fallbackImage);
      setIsLoading(false);
      return;
    }

    // Filter out any invalid URLs
    const validImages = afterImages.filter(img => img && typeof img === 'string' && img.trim() !== '');

    if (validImages.length === 0) {
      console.log('No valid image URLs found, using fallback');
      setShowcaseImage(fallbackImage);
      setIsLoading(false);
      return;
    }

    // Select a random image
    const randomIndex = Math.floor(Math.random() * validImages.length);
    const selectedImage = validImages[randomIndex];

    console.log('Selected image URL:', selectedImage);
    setShowcaseImage(selectedImage);
    setIsLoading(false);
  }, [afterImages, fallbackImage, portfolioId]);

  const handleImageError = () => {
    console.log('Image failed to load:', showcaseImage);
    setImageError(true);
    setShowcaseImage(fallbackImage);
  };

  const handleImageLoad = () => {
    console.log('Image loaded successfully:', showcaseImage);
    setImageError(false);
  };

  if (isLoading) {
    return (
      <div className={`${className} animate-pulse bg-muted flex items-center justify-center`}>
        <div className="w-8 h-8 bg-muted-foreground/20 rounded"></div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {/* Debug info - temporary */}
      <div className="absolute top-0 left-0 z-50 bg-black/80 text-white text-xs p-1 max-w-[200px] truncate">
        {showcaseImage}
      </div>

      <Image
        src={showcaseImage || fallbackImage}
        alt={title}
        width={width}
        height={height}
        className={className}
        sizes={sizes}
        priority={priority}
        onError={handleImageError}
        onLoad={handleImageLoad}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
      />
    </div>
  );
} 