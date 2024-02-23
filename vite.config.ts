/// <reference types="vitest" />
import { defineConfig, splitVendorChunkPlugin } from 'vite'
import react from '@vitejs/plugin-react'
import viteTsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  base: '/',
  plugins: [react(), viteTsconfigPaths(), splitVendorChunkPlugin()],
  server: {
    open: true,
    port: 3003,
  },
  build: {
    outDir: './build',
    emptyOutDir: true,
    cssMinify: 'lightningcss',
  },
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      reporter: ['text', 'html'],
      exclude: ['node_modules/', '.prettierrc.js', 'public', 'types'],
    },
  },
})
