"use client";

import { useState, useEffect } from "react";

interface HomePageRendererProps {
  classicHomepage: React.ReactNode;
  modernHomepage: React.ReactNode;
}

export default function HomePageRenderer({
  classicHomepage,
  modernHomepage
}: HomePageRendererProps) {
  const [isModern, setIsModern] = useState(true); // Default to modern
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    // Load saved preference from localStorage
    const saved = localStorage.getItem('colorcraft-homepage-modern');
    if (saved === 'false') {
      setIsModern(false);
    } else {
      setIsModern(true); // Default to modern if no preference or if saved as 'true'
    }
    setHasLoaded(true);
  }, []);

  // Show loading state briefly to prevent flash
  if (!hasLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="text-slate-600 animate-pulse">Loading...</p>
        </div>
      </div>
    );
  }

  // Render the appropriate homepage based on user preference
  return isModern ? modernHomepage : classicHomepage;
} 