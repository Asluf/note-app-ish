/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brown: {
          100: '#f3eae0',
          200: '#e6d5c1',
          300: '#d8bfa1',
          400: '#cba881',
          500: '#bd9262',
          600: '#a1764d',
          700: '#856138',
          800: '#684b2a',
          900: '#4c361c',
        },
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.hide-scrollbar': {
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none', 
        }
      };
      addUtilities(newUtilities);
    }
  ],
}