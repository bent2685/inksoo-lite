import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'

// UnoCss
import UnoCss from 'unocss/vite'
import { presetAttributify, presetUno, presetIcons } from 'unocss'
import transformerVariantGroup from '@unocss/transformer-variant-group'
import transformerDirectives from '@unocss/transformer-directives'
export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    server: {
      host: '0.0.0.0'
    },
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
        '@main': resolve('src/main')
      }
    },
    plugins: [
      vue(),
      UnoCss({
        theme: {
          colors: {
            pri: 'var(--primary-color)',
            border: 'var(--border-color)',
            text: 'var(--text)',
            text2: 'var(--text-2)',
            bg: 'var(--bg)',
            bg2: 'var(--bg-2)',
            warn: 'var(--warning)'
          }
        },
        presets: [
          presetUno(),
          presetAttributify(),
          presetIcons({
            collections: {
              tabler: () => import('@iconify-json/tabler').then((i) => i.icons as never)
            },
            scale: 1.5
          })
        ],
        transformers: [transformerVariantGroup(), transformerDirectives()]
      })
    ],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@renderer/assets/var.scss";`
        }
      }
    }
  }
})
