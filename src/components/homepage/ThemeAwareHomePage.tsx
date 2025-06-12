"use client";

import React, { useState, useEffect } from "react";

interface ThemeAwareHomePageProps {
  modernPage: React.ReactNode;
  classicPage: React.ReactNode;
}

export function ThemeAwareHomePage({ modernPage, classicPage }: ThemeAwareHomePageProps) {
  const [useModern, setUseModern] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const modernThemeEnabled = localStorage.getItem("colorcraft-homepage-modern") !== "false";
    setUseModern(modernThemeEnabled);
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // Return a loader or null to prevent hydration mismatch
    return null;
  }

  return useModern ? <>{modernPage}</> : <>{classicPage}</>;
} 