"use client";

import { useState, useEffect, useMemo } from 'react';
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
  className = 'w-full h-full object-cover',
  width = 500,
  height = 500,
  sizes,
  priority = false,
}: RandomShowcaseImageProps) {
  // Memoize the selected image to prevent unnecessary re-renders
  const selectedImage = useMemo(() => {
    if (afterImages && Array.isArray(afterImages) && afterImages.length > 0) {
      // Filter out any invalid URLs
      const validImages = afterImages.filter(img => img && typeof img === 'string' && img.trim() !== '');

      if (validImages.length > 0) {
        // Use portfolio ID as seed for consistent randomization per card
        const seed = portfolioId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const randomIndex = seed % validImages.length;
        return validImages[randomIndex];
      }
    }
    return fallbackImage;
  }, [afterImages, fallbackImage, portfolioId]);

  const [currentImage, setCurrentImage] = useState<string>(selectedImage);
  const [imageError, setImageError] = useState(false);

  // Update current image when selected image changes
  useEffect(() => {
    if (!imageError) {
      setCurrentImage(selectedImage);
    }
  }, [selectedImage, imageError]);

  const handleImageError = () => {
    setImageError(true);
    setCurrentImage(fallbackImage);
  };

  const handleImageLoad = () => {
    setImageError(false);
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-gray-100 dark:bg-gray-800">
      <Image
        src={currentImage}
        alt={title}
        fill
        className={className}
        sizes={sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
        priority={priority}
        onError={handleImageError}
        onLoad={handleImageLoad}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
        style={{
          objectFit: 'cover',
          objectPosition: 'center',
        }}
      />
    </div>
  );
} 