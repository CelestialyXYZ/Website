import { sentryVitePlugin } from '@sentry/vite-plugin'
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA } from 'vite-plugin-pwa'

import tailwind from 'tailwindcss'
import autoprefixer from 'autoprefixer'

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    postcss: {
      plugins: [tailwind(), autoprefixer()]
    }
  },

  plugins: [
    vue(),
    VueDevTools(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Celestialy',
        short_name: 'Celestialy',
        description: 'What celestial objects are you looking for tonight?',
        icons: [
          {
            src: '/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ],
        theme_color: '#030712',
        background_color: '#030712',
        display: 'standalone'
      }
    }),
    sentryVitePlugin({
      org: 'celestialy-organization',
      project: 'celestialy-website',
      telemetry: false
    })
  ],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },

  build: {
    sourcemap: true
  }
})
