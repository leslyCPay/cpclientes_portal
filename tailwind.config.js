/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{html,tsx}",
    "./components/**/*.{html,tsx}",
    "node_modules/flowbite/**/*.{js,jsx,ts,tsx}",
    "node_modules/preline/dist/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
          950: "#451a03",
        },

        tussock: {
          50: "#fcf8ee",
          100: "#f5ead0",
          200: "#ead39d",
          300: "#dfb86a",
          400: "#d9a44e",
          500: "#ce8432",
          600: "#b66729",
          700: "#984b25",
          800: "#7c3c24",
          900: "#673320",
          950: "#3a190e",
        },
      },
    },
    fontFamily: {
      sans: ["Graphik", "sans-serif"],
      serif: ["Merriweather", "serif"],
    },
  },
  plugins: [require("flowbite/plugin"), require("preline/plugin")],
};
