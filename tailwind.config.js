/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-dm-sans)', 'sans-serif'],
        heading: ['var(--font-poppins)', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#0F4C81',
          50: '#E6EEF5',
          100: '#CCDCEA',
          200: '#99B9D5',
          300: '#6697C0',
          400: '#3374AB',
          500: '#0F4C81',
          600: '#0D4373',
          700: '#0A3A65',
          800: '#083057',
          900: '#062748',
        },
        secondary: {
          DEFAULT: '#E4A04C',
          50: '#FDFAF5',
          100: '#FAF4EB',
          200: '#F5E4CC',
          300: '#F0D4AD',
          400: '#EAC48E',
          500: '#E4A04C',
          600: '#E0922D',
          700: '#D08019',
          800: '#B26E16',
          900: '#945C12',
        },
        accent: {
          DEFAULT: '#2A9D8F',
          50: '#E7F5F3',
          100: '#CFEBE7',
          200: '#A0D6CF',
          300: '#70C2B7',
          400: '#41AE9F',
          500: '#2A9D8F',
          600: '#268F82',
          700: '#217D71',
          800: '#1C6B61',
          900: '#175951',
        },
        gray: {
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
        background: '#F7F9FC',
        foreground: '#333333',
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(0, 0, 0, 0.05)',
        'medium': '0 8px 30px rgba(0, 0, 0, 0.1)',
        'strong': '0 12px 40px rgba(0, 0, 0, 0.15)',
      },
    },
  },
  plugins: [],
} 