/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#0A0A0B',    // near-black canvas
          elevated: '#111114',   // cards, sidebars
          overlay:  '#17171C',   // modals, popovers
          hover:    '#1C1C22',
        },
        border: {
          DEFAULT: '#1F1F26',
          strong:  '#2A2A33',
        },
        foreground: {
          DEFAULT: '#EDEDF0',    // primary text
          muted:   '#9494A0',    // secondary text
          subtle:  '#5C5C68',    // tertiary text
        },
        accent: {
          DEFAULT: '#7C5CFF',    // electric violet — primary CTA
          hover:   '#8F72FF',
          glow:    'rgba(124, 92, 255, 0.35)',
        },
        secondary: {
          DEFAULT: '#22D3EE',    // cyan — highlights, presence
        },
        success: '#10B981',
        warning: '#F59E0B',
        danger:  '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
