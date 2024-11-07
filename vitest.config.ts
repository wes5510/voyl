import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    alias: {
      '@/styled-system': new URL('./styled-system', import.meta.url).pathname,
      '@/state': new URL('./src/renderer/src/state', import.meta.url).pathname,
      '@/model': new URL('./src/renderer/src/model', import.meta.url).pathname,
      '@/api': new URL('./src/renderer/src/api', import.meta.url).pathname,
      '@/component': new URL('./src/renderer/src/component', import.meta.url).pathname,
    },
  },
})
