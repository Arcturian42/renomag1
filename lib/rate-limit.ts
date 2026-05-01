import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { headers } from 'next/headers'

// In-memory fallback for local development (single-process only)
class MemoryStore {
  private map = new Map<string, { count: number; resetAt: number }>()

  async get(key: string): Promise<{ count: number; resetAt: number } | null> {
    const data = this.map.get(key)
    if (!data) return null
    if (Date.now() > data.resetAt) {
      this.map.delete(key)
      return null
    }
    return data
  }

  async set(key: string, data: { count: number; resetAt: number }): Promise<void> {
    this.map.set(key, data)
  }
}

function createRateLimiter(
  requests: number,
  window: string,
  prefix: string
) {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN

  if (url && token) {
    return new Ratelimit({
      redis: new Redis({ url, token }),
      limiter: Ratelimit.slidingWindow(requests, window as `${number} s` | `${number} m` | `${number} h` | `${number} d`),
      prefix: `renomag:${prefix}`,
      analytics: true,
    })
  }

  // Fallback: in-memory rate limiter for development
  const store = new MemoryStore()
  const windowMs = parseWindow(window)

  return {
    async limit(identifier: string) {
      const key = `renomag:${prefix}:${identifier}`
      const existing = await store.get(key)

      if (!existing) {
        const resetAt = Date.now() + windowMs
        await store.set(key, { count: 1, resetAt })
        return { success: true, limit: requests, remaining: requests - 1, reset: resetAt }
      }

      if (existing.count >= requests) {
        return { success: false, limit: requests, remaining: 0, reset: existing.resetAt }
      }

      existing.count += 1
      await store.set(key, existing)
      return { success: true, limit: requests, remaining: requests - existing.count, reset: existing.resetAt }
    },
  } as Ratelimit
}

function parseWindow(window: string): number {
  const match = window.match(/^(\d+)\s*(s|m|h|d)$/)
  if (!match) return 60_000
  const [, num, unit] = match
  const multipliers: Record<string, number> = { s: 1000, m: 60_000, h: 3600_000, d: 86400_000 }
  return parseInt(num) * (multipliers[unit] ?? 60_000)
}

// Rate limiters instances
export const ratelimit = {
  // Public forms: 5 requests per minute per IP
  publicForm: createRateLimiter(5, '1 m', 'public_form'),

  // Auth endpoints: 10 requests per minute per IP
  auth: createRateLimiter(10, '1 m', 'auth'),

  // API/global: 100 requests per minute per IP
  api: createRateLimiter(100, '1 m', 'api'),

  // Heavy operations: 3 requests per hour per IP
  heavy: createRateLimiter(3, '1 h', 'heavy'),
}

export async function getClientIdentifier(): Promise<string> {
  const h = await headers()
  const forwarded = h.get('x-forwarded-for')
  const realIp = h.get('x-real-ip')
  const ip = forwarded?.split(',')[0]?.trim() || realIp || 'unknown'
  return ip
}

export class RateLimitError extends Error {
  constructor(
    message = 'Too many requests. Please try again later.',
    public readonly resetAt?: number
  ) {
    super(message)
    this.name = 'RateLimitError'
  }
}

// Legacy compatibility for existing code
export async function rateLimit(identifier: string, requests: number, windowMs: number) {
  const windowStr = windowMs < 60000 ? `${Math.round(windowMs / 1000)} s` : `${Math.round(windowMs / 60000)} m`
  const limiter = createRateLimiter(requests, windowStr, 'legacy')
  const result = await limiter.limit(identifier)
  return result
}
