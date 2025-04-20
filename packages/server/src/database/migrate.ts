import path from 'path'
import { fileURLToPath } from 'url'
import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import { config } from '../config/index.ts'

// 获取 __dirname 的等效值
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const runMigrate = async () => {
  if (!config.drizzleKit.dbCredentials.url) {
    throw new Error('sqlite database url is not defined')
  }

  const sqlite = new Database(config.sqlite.databaseUrl)

  const db = drizzle({ client: sqlite })

  console.log('⏳ Running migrations...')

  const start = Date.now()
  migrate(db, { migrationsFolder: path.join(__dirname, './migrations') })
  const end = Date.now()

  console.log('✅ Migrations completed in', end - start, 'ms')
  process.exit(0)
}

runMigrate().catch((err) => {
  console.error('❌ Migration failed')
  console.error(err)
  process.exit(1)
})
