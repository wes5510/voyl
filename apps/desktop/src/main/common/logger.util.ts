import path from 'node:path'
import pino from 'pino'
import pinoCaller from 'pino-caller'

const isDev = process.env.NODE_ENV === 'development'

const baseLogger = pino({
  level: isDev ? 'debug' : 'info',
  transport: isDev
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
        },
      }
    : undefined,
})

export const logger = isDev
  ? pinoCaller(baseLogger, { relativeTo: path.resolve(__dirname, '../../..') })
  : baseLogger
