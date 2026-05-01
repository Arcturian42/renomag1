import { describe, it, expect, beforeEach } from 'vitest'
import { ratelimit, RateLimitError } from '@/lib/rate-limit'

describe('Rate limiting', () => {
  beforeEach(() => {
    // Small delay to avoid timing issues between tests
  })

  it('allows requests under the limit', async () => {
    const result = await ratelimit.publicForm.limit('test-ip-1')
    expect(result.success).toBe(true)
    expect(result.remaining).toBeGreaterThanOrEqual(0)
  })

  it('blocks requests over the limit', async () => {
    const ip = 'test-ip-2'
    // Exhaust the limit (5 requests per minute)
    for (let i = 0; i < 5; i++) {
      await ratelimit.publicForm.limit(ip)
    }
    const result = await ratelimit.publicForm.limit(ip)
    expect(result.success).toBe(false)
  })

  it('RateLimitError has correct message', () => {
    const err = new RateLimitError('Too many requests', 12345)
    expect(err.message).toBe('Too many requests')
    expect(err.resetAt).toBe(12345)
    expect(err.name).toBe('RateLimitError')
  })

  it('auth limiter has higher quota', async () => {
    const ip = 'test-ip-3'
    const result = await ratelimit.auth.limit(ip)
    expect(result.success).toBe(true)
    expect(result.limit).toBe(10)
  })
})
