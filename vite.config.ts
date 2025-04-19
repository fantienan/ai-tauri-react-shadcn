import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

export default defineConfig({
  envPrefix: ['BIZ_', 'MAPBOX_'],
  plugins: [react(), tailwindcss()],

  server: {
    watch: {
      ignored: [
        path.resolve(__dirname, 'server'),
        path.resolve(__dirname, ' src-tauri'),
        path.resolve(__dirname, 'packages/template'),
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@@/server': path.resolve(__dirname, 'server/src'),
    },
  },
})
