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
        sans: ['var(--font-dmSans)', 'sans-serif'],
        heading: ['var(--font-poppins)', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#2E5A88',
          50: '#F5F9FF',
          100: '#E0EEFF',
          200: '#B8D1F5',
          300: '#8AB1E4',
          400: '#5C91D3',
          500: '#3A75BE',
          600: '#2E5A88',
          700: '#254B72',
          800: '#1D3C5C',
          900: '#152D46',
        },
        secondary: {
          DEFAULT: '#D6A35C',
          50: '#FEF9F3',
          100: '#FAEBD2',
          200: '#F5D7A6',
          300: '#EFC379',
          400: '#D6A35C',
          500: '#C48A3A',
          600: '#A37232',
          700: '#825A28',
          800: '#61421E',
          900: '#412C14',
        },
        neutral: {
          DEFAULT: '#E9EBF0',
          50: '#FFFFFF',
          100: '#F9FAFC',
          200: '#E9EBF0',
          300: '#D8DCE4',
          400: '#BEC5D2',
          500: '#A4AFBF',
          600: '#8A97AC',
          700: '#707F98',
          800: '#586579',
          900: '#3F4A59',
        },
        dark: {
          DEFAULT: '#1A202C',
          50: '#4A5568',
          100: '#2D3748',
          200: '#1A202C',
          300: '#171923',
          400: '#12151C',
          500: '#0E1014',
        },
        background: {
          light: '#FFFFFF',
          DEFAULT: '#FFFFFF',
          dark: '#F7F9FC',
        },
        text: {
          primary: '#1A202C',
          secondary: '#4A5568',
          light: '#718096',
        }
      },
      boxShadow: {
        soft: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        medium: '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.03)',
        strong: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
} 