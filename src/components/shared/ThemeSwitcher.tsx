"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

export default function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, systemTheme } = useTheme();

  // useEffect only runs on the client, so we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  // Show a stable placeholder during SSR/hydration
  if (!mounted) {
    return (
      <button 
        className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center opacity-50"
        disabled
        aria-label="Loading theme switcher"
      >
        <div className="w-4 h-4 rounded-full bg-slate-400 dark:bg-slate-400" />
      </button>
    );
  }

  const currentTheme = theme === 'system' ? systemTheme : theme;

  return (
    <button
      aria-label="Toggle Dark Mode"
      type="button"
      className="w-10 h-10 p-3 rounded-full bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors duration-200"
      onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
    >
      {/* Sun icon */}
      {currentTheme === "dark" ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className="w-4 h-4 text-yellow-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ) : (
        // Moon icon
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className="w-4 h-4 text-slate-700 dark:text-slate-300"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      )}
    </button>
  );
} 