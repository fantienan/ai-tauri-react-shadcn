import multer from 'fastify-multer'
import type { BizConfig } from './config/index.ts'
import { Agent, Result, errors, sqliteDb } from './decorates/index.ts'
import * as schemas from './schemas/index.ts'

declare module 'fastify' {
  interface FastifyInstance {
    bizAppConfig: BizConfig
    BizResult: typeof Result
    bizErrors: typeof errors
    bizAgent: InstanceType<typeof Agent>
    bizDb: typeof sqliteDb
    bizSchemas: typeof schemas
    session: { user: { id: string } }
  }
}
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      POSTGRES_HOST: string
      POSTGRES_PORT: number
      POSTGRES_USER: string
      POSTGRES_PASSWORD: string
      SQLITE_URL: string
      BIZ_SERVER_PORT: number
      BIZ_SERVER_URL: string
      TIAN_DI_TU_API_KEY: string
      DEEPSEEK_URL?: string
      DEEPSEEK_API_KEY?: string
    }
  }
}
