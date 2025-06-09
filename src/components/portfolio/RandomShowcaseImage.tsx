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
  const [showcaseImage, setShowcaseImage] = useState<string>(fallbackImage);
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

    if (afterImages && Array.isArray(afterImages) && afterImages.length > 0) {
      // Filter out any invalid URLs
      const validImages = afterImages.filter(img => img && typeof img === 'string' && img.trim() !== '');

      if (validImages.length > 0) {
        // Select a random image
        const randomIndex = Math.floor(Math.random() * validImages.length);
        const selectedImage = validImages[randomIndex];

        console.log('Selected image URL:', selectedImage);
        setShowcaseImage(selectedImage);
        return;
      }
    }

    console.log('Using fallback image:', fallbackImage);
    setShowcaseImage(fallbackImage);
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

  return (
    <div className="relative w-full h-full">
      <Image
        src={showcaseImage}
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