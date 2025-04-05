import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import { config } from '../config/index.ts'

const runMigrate = async () => {
  if (!config.drizzleKit.dbCredentials.url) {
    throw new Error('sqlite database url is not defined')
  }

  const sqlite = new Database(config.sqlite.databaseUrl)

  const db = drizzle({ client: sqlite })

  console.log('⏳ Running migrations...')

  const start = Date.now()
  await migrate(db, { migrationsFolder: './lib/db/migrations' })
  const end = Date.now()

  console.log('✅ Migrations completed in', end - start, 'ms')
  process.exit(0)
}

runMigrate().catch((err) => {
  console.error('❌ Migration failed')
  console.error(err)
  process.exit(1)
})
