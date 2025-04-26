import './env.ts'
import path from 'node:path'
import fs from 'fs-extra'
import type { BizConfig } from './types.ts'

const { NODE_ENV = 'local' } = process.env

const genFile = (name: string) => path.resolve(process.env.BIZ_WORKSPACE, '.logs', NODE_ENV!, `${name}.log`)

const config: BizConfig = {
  isProductionEnvironment: process.env.NODE_ENV === 'production',
  sqlite: {
    databaseUrl: process.env.SQLITE_DATABASE_URL!,
  },
  tianditu: {
    apiKey: process.env.BIZ_TIAN_DI_TU_API_KEY!,
  },
  service: {
    host: '0.0.0.0',
    file: genFile('fastify'),
    port: +process.env.BIZ_NODE_SERVER_PORT!,
    address: '',
  },
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  },
  llm: {
    deepseek: {
      apiKey: process.env.DEEPSEEK_API_KEY!,
      BASE_URL: process.env.DEEPSEEK_BASE_URL!,
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
