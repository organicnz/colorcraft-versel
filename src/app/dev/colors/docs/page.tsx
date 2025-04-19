import Link from "next/link";
import { Code } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const metadata = {
  title: "Color System Documentation - Color & Craft Dev Tools",
  description: "Documentation for the Color & Craft color system",
};

export default function ColorDocsPage() {
  return (
    <div className="container max-w-4xl py-10">
      <div className="space-y-8">
        <div>
          <Link 
            href="/dev/colors" 
            className="text-sm text-muted-foreground hover:text-primary flex items-center mb-4"
          >
            ← Back to Color Palette
          </Link>
          <h1 className="text-3xl font-bold mb-2">Color System Documentation</h1>
          <p className="text-muted-foreground">
            Learn how to use the Color & Craft color system in your components.
          </p>
        </div>

        <section id="introduction" className="space-y-4">
          <h2 className="text-2xl font-semibold">Introduction</h2>
          <p>
            The Color & Craft color system is defined in <code className="bg-muted px-1 py-0.5 rounded text-sm">src/styles/colors.ts</code> 
            and is integrated with Tailwind CSS for easy use throughout the application. The system includes:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Primary Colors - Warm wood tones for primary brand identity</li>
            <li>Secondary Colors - Sophisticated teals for complementary elements</li>
            <li>Accent Colors - Soft blush tones for highlights and accents</li>
            <li>Neutral Colors - Warmer grays for text and backgrounds</li>
            <li>Status Colors - Success, warning, and danger indicators</li>
            <li>Gradient Presets - Pre-defined gradients for various UI effects</li>
          </ul>
        </section>

        <section id="usage-in-tailwind" className="space-y-4">
          <h2 className="text-2xl font-semibold">Using Colors with Tailwind</h2>
          <p>
            All colors are available as Tailwind classes using the following syntax:
          </p>
          <pre className="bg-muted p-4 rounded-md overflow-auto text-sm my-4">
{`// For text colors
<p className="text-primary">Primary color (shade 500)</p>
<p className="text-primary-600">Primary color shade 600</p>

// For background colors
<div className="bg-secondary-200">Secondary background with shade 200</div>

// For borders
<div className="border border-accent-300">Accent colored border</div>

// For hover states
<button className="bg-primary hover:bg-primary-600">Hover Effect</button>`}
          </pre>

          <Alert>
            <Code className="h-4 w-4" />
            <AlertDescription>
              Always use the semantic color names (primary, secondary, accent) rather than 
              specific color names to ensure consistency if the color palette changes.
            </AlertDescription>
          </Alert>
        </section>

        <section id="gradient-examples" className="space-y-4">
          <h2 className="text-2xl font-semibold">Using Gradients</h2>
          <p>
            Predefined gradients can be applied using inline styles:
          </p>
          <pre className="bg-muted p-4 rounded-md overflow-auto text-sm my-4">
{`// Using a gradient from the color system
import { colors } from "@/styles/colors";

<div style={{ background: colors.gradients.primary }}>
  Primary gradient background
</div>

// Directly in JSX
<div style={{ background: "linear-gradient(135deg, #D3A273 0%, #C08A5A 100%)" }}>
  Primary gradient background
</div>`}
          </pre>

          <p>
            You can also create a utility class in your CSS:
          </p>
          <pre className="bg-muted p-4 rounded-md overflow-auto text-sm my-4">
{`/* In your CSS */
.bg-gradient-primary {
  background: linear-gradient(135deg, #D3A273 0%, #C08A5A 100%);
}

/* In your JSX */
<div className="bg-gradient-primary">
  Primary gradient background
</div>`}
          </pre>
        </section>

        <section id="extending" className="space-y-4">
          <h2 className="text-2xl font-semibold">Extending the Color System</h2>
          <p>
            To extend or modify the color system:
          </p>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Edit <code className="bg-muted px-1 py-0.5 rounded text-sm">src/styles/colors.ts</code> to add or modify colors.</li>
            <li>The Tailwind config will automatically include your changes because it imports from this file.</li>
            <li>Optionally, update any component-specific styling that uses hard-coded colors.</li>
          </ol>

          <pre className="bg-muted p-4 rounded-md overflow-auto text-sm my-4">
{`// Example of adding a new color category to src/styles/colors.ts
export const colors = {
  // Existing colors...
  
  // New category
  tertiary: {
    50: '#F5F7FF',
    100: '#EDF0FF',
    200: '#D8DEFF',
    300: '#B6C3FF',
    400: '#8C9EFF',
    500: '#536DFE', // Main tertiary color
    600: '#3D5AFE',
    700: '#304FFE',
    800: '#2841FF',
    900: '#1A33FF',
  }
};`}
          </pre>
        </section>

        <section id="dark-mode" className="space-y-4">
          <h2 className="text-2xl font-semibold">Dark Mode Compatibility</h2>
          <p>
            The color system is designed to work with both light and dark modes. When using Tailwind's dark mode:
          </p>
          <pre className="bg-muted p-4 rounded-md overflow-auto text-sm my-4">
{`<div className="bg-white dark:bg-neutral-800">
  <p className="text-neutral-800 dark:text-neutral-100">
    This text adapts to dark mode
  </p>
  <button className="bg-primary-500 dark:bg-primary-600 text-white">
    This button uses a darker shade in dark mode
  </button>
</div>`}
          </pre>

          <p>
            For components that need special treatment in dark mode, consider using the useTheme hook:
          </p>
          <pre className="bg-muted p-4 rounded-md overflow-auto text-sm my-4">
{`"use client";

import { useTheme } from "next-themes";
import { colors } from "@/styles/colors";

export function ThemeAwareComponent() {
  const { theme } = useTheme();
  
  const bgColor = theme === "dark" 
    ? colors.primary[700]
    : colors.primary[500];
    
  return (
    <div style={{ backgroundColor: bgColor }}>
      Theme-aware component
    </div>
  );
}`}
          </pre>
        </section>

        <section id="best-practices" className="space-y-4">
          <h2 className="text-2xl font-semibold">Best Practices</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Use semantic colors:</strong> Prefer <code className="bg-muted px-1 py-0.5 rounded text-sm">text-primary-600</code> over hardcoded values like <code className="bg-muted px-1 py-0.5 rounded text-sm">text-[#C08A5A]</code>.</li>
            <li><strong>Follow color purpose:</strong> Use primary colors for main actions, secondary for supporting elements, accent for highlights.</li>
            <li><strong>Maintain contrast:</strong> Ensure sufficient contrast between text and background colors for accessibility.</li>
            <li><strong>Use shades consistently:</strong> Lighter shades (50-200) work well for backgrounds, medium shades (400-600) for UI elements, and darker shades (700-900) for text.</li>
            <li><strong>Status colors:</strong> Use success, warning, and danger colors only for their intended purpose to maintain clear user feedback.</li>
          </ul>
        </section>

        <section id="component-examples" className="space-y-4">
          <h2 className="text-2xl font-semibold">Component Examples</h2>
          <p>
            Check out the <Link href="/dev/components" className="text-primary hover:underline">Component Showcase</Link> to see 
            how the color system is applied to various UI components.
          </p>
        </section>
      </div>
    </div>
  );
} 