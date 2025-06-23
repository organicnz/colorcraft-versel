"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Monitor, Moon, Sun } from "lucide-react";

export default function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, systemTheme } = useTheme();

  // Improved hydration handling
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle theme cycling: light -> dark -> system -> light...
  const handleThemeChange = () => {
    if (!mounted) return;

    let newTheme: string;

    if (theme === "light") {
      newTheme = "dark";
    } else if (theme === "dark") {
      newTheme = "system";
    } else {
      newTheme = "light";
    }

    // Apply theme change
    setTheme(newTheme);
  };

  // Determine which icon to show based on current theme
  const getCurrentIcon = () => {
    if (theme === "system") {
      const resolvedTheme = systemTheme || "light";
      return resolvedTheme === "dark" ? (
        <Monitor className="w-5 h-5 text-yellow-400" />
      ) : (
        <Monitor className="w-5 h-5 text-blue-600" />
      );
    } else if (theme === "dark") {
      return <Moon className="w-5 h-5 text-yellow-500" />;
    } else {
      return <Sun className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getNextThemeLabel = () => {
    if (theme === "light") return "Switch to dark mode";
    if (theme === "dark") return "Switch to system mode";
    return "Switch to light mode";
  };

  return (
    <button
      onClick={handleThemeChange}
      className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group
                 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
      aria-label={getNextThemeLabel()}
      title={getNextThemeLabel()}
    >
      <span className="sr-only">{getNextThemeLabel()}</span>
      {getCurrentIcon()}

      {/* Tooltip */}
      <div
        className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2
                     bg-slate-800 text-slate-100 text-xs py-1 px-3 rounded-md
                     opacity-0 group-hover:opacity-100 transition-opacity duration-300
                     pointer-events-none whitespace-nowrap z-50"
      >
        Switch to {theme === "light" ? "Dark" : theme === "dark" ? "System" : "Light"}
        <div
          className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0
                        border-x-4 border-x-transparent
                        border-t-4 border-t-slate-800"
        ></div>
      </div>
    </button>
  );
}
