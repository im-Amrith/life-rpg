/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        app: {
           main: 'var(--bg-main)',
           sidebar: 'var(--bg-sidebar)',
           card: 'var(--bg-card)',
           hover: 'var(--bg-hover)',
           input: 'var(--bg-input)',
           border: 'var(--border-color)',
           text: 'var(--text-main)',
           muted: 'var(--text-muted)',
        },
        gray: {
          900: '#121212', // Card background
          800: '#1f1f1f', // Border/secondary background
          700: '#2d2d2d',
          400: '#a1a1a1', // Secondary text
        },
        green: {
          500: '#22c55e',
          600: '#16a34a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}