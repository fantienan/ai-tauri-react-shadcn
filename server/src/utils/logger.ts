import { pino } from 'pino';
import { config } from '../config/index.ts';

let pinoLogger = pino({
  transport: {
    options: {
      destination: config.service.file,
    },
    target: 'pino/file',
  },
});

if (process.env.NODE_ENV !== 'production') {
  pinoLogger = pino({
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
        colorize: true,
      },
    },
  });
}

export const logger = pinoLogger;
