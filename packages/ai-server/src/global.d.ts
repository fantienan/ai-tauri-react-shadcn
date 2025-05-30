import multer from 'fastify-multer'
import type { BizConfig } from './config/index.ts'
import { AgentControllerInstance, Result, errors, sqliteDb } from './decorates/index.ts'
import * as schemas from './schemas/index.ts'
import { dashboardSchema } from './utils/index.ts'

declare module 'fastify' {
  interface FastifyInstance {
    bizAppConfig: BizConfig
    BizResult: typeof Result
    bizError: typeof errors
    bizAgentController: AgentControllerInstance
    bizDb: typeof sqliteDb
    bizSchemas: typeof schemas
    session: { user: { id: string } }
    bizDashboardSchema: typeof dashboardSchema
  }
}
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      POSTGRES_HOST: string
      POSTGRES_PORT: number
      POSTGRES_USER: string
      POSTGRES_PASSWORD: string
      SQLITE_DATABASE_URL: string
      BIZ_NODE_SERVER_PORT: number
      BIZ_NODE_SERVER_URL: string
      BIZ_TIAN_DI_TU_API_KEY: string
      DEEPSEEK_URL?: string
      DEEPSEEK_API_KEY?: string
      BIZ_WORKSPACE: string
    }
  }
}
