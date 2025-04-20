import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

export default defineConfig({
  envPrefix: ['BIZ_'],
  plugins: [react(), tailwindcss()],

  server: {
    watch: {
      ignored: [
        path.resolve(__dirname, 'packages/server'),
        path.resolve(__dirname, 'src-tauri'),
        path.resolve(__dirname, 'packages/template'),
        path.resolve(__dirname, 'crates'),
        path.resolve(__dirname, 'Makefile'),
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@@/ai-server': path.resolve(__dirname, 'packages/ai-server/src'),
    },
  },
})
