import { colord } from 'colord';

let colors = createVariations({
    transparent: '#FFFFFF00',
    current: 'currentColor',
    white: '#FFFFFF',
    black: '#000000',
    charcoal: '#333333',
    primary: '#0E3328',
    navy: '#394147',
    success: '#22c55e',
    error: '#dc2626',
    warning: '#ff9800',
    info: '#2196f3',
    red: {
        100: '#FFCED8',
        200: '#FFA5B4',
        300: '#FF7D8A',
        400: '#E86262',
        DEFAULT: '#dc2626',
        500: '#EF4444',
        600: '#DC4B69',
        700: '#C02626',
        800: '#A21D2E',
        900: '#911D2D',
    },
    orange: {
        100: '#FFEDD5',
        200: '#FED7AA',
        300: '#FDBA74',
        400: '#FB923C',
        DEFAULT: '#f97316',
        500: '#EA580C',
        600: '#C2410C',
        700: '#9A3412',
        800: '#7C2D12',
        900: '#6A2525',
    },
    purple: {
        100: '#E9D8FD',
        200: '#D6BCFA',
        300: '#B794F4',
        400: '#9F7AEA',
        DEFAULT: '#7c3aed',
        500: '#9333EA',
        600: '#7E22CE',
        700: '#6D28D9',
        800: '#5B21B6',
        900: '#4C1D95',
    },
    yellow: {
        100: '#FFE9B5',
        200: '#FFB400',
        300: '#FBCC0C',
        400: '#F59E0B',
        DEFAULT: '#f59e0b',
        500: '#FFD700',
        600: '#EAB308',
        700: '#CA8A04',
        800: '#A16207',
        900: '#854D0E',
    },
    green: {
        100: '#ECFDF5',
        200: '#D1FAE5',
        300: '#A7F3D0',
        400: '#6EE7B7',
        DEFAULT: '#279a37',
        500: '#00934B',
        600: '#10B981',
        700: '#059669',
        800: '#047857',
        900: '#065F46',
    },
    blue: {
        100: '#DBEAFE',
        200: '#CCECFF',
        300: '#93C5FD',
        400: '#60A5FA',
        DEFAULT: '#3B82F6',
        500: '#3FA2DC',
        600: '#2563EB',
        700: '#1D4ED8',
        800: '#1E40AF',
        900: '#1E3A8A',
    },
    pink: {
        100: '#FEC8D8',
        200: '#FEB2C4',
        300: '#FC8181',
        400: '#F56565',
        DEFAULT: '#D53F8C',
        600: '#B83280',
        700: '#97266D',
        800: '#702459',
        900: '#521B41',
    },
    gray: {
        100: '#F9F9F9',
        200: '#f3f4f6',
        300: '#e5e7eb',
        400: '#d1d5db',
        DEFAULT: '#9ca3af',
        500: '#907C6C',
        600: '#6b7280',
        700: '#4b5563',
        800: '#374151',
        900: '#1f2937',
    },
    brown: {
        100: '#F3E4D9',
        200: '#E3C7A1',
        300: '#D3A569',
        400: '#C27A31',
        DEFAULT: '#A8552A',
        600: '#8B4726',
        700: '#723B21',
        800: '#633112',
        900: '#4C1D12',
    },
});

export const theme = {
    colors,
    fontFamily: {
        sans: ['Lato'],
    },
} as any;

export default theme;

export function createVariations(colors: any) {
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
