"use client";

import Image from "next/image";
import { useState } from "react";

export default function ImageTestPage() {
  const testImageUrl =
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&auto=format&q=80";

  const sampleProject = {
    id: "sample-1",
    title: "Victorian Dresser Revival",
    description: "Antique restoration with modern flair",
    material: "Oak with chalk paint finish",
    image: testImageUrl,
    price: "Contact for pricing",
  };

  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold mb-8">Image Test Page</h1>

      <div className="space-y-8">
        {/* Test 1: Direct image URL */}
        <div className="border p-4 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Test 1: Direct Image URL</h2>
          <p className="mb-4">Image URL: {testImageUrl}</p>
          <div className="relative w-80 h-60">
            <Image src={testImageUrl} alt="Test image" fill className="object-cover rounded-lg" />
          </div>
        </div>

        {/* Test 2: Using sample project data */}
        <div className="border p-4 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Test 2: Sample Project Data</h2>
          <p className="mb-4">Project: {sampleProject.title}</p>
          <p className="mb-4">Image from project data: {sampleProject.image}</p>
          <div className="relative w-80 h-60">
            <Image
              src={sampleProject.image}
              alt={sampleProject.title}
              fill
              className="object-cover rounded-lg"
            />
          </div>
        </div>

        {/* Test 3: Similar to ModernHomePage component */}
        <div className="border p-4 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Test 3: ModernHomePage Style</h2>
          <div className="w-80 h-96 flex flex-col">
            <div className="relative overflow-hidden rounded-3xl bg-white shadow-lg h-full flex flex-col">
              {/* Project Image - Fixed Height */}
              <div className="relative h-48 overflow-hidden flex-shrink-0">
                <Image
                  src={
                    sampleProject.image ||
                    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&auto=format&q=80"
                  }
                  alt={sampleProject.title || "Furniture transformation"}
                  fill
                  className="object-cover transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
              </div>

              {/* Project Details */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <h3 className="font-bold text-lg text-slate-900">{sampleProject.title}</h3>
                  <p className="text-slate-600 text-sm">{sampleProject.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Test 4: Regular img tag for comparison */}
        <div className="border p-4 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Test 4: Regular img tag</h2>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={testImageUrl}
            alt="Test with regular img tag"
            className="w-80 h-60 object-cover rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
