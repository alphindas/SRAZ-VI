import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  // The Three.js route is lazy-loaded and 273 kB gzip; its uncompressed vendor chunk
  // is expected to exceed Vite's generic 500 kB warning threshold.
  build: {
    chunkSizeWarningLimit: 1100,
  },
})
