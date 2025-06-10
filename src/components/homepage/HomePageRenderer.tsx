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
  const [isModern, setIsModern] = useState<boolean | null>(null); // Start with null to prevent hydration mismatch

  useEffect(() => {
    // Only run on client side to prevent hydration mismatch
    const saved = localStorage.getItem('colorcraft-homepage-modern');
    if (saved === 'false') {
      setIsModern(false);
    } else {
      setIsModern(true); // Default to modern if no preference or if saved as 'true'
    }
  }, []);

  // During SSR and initial hydration, always render modern (default)
  // This prevents hydration mismatches
  if (isModern === null) {
    return modernHomepage;
  }

  // After hydration, render based on user preference
  return isModern ? modernHomepage : classicHomepage;
} 