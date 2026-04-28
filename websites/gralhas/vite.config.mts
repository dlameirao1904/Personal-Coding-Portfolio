// Plugins
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import Fonts from 'unplugin-fonts/vite';
import Layouts from 'vite-plugin-vue-layouts';
import Vue from '@vitejs/plugin-vue';
import VueRouter from 'unplugin-vue-router/vite';
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import { ViteMinifyPlugin } from 'vite-plugin-minify';
import { VitePWA } from 'vite-plugin-pwa';
import { sentryVitePlugin } from '@sentry/vite-plugin';

// Utilities
import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';

import theme from './theme';

// https://vitejs.dev/config/
export default ({ mode }) => {
    // const appColor = typeof theme.colors.primary === 'string' ? theme.colors.primary : theme.colors.primary.DEFAULT;
    const appColor = theme.colors['primary-200'];
    process.env.VITE_APP_COLOR_THEME = appColor;
    const appName = 'Gralhas';
    process.env.VITE_APP_NAME = appName;
    return defineConfig({
        plugins: [
            VueRouter({
                dts: 'src/typed-router.d.ts',
            }),
            Layouts(),
            AutoImport({
                imports: [
                    'vue',
                    {
                        'vue-router/auto': ['useRoute', 'useRouter'],
                    },
                ],
                dts: 'src/auto-imports.d.ts',
                eslintrc: {
                    enabled: true,
                },
                vueTemplate: true,
            }),
            Components({
                dts: 'src/components.d.ts',
            }),
            Vue({
                template: { transformAssetUrls },
            }),
            // https://github.com/vuetifyjs/vuetify-loader/tree/master/packages/vite-plugin#readme
            vuetify({
                styles: { configFile: 'src/assets/css/settings.scss' },
            }),
            Fonts({
                google: {
                    families: [
                        {
                            name: 'Roboto',
                            styles: 'wght@100;300;400;500;700;900',
                        },
                    ],
                },
            }),
            ViteImageOptimizer({
                jpeg: {
                    quality: 60,
                    progressive: true,
                    mozjpeg: true,
                },
                jpg: {
                    quality: 60,
                    progressive: true,
                    mozjpeg: true,
                },
                png: {
                    quality: 60,
                    progressive: true,
                },
                svg: {
                    multipass: true,
                    plugins: [
                        {
                            name: 'preset-default',
                            params: {
                                overrides: {
                                    cleanupNumericValues: false,
                                    removeViewBox: false, // https://github.com/svg/svgo/issues/1128
                                },
                            },
                        },
                        'sortAttrs',
                        {
                            name: 'addAttributesToSVGElement',
                            params: {
                                attributes: [{ xmlns: 'http://www.w3.org/2000/svg' }],
                            },
                        },
                    ],
                },
            }),
            ViteMinifyPlugin({
                minifyCSS: false,
                minifyJS: true,
                removeComments: true,
            }),
            sentryVitePlugin({
                authToken: process.env.SENTRY_AUTH_TOKEN,
                org: 'sentry',
                project: 'pleno_app',
                url: 'https://sentry.iotechpis.com/',
            }),
        ],
        define: { 'process.env': {} },
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url)),
                '@axios': fileURLToPath(new URL('./src/plugins/axios.ts', import.meta.url)),
                '@composables': fileURLToPath(new URL('./src/composables', import.meta.url)),
                '@plugins': fileURLToPath(new URL('./src/plugins', import.meta.url)),
            },
            extensions: ['.js', '.json', '.jsx', '.mjs', '.ts', '.tsx', '.vue'],
        },
        server: {
            port: 3000,
            headers: {
                'X-Frame-Options': '',
                'Content-Security-Policy': "frame-ancestors 'self' *",
            },
        },
        build: {
            sourcemap: true,
        },
    });
};
