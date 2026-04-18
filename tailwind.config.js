/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        script: ['Great Vibes', 'cursive'],
        sans: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        app: 'linear-gradient(180deg, #fff8f7 0%, #fffefc 55%, #fff 100%)',
      },
    },
  },
  plugins: [],
}

