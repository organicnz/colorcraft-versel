"use client";

import Image from 'next/image'
import { useState } from 'react'

export default function ImageTest() {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Image Loading Test</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">1. Standard HTML Image Tag</h2>
        <img 
          src="/images/hero-house.png" 
          alt="House - standard" 
          width={600} 
          height={400}
          className="border border-gray-300" 
          onLoad={() => console.log("Standard image loaded")}
          onError={() => console.log("Standard image error")}
        />
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">2. Next.js Image Component</h2>
        <div className="relative w-full max-w-3xl h-[400px] border border-gray-300">
          <Image
            src="/images/hero-house.png"
            alt="House - Next.js Image"
            fill
            className="object-cover"
            onLoadingComplete={() => {
              console.log("Next.js Image loaded");
              setImageLoaded(true);
            }}
            onError={() => {
              console.log("Next.js Image error");
              setImgError(true);
            }}
          />
        </div>
        <p className="mt-2">
          Status: {imageLoaded ? "✅ Loaded" : imgError ? "❌ Error" : "⏳ Loading..."}
        </p>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">3. Direct Image Path</h2>
        <img 
          src="/Users/organic/dev/work/colorcraft/public/images/hero-house.png" 
          alt="House - direct path" 
          width={600} 
          height={400}
          className="border border-gray-300" 
        />
        <p className="mt-2 text-sm text-gray-500">
          Note: This method typically won't work in Next.js, as it expects all public assets to be served from the public directory without including "public" in the path.
        </p>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">4. Reference Image (hero-furniture.png)</h2>
        <div className="relative w-full max-w-3xl h-[400px] border border-gray-300">
          <Image
            src="/images/hero-furniture.png"
            alt="Furniture - reference"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
} 