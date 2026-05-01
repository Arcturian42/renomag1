import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createHash } from 'crypto'

const DASHBOARD_PASSWORD = process.env.DASHBOARD_PASSWORD
const COOKIE_NAME = 'dashboard_session'

if (!DASHBOARD_PASSWORD) {
  console.warn('[dashboard-auth] DASHBOARD_PASSWORD is not set. Using a random fallback for development only.')
}

const effectivePassword = DASHBOARD_PASSWORD ?? `dev-fallback-${process.env.NODE_ENV}-${Date.now()}`
const HASHED_PASSWORD = createHash('sha256').update(effectivePassword).digest('hex')

export function verifyDashboardPassword(password: string): boolean {
  const hash = createHash('sha256').update(password).digest('hex')
  return hash === HASHED_PASSWORD
}

export function setDashboardSession() {
  const cookieStore = cookies()
  cookieStore.set(COOKIE_NAME, HASHED_PASSWORD, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 7 jours
    path: '/dashboard-prive',
  })
}

export function clearDashboardSession() {
  const cookieStore = cookies()
  cookieStore.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/dashboard-prive',
  })
}

export function requireDashboardAuth() {
  const cookieStore = cookies()
  const session = cookieStore.get(COOKIE_NAME)
  if (!session || session.value !== HASHED_PASSWORD) {
    redirect('/dashboard-prive')
  }
}

export function isDashboardAuthenticated(): boolean {
  const cookieStore = cookies()
  const session = cookieStore.get(COOKIE_NAME)
  return session?.value === HASHED_PASSWORD
}
