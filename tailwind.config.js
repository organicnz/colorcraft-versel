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
      colors: {
        primary: {
          DEFAULT: '#8E6E53',
          50: '#E6DCD4',
          100: '#DBCEC3',
          200: '#C7B4A2',
          300: '#B39A81',
          400: '#9E8160',
          500: '#8E6E53',
          600: '#6C543F',
          700: '#4A392B',
          800: '#281F17',
          900: '#070503',
        },
        secondary: {
          DEFAULT: '#A68E77',
          50: '#EBE4DE',
          100: '#E1D7CE',
          200: '#CDBDB0',
          300: '#B9A391',
          400: '#A68E77',
          500: '#8B745D',
          600: '#6D5A49',
          700: '#4F4135',
          800: '#312820',
          900: '#140F0C',
        },
        background: '#FAF7F0',
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'serif'],
        sans: ['var(--font-raleway)', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 