import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  // Ensure MapLibre's worker is bundled as a separate asset chunk
  // so the browser can load it as a real Web Worker
  optimizeDeps: {
    exclude: ['maplibre-gl'],
  },
  build: {
    rollupOptions: {
      output: {
        // Keep maplibre-gl and its worker in separate chunks
        manualChunks(id) {
          if (id.includes('maplibre-gl')) {
            return 'maplibre';
          }
        },
      },
    },
  },
})
