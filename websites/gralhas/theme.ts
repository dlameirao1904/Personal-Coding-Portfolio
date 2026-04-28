import { colord } from 'colord';

const colors = createVariations({
    transparent: '#FFFFFF00',
    current: 'currentColor',
    white: '#FFFFFF',
    black: '#000000',
    primary: {
        100: '#D1FAD2',
        200: '#A3F5A6',
        300: '#75F079',
        400: '#47EB4C',
        DEFAULT: '#009803',
        600: '#007F02',
        700: '#006601',
        800: '#004C01',
        900: '#003300',
    },
    secondary: '#4C926A',
    brown: {
        100: '#F5E6D9',
        200: '#E8D0B8',
        300: '#D4B896',
        400: '#C19A74',
        DEFAULT: '#AA7B51',
        600: '#8F6540',
        700: '#744F2F',
        800: '#5A3D1F',
        900: '#402B0F',
    },
    pink: {
        100: '#FFD9E8',
        200: '#FFB3D1',
        300: '#FF8CBB',
        400: '#FF66A4',
        DEFAULT: '#FF66A4',
        600: '#FF69B4',
        700: '#FF4DA0',
        800: '#FF1493',
        900: '#DB7093',
    },
    orange: {
        100: '#FFF8E1',
        200: '#FFECB3',
        300: '#FFBC00',
        400: '#FFA500',
        DEFAULT: '#FFA500',
        600: '#FFA000',
        700: '#FF8C00',
        800: '#FF7F00',
        900: '#FF6F00',
    },
    red: {
        100: '#fee2e2',
        200: '#fecaca',
        300: '#fca5a5',
        400: '#f87171',
        DEFAULT: '#ef4444',
        600: '#dc2626',
        700: '#b91c1c',
        800: '#991b1b',
        900: '#7f1d1d',
    },
    green: {
        100: '#d1fae5',
        200: '#a7f3d0',
        300: '#6ee7b7',
        400: '#34d399',
        DEFAULT: '#10b981',
        600: '#059669',
        700: '#047857',
        800: '#065f46',
        900: '#064e3b',
    },
    yellow: {
        100: '#FFF8E1',
        200: '#FFECB3',
        300: '#FFE082',
        400: '#FFD54F',
        DEFAULT: '#FFCA28',
        600: '#FFC107',
        700: '#FFB300',
        800: '#FFA000',
        900: '#FF8F00',
    },
    gray: {
        100: '#F9FAFB',
        200: '#F3F4F6',
        300: '#D1D5DB',
        400: '#B0B0B0',
        DEFAULT: '#ACACAC',
        600: '#6B7280',
        700: '#4B5563',
        800: '#374151',
        900: '#1F2937',
    },
    blue: {
        100: '#E3F2FD',
        200: '#BBDEFB',
        300: '#90CAF9',
        400: '#64B5F6',
        DEFAULT: '#42A5F5',
        600: '#2196F3',
        700: '#1E88E5',
        800: '#1976D2',
        900: '#1565C0',
    },
    indigo: {
        100: '#E8EAF6',
        200: '#C5CAE9',
        300: '#9FA8DA',
        400: '#7986CB',
        DEFAULT: '#5C6BC0',
        600: '#3F51B5',
        700: '#3949AB',
        800: '#303F9F',
        900: '#283593',
    },
    dark: {
        100: '#E5E5E5',
        200: '#CCCCCC',
        300: '#999999',
        400: '#666666',
        DEFAULT: '#333333',
        600: '#2A2A2A',
        700: '#1F1F1F',
        800: '#141414',
        900: '#0A0A0A',
    },
});

export const theme = {
    colors,
    fontFamily: {
        sans: ['Aeonik', 'sans-serif'],
    },
} as any;

export default theme;

function createVariations(colors: any) {
    const variations: any = {};
    for (const color in colors) {
        if (['transparent', 'current', 'black', 'white'].includes(color)) {
            variations[color] = colors[color];
            continue;
        }
        if (typeof colors[color] === 'object') {
            for (const shade in colors[color]) {
                if (shade.toUpperCase() != 'DEFAULT') variations[`${color}-${shade}`] = colors[color][shade];
                else variations[color] = colors[color][shade];
            }
            continue;
        }

        variations[color] = colors[color];
        const col = colord(colors[color]);
        for (let i = 0.05; i <= 0.2; i += 0.05) {
            variations[`${color}-${Math.abs(Math.round(i * 2000 - 500))}`] = col.lighten(i).toHex();
        }
        for (let i = 0.05; i <= 0.2; i += 0.05) {
            variations[`${color}-${Math.abs(Math.round(i * 2000 + 500))}`] = col.darken(i).toHex();
        }
    }
    return variations;
}

export function vuetifyColors() {
    const vuetifyColors: any = {};
    for (const color in theme.colors) {
        if (['transparent', 'current'].includes(color)) continue;
        vuetifyColors[color] = theme.colors[color];
    }
    return vuetifyColors;
}

export function tailwindColors() {
    const tailwindColors: any = {};
    for (const color in theme.colors) {
        if (['transparent', 'current'].includes(color)) {
            tailwindColors[color] = theme.colors[color];
            continue;
        }
        tailwindColors[color] = `rgba(var(--v-theme-${color}), <alpha-value>)`;
    }

    return tailwindColors;
}
