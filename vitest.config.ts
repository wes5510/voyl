import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
    alias: {
      '@/models': new URL('./src/renderer/src/models', import.meta.url).pathname,
      '@/common': new URL('./src/renderer/src/common', import.meta.url).pathname,
      '@/pages': new URL('./src/renderer/src/pages', import.meta.url).pathname,
    },
  },
})
