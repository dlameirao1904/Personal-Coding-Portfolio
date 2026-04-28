module.exports = {
    plugins: {
        'postcss-nested': {},
        'tailwindcss/nesting': 'postcss-nested',
        tailwindcss: {},
        autoprefixer: {},
        'postcss-preset-env': {
            stage: 4,
        },
        // 'postcss-pxtorem': {
        //     rootValue: 16,
        //     unitPrecision: 5,
        //     propList: ['*'],
        //     mediaQuery: true,
        // },
        cssnano: {
            preset: 'default',
        },
    },
};
