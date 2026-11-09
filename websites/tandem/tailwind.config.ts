import type { Config } from 'tailwindcss'

export default {
  prefix: 'tw-',
  content: ['./index.html', './src/**/*.{vue,ts}'],
  theme: {
    extend: {
      colors: {
        ink: '#0f1419',
        paper: '#f6f4ef',
        salt: '#e8e4dc',
        teal: '#1a6b6b',
        tealSoft: '#2d8a8a',
        amber: '#c4923a',
        danger: '#b33a3a',
        muted: '#5c6570',
      },
      fontFamily: {
        sans: ['DM Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        card: '0 16px 48px rgba(15, 20, 25, 0.12)',
      },
    },
  },
  plugins: [],
} satisfies Config
