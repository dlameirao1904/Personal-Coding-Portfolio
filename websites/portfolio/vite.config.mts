// Plugins
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import Fonts from 'unplugin-fonts/vite'
import Vue from '@vitejs/plugin-vue'
import Vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'
import { ViteMinifyPlugin } from 'vite-plugin-minify'
import { VitePWA } from 'vite-plugin-pwa'

// Utilities
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

import theme from './theme'

// https://vitejs.dev/config/
export default ({ mode }) => {
  const appColor =
    typeof theme.colors.primary === 'string' ? theme.colors.primary : theme.colors.primary.DEFAULT
  process.env.VITE_APP_COLOR_THEME = appColor
  const appName = 'Diogo'
  process.env.VITE_APP_NAME = appName

  return defineConfig({
    plugins: [
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
        template: {
          transformAssetUrls,
          compilerOptions: {
            isCustomElement: (tag) => tag.startsWith('Tres') && tag !== 'TresCanvas',
          },
        },
      }),
      // https://github.com/vuetifyjs/vuetify-loader/tree/master/packages/vite-plugin#readme
      Vuetify({
        autoImport: true,
        styles: {
          configFile: 'src/assets/css/settings.scss',
        },
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
      VitePWA({
        mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico'],
        manifest: {
          background_color: appColor,
          name: 'Diogo',
          short_name: 'Diogo',
          orientation: 'any',
          display: 'standalone',
          theme_color: appColor,
          dir: 'ltr',
          handle_links: 'auto',
          icons: [
            {
              src: 'pwa-64x64.png',
              sizes: '64x64',
              type: 'image/png',
            },
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: 'maskable-icon-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        devOptions: {
          enabled: false,
          navigateFallback: 'index.html',
          suppressWarnings: false,
          type: 'module',
        },
        workbox: {
          sourcemap: true,
          maximumFileSizeToCacheInBytes: 3000000,
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
      allowedHosts: ['localhost', '127.0.0.1', '0.0.0.0', 'joao.iotechpis.com'],
      port: 3000,
      watch: {
        ignored: ['**/node_modules/**', '**/dist/**'],
      },
    },
    build: {
      sourcemap: true,
    },
  })
}
