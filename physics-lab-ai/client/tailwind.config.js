/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#4361ee',
        'primary-dark': '#3a56d4',
        dark: {
          900: '#0d1117',
          800: '#161b22',
          700: '#1a1a2e',
          600: '#16213e',
          500: '#1f2937',
        },
        accent: {
          blue: '#4361ee',
          green: '#06d6a0',
          red: '#e63946',
          yellow: '#fee440',
          cyan: '#00f5d4',
        },
      },
    },
  },
  plugins: [],
};
