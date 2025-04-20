import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { config } from '../config/index.ts'

const sqlite = new Database(config.sqlite.databaseUrl)

export const sqliteDb = drizzle({ client: sqlite })
