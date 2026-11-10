import type { Config } from 'tailwindcss'

export default {
  prefix: 'tw-',
  content: ['./index.html', './src/**/*.{vue,ts}'],
  theme: {
    extend: {
      colors: {
        ink: '#1A1410',
        flour: '#F4EFE6',
        paper: '#E7DCCB',
        crust: '#C4622D',
        rye: '#7C3B1D',
        ember: '#E24A1B',
        stone: '#231C17',
        moss: '#3E5344',
        wheat: '#E6C7A2',
      },
      fontFamily: {
        sans: ['Outfit', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['Fraunces', 'ui-serif', 'Georgia', 'serif'],
      },
      boxShadow: {
        card: '0 24px 60px rgba(26, 20, 16, 0.18)',
      },
    },
  },
  plugins: [],
} satisfies Config
