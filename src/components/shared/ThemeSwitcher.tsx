"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

export default function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // Wait for the page to be fully hydrated before showing the theme switcher
  useEffect(() => {
    // Wait for anti-flash system or timeout
    const checkReady = () => {
      if (document.documentElement.classList.contains('ready') || window.__antiFlashComplete) {
        setMounted(true);
      } else {
        setTimeout(checkReady, 50);
      }
    };
    
    // Start checking after a brief delay to allow the anti-flash script to run
    setTimeout(checkReady, 16);
  }, []);

  // Handle theme change with smooth transition
  const handleThemeChange = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    
    // Temporarily disable transitions to prevent flash
    document.documentElement.classList.remove('transitions-enabled');
    
    setTheme(newTheme);
    
    // Re-enable transitions after theme is applied
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.documentElement.classList.add('transitions-enabled');
      });
    });
  };

  // Show a stable placeholder during hydration
  if (!mounted) {
    return (
      <button
        className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center opacity-50"
        disabled
        aria-label="Loading theme switcher"
        style={{
          visibility: 'visible',
          pointerEvents: 'none',
          transition: 'none'
        }}
      >
        <div className="w-4 h-4 rounded-full bg-slate-400 dark:bg-slate-500" />
      </button>
    );
  }

  const isDark = theme === 'dark';

  return (
    <button
      onClick={handleThemeChange}
      className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 flex items-center justify-center transition-colors duration-200"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
    >
      {isDark ? (
        <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        <svg className="w-5 h-5 text-slate-700" fill="currentColor" viewBox="0 0 20 20">
          <path
            d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"
          />
        </svg>
      )}
    </button>
  );
} 