"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Palette, Sparkles, Monitor } from "lucide-react";

interface ThemePreferenceProps {
  onPreferenceChange?: (preference: string) => void;
}

export default function ThemePreference({ onPreferenceChange }: ThemePreferenceProps) {
  const [homepageStyle, setHomepageStyle] = useState("modern"); // Default to modern to match server render

  useEffect(() => {
    // Load saved preference from localStorage on client side only
    const saved = localStorage.getItem("colorcraft-homepage-modern");
    if (saved === "false") {
      setHomepageStyle("classic");
    } else {
      setHomepageStyle("modern");
    }
  }, []);

  const handleStyleChange = (value: string) => {
    setHomepageStyle(value);

    // Save to localStorage
    localStorage.setItem("colorcraft-homepage-modern", value === "modern" ? "true" : "false");

    // Call callback if provided
    if (onPreferenceChange) {
      onPreferenceChange(value);
    }

    // Optional: Show a subtle notification instead of reloading
    // This provides better UX than a jarring page reload
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Homepage Theme
        </CardTitle>
        <CardDescription>
          Choose your preferred homepage design style. Changes will apply on your next visit to the
          homepage.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup value={homepageStyle} onValueChange={handleStyleChange}>
          {/* Modern Theme Option */}
          <div className="flex items-start space-x-3 p-4 rounded-lg border hover:bg-gray-50 transition-colors">
            <RadioGroupItem value="modern" id="modern" className="mt-1" />
            <div className="flex-1 space-y-2">
              <Label
                htmlFor="modern"
                className="text-base font-medium cursor-pointer flex items-center gap-2"
              >
                <Sparkles className="h-4 w-4 text-purple-600" />
                Modern Design
                <Badge variant="secondary" className="text-xs">
                  Recommended
                </Badge>
              </Label>
              <p className="text-sm text-gray-600">
                Clean, contemporary layout with glassmorphic effects, smooth animations, and modern
                UI components.
              </p>
              <div className="flex gap-2 text-xs text-gray-500">
                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                  Glassmorphic
                </span>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full">Animated</span>
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full">
                  Responsive
                </span>
              </div>
            </div>
          </div>

          {/* Classic Theme Option */}
          <div className="flex items-start space-x-3 p-4 rounded-lg border hover:bg-gray-50 transition-colors">
            <RadioGroupItem value="classic" id="classic" className="mt-1" />
            <div className="flex-1 space-y-2">
              <Label
                htmlFor="classic"
                className="text-base font-medium cursor-pointer flex items-center gap-2"
              >
                <Monitor className="h-4 w-4 text-slate-600" />
                Classic Design
              </Label>
              <p className="text-sm text-gray-600">
                Traditional layout with clean cards, straightforward navigation, and familiar design
                patterns.
              </p>
              <div className="flex gap-2 text-xs text-gray-500">
                <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-full">
                  Traditional
                </span>
                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full">Minimal</span>
                <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full">
                  Accessible
                </span>
              </div>
            </div>
          </div>
        </RadioGroup>

        {/* Preview Section */}
        <div className="pt-4 border-t">
          <Label className="text-sm font-medium text-gray-700">Current Selection:</Label>
          <div className="mt-2 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {homepageStyle === "modern" ? (
                  <>
                    <Sparkles className="h-4 w-4 text-purple-600" />
                    <span className="font-medium">Modern Design</span>
                  </>
                ) : (
                  <>
                    <Monitor className="h-4 w-4 text-slate-600" />
                    <span className="font-medium">Classic Design</span>
                  </>
                )}
              </div>
              <Badge variant={homepageStyle === "modern" ? "default" : "secondary"}>Active</Badge>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {homepageStyle === "modern"
                ? "Enjoy the modern experience with smooth animations and glassmorphic effects."
                : "Experience the clean, traditional design with straightforward navigation."}
            </p>
          </div>
        </div>

        {/* Info Note */}
        <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2">
            <Monitor className="h-3 w-3 text-blue-600" />
            <span className="font-medium text-blue-700">Note:</span>
          </div>
          <p className="mt-1 text-blue-600">
            Theme changes are saved automatically and will apply when you navigate to the homepage.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
