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
        background: {
          DEFAULT: 'rgb(var(--bg-default) / <alpha-value>)',
          elevated: 'rgb(var(--bg-elevated) / <alpha-value>)',
          overlay:  'rgb(var(--bg-overlay) / <alpha-value>)',
          hover:    'rgb(var(--bg-hover) / <alpha-value>)',
        },
        border: {
          DEFAULT: 'rgb(var(--border-default) / <alpha-value>)',
          strong:  'rgb(var(--border-strong) / <alpha-value>)',
        },
        foreground: {
          DEFAULT: 'rgb(var(--fg-default) / <alpha-value>)',
          muted:   'rgb(var(--fg-muted) / <alpha-value>)',
          subtle:  'rgb(var(--fg-subtle) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--accent-default) / <alpha-value>)',
          hover:   'rgb(var(--accent-hover) / <alpha-value>)',
          glow:    'var(--accent-glow)',
        },
        secondary: {
          DEFAULT: 'rgb(var(--secondary) / <alpha-value>)',
        },
        success: 'rgb(var(--success) / <alpha-value>)',
        warning: 'rgb(var(--warning) / <alpha-value>)',
        danger:  'rgb(var(--danger) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
