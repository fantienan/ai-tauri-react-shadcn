import type { FastifyCorsOptions, FastifyCorsOptionsDelegate } from '@fastify/cors'
import type { Config } from 'drizzle-kit'

export type BizConfig = {
  isProductionEnvironment: boolean
  service: {
    file: string
    port: number
    host: string
    address: string
  }
  cors: NonNullable<FastifyCorsOptions> | FastifyCorsOptionsDelegate

  llm: {
    deepseek: {
      apiKey: string
      baseUrl: string
    }
  }
  drizzleKit: Config & {
    dbCredentials: {
      url: string
    }
  }
  sqlite: {
    databaseUrl: string
  }
  tianditu: {
    apiKey: string
  }
  routes: {
    root: string

    llm: {
      prefix: string
      chat: string
    }
  }
}
