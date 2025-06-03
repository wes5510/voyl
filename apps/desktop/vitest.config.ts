import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
    alias: {
      '@/renderer': new URL('./src/renderer', import.meta.url).pathname,
      '@/main': new URL('./src/main', import.meta.url).pathname,
    },
  },
})
