import BetterSqlite3 from 'better-sqlite3'
import { config } from '../../config/index.ts'
import { logger } from '../../utils/index.ts'

export function getErrorMessage(error: unknown) {
  if (error == null) {
    return 'unknown error'
  }

  if (typeof error === 'string') {
    return error
  }

  if (error instanceof Error) {
    return error.message
  }

  return JSON.stringify(error)
}

export const getDatabase = () => {
  return BetterSqlite3(config.sqlite.databaseUrl, {
    verbose: (a, b, ...args) => {
      logger.info(a, (b as any)?.toString(), ...args)
    },
  })
}
