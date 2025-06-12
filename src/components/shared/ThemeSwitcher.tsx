"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Monitor, Moon, Sun } from "lucide-react";

export default function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, systemTheme } = useTheme();

  // Wait for the page to be fully hydrated before showing the theme switcher
  useEffect(() => {
    const checkReady = () => {
      if (document.documentElement.classList.contains("ready") || window.__antiFlashComplete) {
        setMounted(true);
      } else {
        setTimeout(checkReady, 50);
      }
    };

    // Start checking after a brief delay to allow the anti-flash script to run
    setTimeout(checkReady, 16);
  }, []);

  // Handle theme cycling: light -> dark -> system -> light...
  const handleThemeChange = () => {
    let newTheme: string;

    if (theme === "light") {
      newTheme = "dark";
    } else if (theme === "dark") {
      newTheme = "system";
    } else {
      newTheme = "light";
    }

    // Temporarily disable transitions to prevent flash during theme change
    document.documentElement.classList.remove("transitions-enabled");

    setTheme(newTheme);

    // Re-enable transitions after theme is applied
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.documentElement.classList.add("transitions-enabled");
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
          visibility: "visible",
          pointerEvents: "none",
          transition: "none",
        }}
      >
        <div className="w-4 h-4 rounded-full bg-slate-400 dark:bg-slate-500" />
      </button>
    );
  }

  // Determine which icon to show and what the next theme will be
  const getCurrentIcon = () => {
    if (theme === "system") {
      return <Monitor className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
    } else if (theme === "dark") {
      return <Moon className="w-5 h-5 text-slate-700 dark:text-yellow-500" />;
    } else {
      return <Sun className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getNextThemeLabel = () => {
    if (theme === "light") return "Switch to dark mode";
    if (theme === "dark") return "Switch to system mode";
    return "Switch to light mode";
  };

  const resolvedTheme = theme === "system" ? systemTheme : theme;

  return (
    <button
      onClick={handleThemeChange}
      className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group
                 glass-modern hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-600"
      aria-label={getNextThemeLabel()}
      title={getNextThemeLabel()}
    >
      <span className="sr-only">
        {getNextThemeLabel()}
      </span>
      {getCurrentIcon()}

      {/* Tooltip */}
      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2
                     bg-slate-800 text-slate-100 text-xs py-1 px-3 rounded-md
                     opacity-0 group-hover:opacity-100 transition-opacity duration-300
                     pointer-events-none whitespace-nowrap z-50">
        Switch to {theme === 'light' ? 'Dark' : theme === 'dark' ? 'System' : 'Light'}
        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0
                        border-x-4 border-x-transparent
                        border-t-4 border-t-slate-800"></div>
      </div>
    </button>
  );
}
