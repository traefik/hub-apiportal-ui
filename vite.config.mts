/// <reference types="vitest" />
import { defineConfig, splitVendorChunkPlugin } from 'vite'
import react from '@vitejs/plugin-react'
import viteTsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  base: './',
  plugins: [react(), viteTsconfigPaths(), splitVendorChunkPlugin()],
  server: {
    open: true,
    port: 3003,
  },
  build: {
    rollupOptions: {
      input: {
        app: './index.tmpl.html',
      },
    },
    outDir: './dist',
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
