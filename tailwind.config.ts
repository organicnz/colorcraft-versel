import type { Config } from 'tailwindcss'
// Assuming colors are defined in a separate file as per rules
// import { colors } from './src/styles/colors' 

// Define colors directly here for simplicity if src/styles/colors.ts doesn't exist yet
const colors = {
  // Primary colors - warm wood tones
  primary: {
    50: '#FAF5F0',
    100: '#F5EAE0',
    200: '#EAD5C0',
    300: '#DFBFA0',
    400: '#D4AA80',
    500: '#C99460', // Primary brand color
    600: '#B87940',
    700: '#96632F',
    800: '#744C21',
    900: '#523615',
  },
  // Secondary colors - complementary blues
  secondary: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6', // Accent color
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
  },
  // Neutral tones
  neutral: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  // Success, warning, danger colors
  success: '#10B981',
  warning: '#FBBF24',
  danger: '#EF4444',
};


const config: Config = {
  darkMode: ["class"],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: colors.primary[500], // Use your defined primary color
          foreground: "hsl(var(--primary-foreground))", // Define if needed, e.g., white/dark text on primary bg
           ...colors.primary // Include all shades
        },
        secondary: {
          DEFAULT: colors.secondary[500], // Use your defined secondary color
          foreground: "hsl(var(--secondary-foreground))", // Define if needed
           ...colors.secondary // Include all shades
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
           DEFAULT: colors.secondary[500], // Often same as secondary or another highlight color
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
         // Add neutral colors directly
        neutral: colors.neutral,
        success: colors.success,
        warning: colors.warning,
        danger: colors.danger,
      },
      borderRadius: {
        lg: "calc(var(--radius, 0.5rem))", // Use CSS variables from globals.css if defined
        md: "calc(var(--radius, 0.5rem) - 2px)",
        sm: "calc(var(--radius, 0.5rem) - 4px)",
      },
       keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      // Define fonts if you're using custom fonts via CSS variables
      // fontFamily: {
      //   sans: ['var(--font-sans)', 'sans-serif'],
      //   serif: ['var(--font-serif)', 'serif'],
      //   display: ['var(--font-display)', 'sans-serif'],
      // },
    },
  },
   plugins: [require("tailwindcss-animate")], // Add animate plugin for shadcn
}

export default config 