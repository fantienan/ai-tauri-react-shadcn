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
  },
  llm: {
    deepseek: {
      apiKey: process.env.DEEPSEEK_API_KEY!,
      baseUrl: process.env.DEEPSEEK_URL!,
    },
  },
  routes: {
    root: '/api/v1',
    llm: {
      prefix: '/llm',
      chat: '/chat',
    },
  },
}

fs.ensureDirSync(config.service.file)

export default config
