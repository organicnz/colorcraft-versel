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
          DEFAULT: '#0B4C6F',
          50: '#E6F1F7',
          100: '#CCE3EF',
          200: '#99C7DF',
          300: '#66ABCF',
          400: '#338FBE',
          500: '#0B4C6F',
          600: '#093D5A',
          700: '#072E44',
          800: '#041E2F',
          900: '#020F17',
        },
        secondary: {
          DEFAULT: '#2E7D32',
          50: '#EAF5EB',
          100: '#D5EBD7',
          200: '#ABD7AF',
          300: '#82C487',
          400: '#58B05F',
          500: '#2E7D32',
          600: '#256428',
          700: '#1C4B1E',
          800: '#123214',
          900: '#09190A',
        },
        accent: {
          DEFAULT: '#D5A021',
          50: '#FBF6E8',
          100: '#F7EDD1',
          200: '#EEDBA3',
          300: '#E6C975',
          400: '#DDB747',
          500: '#D5A021',
          600: '#A8801A',
          700: '#7E6014',
          800: '#54400D',
          900: '#2A2007',
        },
        background: '#F7F9FC',
        foreground: '#333333',
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'serif'],
        sans: ['var(--font-raleway)', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 