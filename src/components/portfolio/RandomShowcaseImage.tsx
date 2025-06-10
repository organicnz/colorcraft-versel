"use client";

import { useMemo, useState } from 'react';
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
  // This ensures consistent image selection across server and client
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

  // Simple error state for fallback handling
  const [hasError, setHasError] = useState(false);
  
  const handleImageError = () => {
    setHasError(true);
  };

  // Use the selected image or fallback if there's an error
  const imageToShow = hasError ? fallbackImage : selectedImage;

  return (
    <div className="relative w-full h-full overflow-hidden bg-slate-100 dark:bg-slate-800">
      <Image
        src={imageToShow}
        alt={title}
        fill
        className={className}
        sizes={sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
        priority={priority}
        onError={handleImageError}
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