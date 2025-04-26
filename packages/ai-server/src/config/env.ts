import path from 'node:path'
import { configDotenv } from 'dotenv'
import { expand } from 'dotenv-expand'
import findConfig from 'find-config'

const { NODE_ENV = 'local' } = process.env

let envPath = findConfig('.env', { dot: true })

if (!envPath) throw new Error('Cannot find .env file')

envPath = path.dirname(envPath)
expand(
  configDotenv({
    path: [path.join(envPath, '.env.local'), path.join(envPath, `.env.${NODE_ENV}`), path.join(envPath, '.env')],
  }),
)
