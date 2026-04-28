import type { Config } from 'tailwindcss';
import { tailwindColors, theme } from './theme';

module.exports = {
    important: true,
    prefix: 'tw-',
    content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    theme: {
        colors: tailwindColors(),
        fontFamily: theme.fontFamily,
        extend: {
            screens: {
                '3xs': '320px',
                '2xs': '375px',
                xs: '425px',
                sm: '640px',
                md: '768px',
                lg: '1024px',
                xl: '1280px',
                xxl: '1536px',
            },
            borderRadius: {
                '4xl': '2rem',
                '5xl': '3rem',
                '6xl': '4rem',
                '7xl': '5rem',
                '8xl': '6rem',
                '9xl': '7rem',
                '10xl': '8rem',
            },
            backgroundOpacity: {
                '18': '0.18',
              },
        },
    },

    plugins: [],
} as Config;
