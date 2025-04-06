import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

export default defineConfig({
  envPrefix: ['BIZ_'],
  plugins: [react(), tailwindcss()],
  server: {
    watch: {
      ignored: [path.resolve(__dirname, 'server'), path.resolve(__dirname, ' src-tauri')],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@@/server': path.resolve(__dirname, 'server/src'),
      '@@/types': path.resolve(__dirname, 'packages/types'),
      '@@/utils': path.resolve(__dirname, 'packages/utils/src'),
    },
  },
})
