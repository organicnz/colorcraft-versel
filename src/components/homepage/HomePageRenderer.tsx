"use client";

import { useState, useEffect } from "react";

interface HomePageRendererProps {
  classicHomepage: React.ReactNode;
  modernHomepage: React.ReactNode;
}

export default function HomePageRenderer({
  classicHomepage,
  modernHomepage,
}: HomePageRendererProps) {
  const [isModern, setIsModern] = useState(true); // Default to modern to match server
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Only run on client side after hydration
    const saved = localStorage.getItem("colorcraft-homepage-modern");
    if (saved === "false") {
      setIsModern(false);
    }
    // Set hydrated to true after the first render
    setIsHydrated(true);
  }, []);

  // Prevent flash by only showing user preference after hydration with minimal layout shift
  if (!isHydrated) {
    return <div style={{ minHeight: "100vh", opacity: 1 }}>{modernHomepage}</div>;
  }

  return (
    <div style={{ minHeight: "100vh", opacity: 1 }}>
      {isModern ? modernHomepage : classicHomepage}
    </div>
  );
}
