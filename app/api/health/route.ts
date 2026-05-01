import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { Redis } from '@upstash/redis'

export const dynamic = 'force-dynamic'

export async function GET() {
  const checks: Record<string, 'ok' | 'error' | 'unknown'> = {}
  let status = 200

  // Database check
  try {
    await prisma.$queryRaw`SELECT 1`
    checks.database = 'ok'
  } catch {
    checks.database = 'error'
    status = 503
  }

  // Supabase Auth check
  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.getSession()
    checks.auth = error ? 'error' : 'ok'
    if (error) status = 503
  } catch {
    checks.auth = 'error'
    status = 503
  }

  // Redis cache check
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN
  if (redisUrl && redisToken) {
    try {
      const redis = new Redis({ url: redisUrl, token: redisToken })
      await redis.ping()
      checks.cache = 'ok'
    } catch {
      checks.cache = 'error'
      status = 503
    }
  } else {
    checks.cache = 'unknown'
  }

  return NextResponse.json(
    {
      status: status === 200 ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version ?? 'unknown',
      checks,
    },
    { status }
  )
}
