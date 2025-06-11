"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ThemeSwitcher from "@/components/shared/ThemeSwitcher";

export default function TestAntiFlashPage() {
  const [refreshCount, setRefreshCount] = useState(0);
  const [hydrationTime, setHydrationTime] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // Track hydration time
    const start = performance.now();
    setHydrationTime(start);

    // Get refresh count from localStorage
    const count = parseInt(localStorage.getItem("refresh-count") || "0");
    setRefreshCount(count);
  }, []);

  const handleRefresh = () => {
    if (!isClient) return;
    const newCount = refreshCount + 1;
    localStorage.setItem("refresh-count", newCount.toString());
    window.location.reload();
  };

  const handleNavigateHome = () => {
    if (!isClient) return;
    window.location.href = "/";
  };

  const clearCount = () => {
    if (!isClient) return;
    localStorage.removeItem("refresh-count");
    setRefreshCount(0);
  };

  // Show loading state during SSR
  if (!isClient) {
    return (
      <div className="container mx-auto p-8 max-w-4xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Loading Anti-Flash Test...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Anti-Flash System Test</h1>
          <p className="text-muted-foreground">
            Test the enhanced anti-flash system by refreshing the page or navigating between pages
          </p>
        </div>

        {/* Theme Switcher */}
        <Card>
          <CardHeader>
            <CardTitle>Theme Test</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <span>Switch themes to test flash prevention:</span>
            <ThemeSwitcher />
          </CardContent>
        </Card>

        {/* Refresh Test */}
        <Card>
          <CardHeader>
            <CardTitle>Page Refresh Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Refresh count: <strong>{refreshCount}</strong>
            </p>
            <div className="flex gap-2">
              <Button onClick={handleRefresh} variant="default">
                Refresh Page (Test Flash)
              </Button>
              <Button onClick={clearCount} variant="outline">
                Clear Count
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Test */}
        <Card>
          <CardHeader>
            <CardTitle>Navigation Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Test page navigation flash prevention:</p>
            <div className="flex gap-2">
              <Button onClick={handleNavigateHome} variant="default">
                Navigate to Home
              </Button>
              <Button onClick={() => (window.location.href = "/portfolio")} variant="outline">
                Navigate to Portfolio
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Anti-Flash Complete:</strong>{" "}
                {typeof window !== "undefined" && (window as any).__antiFlashComplete
                  ? "✅ Yes"
                  : "❌ No"}
              </div>
              <div>
                <strong>Theme System:</strong> {isClient ? "✅ Ready" : "❌ Not Ready"}
              </div>
              <div>
                <strong>Transitions Enabled:</strong>{" "}
                {isClient && document.body.classList.contains("transitions-enabled")
                  ? "✅ Yes"
                  : "❌ No"}
              </div>
              <div>
                <strong>Ready Class:</strong>{" "}
                {isClient && document.documentElement.classList.contains("ready")
                  ? "✅ Applied"
                  : "❌ Not Applied"}
              </div>
            </div>
            {hydrationTime && (
              <div className="mt-4 text-xs text-muted-foreground">
                Hydration completed at: {hydrationTime.toFixed(2)}ms
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Test Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Open DevTools Console to see anti-flash system logs (if any)</li>
              <li>Click "Refresh Page" multiple times and watch for flashing</li>
              <li>Switch between light and dark themes</li>
              <li>Navigate to different pages and back</li>
              <li>Check that page transitions are smooth without white/dark flashes</li>
              <li>Verify the system status shows all green checkmarks</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
