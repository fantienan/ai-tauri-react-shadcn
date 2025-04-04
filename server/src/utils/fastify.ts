import type { FastifyServerOptions } from 'fastify'
import { config } from '../config/index.ts'

export const getFastifyOptions = () => {
  const options: FastifyServerOptions = {
    logger: {
      file: config.service.file,
    },
  }
  if (process.env.NODE_ENV === 'production') return options

  options.logger = {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
        colorize: true,
      },
    },
  }
  return options
}
