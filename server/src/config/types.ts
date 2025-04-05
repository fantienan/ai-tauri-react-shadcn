import type { FastifyCorsOptions, FastifyCorsOptionsDelegate } from '@fastify/cors'
import type { Config } from 'drizzle-kit'

export type BizConfig = {
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
  drizzleKit: Config
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
