/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        fleet: {
          bg: '#0D0F14',
          surface: '#151820',
          border: '#1E2330',
          accent: '#F97316',
          accentDim: '#7C3A10',
          text: '#E8EAF0',
          muted: '#6B7280',
          critical: '#EF4444',
          high: '#F97316',
          medium: '#EAB308',
          low: '#22C55E',
        }
      }
    },
  },
  plugins: [],
}
