"use client";

import Image from 'next/image';
import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  fill?: boolean;
  sizes?: string;
  onLoad?: () => void;
  onError?: () => void;
  fallbackSrc?: string;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  quality = 75,
  fill = false,
  sizes,
  onLoad,
  onError,
  fallbackSrc = '/images/placeholder.jpg',
  placeholder = 'empty',
  blurDataURL,
  ...props
}: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setHasError(true);
    setImgSrc(fallbackSrc);
    onError?.();
  }, [fallbackSrc, onError]);

  // Generate responsive sizes if not provided
  const responsiveSizes = sizes || (
    fill 
      ? '100vw'
      : '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
  );

  // Auto-generate blur placeholder for better loading experience
  const placeholderDataURL = blurDataURL || (
    placeholder === 'blur' 
      ? `data:image/svg+xml;base64,${Buffer.from(
          `<svg width="${width || 400}" height="${height || 300}" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="#f3f4f6"/>
            <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" 
                  font-family="system-ui" font-size="14" fill="#9ca3af">
              Loading...
            </text>
          </svg>`
        ).toString('base64')}`
      : undefined
  );

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Loading skeleton */}
      {!isLoaded && (
        <div 
          className={cn(
            'absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center',
            fill ? 'w-full h-full' : ''
          )}
          style={!fill ? { width, height } : undefined}
        >
          <div className="text-gray-400 text-sm">Loading...</div>
        </div>
      )}

      <Image
        src={imgSrc}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        sizes={responsiveSizes}
        priority={priority}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={placeholderDataURL}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          'transition-opacity duration-300',
          isLoaded ? 'opacity-100' : 'opacity-0',
          hasError && 'filter grayscale'
        )}
        {...props}
      />

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <svg 
              className="w-8 h-8 mx-auto mb-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
              />
            </svg>
            <p className="text-xs">Image failed to load</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Gallery component for optimized image grids
interface ImageGalleryProps {
  images: Array<{
    src: string;
    alt: string;
    caption?: string;
  }>;
  columns?: number;
  aspectRatio?: 'square' | 'landscape' | 'portrait';
  className?: string;
}

export function OptimizedImageGallery({
  images,
  columns = 3,
  aspectRatio = 'landscape',
  className
}: ImageGalleryProps) {
  const aspectRatioClasses = {
    square: 'aspect-square',
    landscape: 'aspect-video',
    portrait: 'aspect-[3/4]'
  };

  return (
    <div className={cn(
      'grid gap-4',
      `grid-cols-1 md:grid-cols-${Math.min(columns, 3)} lg:grid-cols-${columns}`,
      className
    )}>
      {images.map((image, index) => (
        <div key={index} className="group relative">
          <div className={cn('relative overflow-hidden rounded-lg', aspectRatioClasses[aspectRatio])}>
            <OptimizedImage
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              placeholder="blur"
            />
          </div>
          {image.caption && (
            <p className="mt-2 text-sm text-gray-600 text-center">{image.caption}</p>
          )}
        </div>
      ))}
    </div>
  );
}

// Hero image component for optimized hero sections
interface HeroImageProps {
  src: string;
  alt: string;
  className?: string;
  overlay?: boolean;
  children?: React.ReactNode;
}

export function OptimizedHeroImage({
  src,
  alt,
  className,
  overlay = true,
  children
}: HeroImageProps) {
  return (
    <div className={cn('relative', className)}>
      <OptimizedImage
        src={src}
        alt={alt}
        fill
        priority
        quality={85}
        sizes="100vw"
        className="object-cover"
        placeholder="blur"
      />
      
      {overlay && (
        <div className="absolute inset-0 bg-black/30" />
      )}
      
      {children && (
        <div className="relative z-10 h-full flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
} 