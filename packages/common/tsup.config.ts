import { defineConfig } from 'tsup'

export default defineConfig([
  {
    entry: ['utils/index.ts'],
    format: ['cjs', 'esm'],
    external: ['zod', 'zod-to-json-schema'],
    dts: true,
    sourcemap: true,
    outDir: 'utils/dist',
    clean: true,
  },
])
