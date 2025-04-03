import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

export default defineConfig({
  envPrefix: 'BIZ_',
  envDir: '../',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': 'src',
    },
  },
});
