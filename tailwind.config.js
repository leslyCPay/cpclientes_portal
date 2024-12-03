/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html', 
    './src/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{html,tsx}',
    './components/**/*.{html,tsx}',
  ],
  theme: {
    extend: {
      colors:{
        tussock: {
          50: '#fcf8ee',
         100: '#f5ead0',
         200: '#ead39d',
         300: '#dfb86a',
         400: '#d9a44e',
         500: '#ce8432',
         600: '#b66729',
         700: '#984b25',
         800: '#7c3c24',
         900: '#673320',
         950: '#3a190e',
        }
      },
    },    
    fontFamily: {
      sans: ['Graphik', 'sans-serif'],
      serif: ['Merriweather', 'serif'],
    },
  },
  plugins: [],
}

