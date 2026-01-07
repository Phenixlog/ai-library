/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: "#0F172A", // Midnight Blue
        foreground: "#F8FAFC",
        accent: "#8B5CF6", // Electric Purple
        secondary: "#1E293B",
        border: "#334155",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
