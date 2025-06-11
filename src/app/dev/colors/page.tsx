import ColorPalette from "@/components/dev/ColorPalette";
import { Button } from "@/components/ui/button";
import { LayoutTemplate } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Color Palette - Color & Craft Dev Tools",
  description: "Color palette system for Color & Craft website design",
};

export default function ColorsPage() {
  return (
    <div className="container max-w-7xl py-10">
      <div className="flex justify-end mb-6">
        <Button variant="outline" size="sm" asChild className="ml-auto">
          <Link href="/dev/components" className="flex items-center">
            <LayoutTemplate className="mr-1 h-4 w-4" />
            View Components
          </Link>
        </Button>
      </div>
      <ColorPalette />
    </div>
  );
}
