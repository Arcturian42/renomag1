import pino from 'pino'

const isProd = process.env.NODE_ENV === 'production'

export const logger = pino({
  level: process.env.LOG_LEVEL ?? (isProd ? 'warn' : 'debug'),
  transport: isProd
    ? undefined
    : {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
        },
      },
  base: {
    env: process.env.NODE_ENV ?? 'development',
    version: process.env.npm_package_version,
  },
})

export function getRequestLogger(requestId: string) {
  return logger.child({ requestId })
}
