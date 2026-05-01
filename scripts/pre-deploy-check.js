#!/usr/bin/env node
/**
 * Pre-deployment check script
 * Run with: node scripts/pre-deploy-check.js
 */

const requiredEnvVars = [
  'DATABASE_URL',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'NEXT_PUBLIC_APP_URL',
  'DASHBOARD_PASSWORD',
]

const optionalEnvVars = [
  'UPSTASH_REDIS_REST_URL',
  'UPSTASH_REDIS_REST_TOKEN',
  'SENTRY_DSN',
  'LOG_LEVEL',
]

let exitCode = 0

console.log('🔍 Pre-deployment check\n')

// Required
for (const key of requiredEnvVars) {
  const value = process.env[key]
  if (!value || value.includes('placeholder') || value.includes('changeme')) {
    console.log(`❌ ${key}: MISSING or placeholder`)
    exitCode = 1
  } else {
    console.log(`✅ ${key}: OK`)
  }
}

// Optional
console.log('')
for (const key of optionalEnvVars) {
  const value = process.env[key]
  if (!value) {
    console.log(`⚠️  ${key}: not set (optional)`)
  } else {
    console.log(`✅ ${key}: OK`)
  }
}

// URL checks
console.log('')
const appUrl = process.env.NEXT_PUBLIC_APP_URL
if (appUrl) {
  try {
    const url = new URL(appUrl)
    if (url.protocol !== 'https:') {
      console.log(`⚠️  NEXT_PUBLIC_APP_URL should use HTTPS in production (${appUrl})`)
    } else {
      console.log(`✅ NEXT_PUBLIC_APP_URL uses HTTPS`)
    }
  } catch {
    console.log(`❌ NEXT_PUBLIC_APP_URL is not a valid URL`)
    exitCode = 1
  }
}

// Supabase URL check
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
if (supabaseUrl) {
  try {
    new URL(supabaseUrl)
    console.log(`✅ NEXT_PUBLIC_SUPABASE_URL is valid`)
  } catch {
    console.log(`❌ NEXT_PUBLIC_SUPABASE_URL is not a valid URL`)
    exitCode = 1
  }
}

console.log('')
if (exitCode === 0) {
  console.log('🚀 All checks passed! Ready for deployment.')
} else {
  console.log('🚫 Some checks failed. Fix the issues above before deploying.')
}

process.exit(exitCode)
