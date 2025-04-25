import { defineConfig } from 'drizzle-kit'
import { config } from './src/config/index.ts'

export default defineConfig({ ...config.drizzleKit, out: './src/database/migrations' })
