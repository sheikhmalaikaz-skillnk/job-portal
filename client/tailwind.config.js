/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // <-- Ye line sabse important hai (src wala)
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}", // <-- Nayi added line for pages folder
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}