import './src/config/env.ts'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/database/schema.ts',
  out: './src/database/migrations',
  dialect: 'sqlite',
  verbose: true,
  tablesFilter: ['user', 'chat', 'message', 'vote', 'order_product_details', 'daily_summary'],
  dbCredentials: {
    url: process.env.SQLITE_DATABASE_URL!,
  },
})
