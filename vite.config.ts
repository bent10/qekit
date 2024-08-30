/// <reference types="vitest" />
import { defineConfig } from 'vite'
import umdFormatResolver from 'vite-plugin-resolve-umd-format'

export default defineConfig({
  plugins: [umdFormatResolver()],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'qe',
      formats: ['es', 'cjs', 'umd'],
      fileName: 'index'
    }
  },
  test: {
    globals: true,
    include: ['test/*.test.ts'],
    environment: 'jsdom'
  }
})
