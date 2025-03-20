/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0F72C1',
          light: '#1a85d9',
          dark: '#0c5ea0',
        },
        secondary: {
          DEFAULT: '#E4A04C',
          light: '#f4b871',
          dark: '#c4842c',
        },
        accent: {
          DEFAULT: '#2A9D8F',
          light: '#34c2b0',
          dark: '#1c7268',
        },
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '65ch',
            color: 'rgb(var(--foreground-rgb))',
            p: {
              color: 'rgb(var(--foreground-rgb))',
            },
            h1: {
              color: 'rgb(var(--foreground-rgb))',
            },
            h2: {
              color: 'rgb(var(--foreground-rgb))',
            },
            h3: {
              color: 'rgb(var(--foreground-rgb))',
            },
            h4: {
              color: 'rgb(var(--foreground-rgb))',
            },
            a: {
              color: '#0F72C1',
              '&:hover': {
                color: '#1a85d9',
              },
            },
          },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};
