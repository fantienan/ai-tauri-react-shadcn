import path from 'node:path'
import { configDotenv } from 'dotenv'
import fs from 'fs-extra'
import type { BizConfig } from './types.ts'

const { NODE_ENV = 'local' } = process.env
const envPath = path.resolve(process.cwd(), '..')

configDotenv({
  path: [path.join(envPath, '.env.local'), path.join(envPath, `.env.${NODE_ENV}`), path.join(envPath, '.env')],
})

const genFile = (name: string) => path.resolve(process.cwd(), '.logs', NODE_ENV!, `${name}.log`)

const config: BizConfig = {
  isProductionEnvironment: process.env.NODE_ENV === 'production',
  drizzleKit: {
    schema: './src/database/schema.ts',
    out: './src/database/migrations',
    dialect: 'sqlite',
    dbCredentials: {
      url: process.env.SQLITE_URL!,
    },
  },
  sqlite: {
    databaseUrl: process.env.SQLITE_URL!,
  },
  tianditu: {
    apiKey: process.env.TIAN_DI_TU_API_KEY!,
  },
  service: {
    host: '0.0.0.0',
    file: genFile('fastify'),
    port: +process.env.BIZ_SERVER_PORT!,
    address: '',
  },
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  },
  llm: {
    deepseek: {
      apiKey: process.env.DEEPSEEK_API_KEY!,
      baseUrl: process.env.DEEPSEEK_BASE_URL!,
    },
  },
  routes: {
    root: '/api/v1',
    llm: {
      prefix: '/llm',
      chat: '/chat',
      vote: '/vote',
      message: '/message',
    },
    user: '/user',
  },
}

fs.ensureDirSync(config.service.file)

export default config
