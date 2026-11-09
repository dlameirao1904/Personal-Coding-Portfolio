import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

const themeColor = '#0f1419'

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['tandem-logo.png', 'favicon.svg'],
      manifest: {
        name: 'Tandem',
        short_name: 'Tandem',
        description: 'Finanças em conjunto, alimentação e treino individuais.',
        theme_color: themeColor,
        background_color: '#0f1419',
        display: 'standalone',
        orientation: 'portrait',
        lang: 'pt-PT',
        start_url: '/',
        icons: [
          {
            src: 'tandem-logo.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,svg,png,woff2}'],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5174,
    host: true,
  },
})
