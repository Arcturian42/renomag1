/**
 * Simple isomorphic logger.
 * In production, only error and warn are emitted.
 */
/* eslint-disable no-console */
const isProd = process.env.NODE_ENV === 'production'

export const logger = {
  info: (...args: unknown[]) => {
    if (!isProd) console.info(...args)
  },
  warn: (...args: unknown[]) => {
    console.warn(...args)
  },
  error: (...args: unknown[]) => {
    console.error(...args)
  },
  debug: (...args: unknown[]) => {
    if (!isProd) console.debug(...args)
  },
}
