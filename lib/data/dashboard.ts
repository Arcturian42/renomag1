import { prisma } from '@/lib/prisma'
import {
  MOCK_USERS,
  MOCK_LEADS,
  type DashboardUser,
  type DashboardLead,
  type LeadStatus,
} from './dashboard-mocks'
import { getCache, setCache, generateCacheKey } from '@/lib/cache'

// Re-exports for consumers
export type { DashboardUser, DashboardLead, LeadStatus }

// ─── Users ───────────────────────────────────────────────

export async function getUsers(): Promise<DashboardUser[]> {
  const cacheKey = generateCacheKey('dashboard:users', {})
  const cached = await getCache<DashboardUser[]>(cacheKey)
  if (cached) return cached

  try {
    const db = await prisma.user.findMany({
      include: { profile: true },
      orderBy: { createdAt: 'desc' },
    })
    if (!db || db.length === 0) {
      await setCache(cacheKey, MOCK_USERS, 60)
      return MOCK_USERS
    }
    const result = db.map(mapPrismaUser)
    await setCache(cacheKey, result, 120)
    return result
  } catch {
    return MOCK_USERS
  }
}

export async function getUserById(id: string): Promise<DashboardUser | null> {
  const cacheKey = generateCacheKey('dashboard:user', { id })
  const cached = await getCache<DashboardUser>(cacheKey)
  if (cached) return cached

  try {
    const db = await prisma.user.findUnique({
      where: { id },
      include: { profile: true },
    })
    if (!db) return null
    const result = mapPrismaUser(db)
    await setCache(cacheKey, result, 300)
    return result
  } catch {
    return null
  }
}

// ─── Leads ───────────────────────────────────────────────

export async function getLeads(): Promise<DashboardLead[]> {
  const cacheKey = generateCacheKey('dashboard:leads', {})
  const cached = await getCache<DashboardLead[]>(cacheKey)
  if (cached) return cached

  try {
    const db = await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' },
    })
    if (!db || db.length === 0) {
      await setCache(cacheKey, MOCK_LEADS, 60)
      return MOCK_LEADS
    }
    const result = db.map(mapPrismaLead)
    await setCache(cacheKey, result, 120)
    return result
  } catch {
    return MOCK_LEADS
  }
}

export async function getLeadById(id: string): Promise<DashboardLead | null> {
  const cacheKey = generateCacheKey('dashboard:lead', { id })
  const cached = await getCache<DashboardLead>(cacheKey)
  if (cached) return cached

  try {
    const db = await prisma.lead.findUnique({ where: { id } })
    if (!db) return null
    const result = mapPrismaLead(db)
    await setCache(cacheKey, result, 300)
    return result
  } catch {
    return null
  }
}

// ─── KPIs ────────────────────────────────────────────────

export function getKpis(users: DashboardUser[], leads: DashboardLead[]) {
  const now = new Date()
  const startOfWeek = new Date(now)
  const day = startOfWeek.getDay()
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1)
  startOfWeek.setDate(diff)
  startOfWeek.setHours(0, 0, 0, 0)

  const totalLeads = leads.length
  const newLeadsThisWeek = leads.filter((l) => new Date(l.createdAt) >= startOfWeek).length
  const convertedLeads = leads.filter((l) => l.status === 'CONVERTED').length
  const qualifiedLeads = leads.filter((l) => l.status === 'QUALIFIED' || l.status === 'CONVERTED').length
  const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : '0'
  const activeUsers = users.filter((u) => u.status === 'active').length

  return {
    totalLeads,
    newLeadsThisWeek,
    conversionRate,
    qualifiedLeads,
    activeUsers,
    totalUsers: users.length,
    totalArtisans: users.filter((u) => u.role === 'ARTISAN').length,
  }
}

// ─── Aggregations ────────────────────────────────────────

export function getLeadsBySource(leads: DashboardLead[]) {
  const map = new Map<string, number>()
  leads.forEach((l) => map.set(l.source, (map.get(l.source) || 0) + 1))
  return Array.from(map.entries()).map(([name, value]) => ({ name, value }))
}

export function getLeadsByCampaign(leads: DashboardLead[]) {
  const map = new Map<string, number>()
  leads.forEach((l) => map.set(l.campaign, (map.get(l.campaign) || 0) + 1))
  return Array.from(map.entries()).map(([name, value]) => ({ name, value }))
}

export function getLeadsByStatus(leads: DashboardLead[]) {
  const map = new Map<string, number>()
  leads.forEach((l) => map.set(l.status, (map.get(l.status) || 0) + 1))
  const labels: Record<string, string> = {
    NEW: 'Nouveau',
    CONTACTED: 'Contacté',
    QUALIFIED: 'Qualifié',
    CONVERTED: 'Converti',
    REJECTED: 'Rejeté',
  }
  return Array.from(map.entries()).map(([name, value]) => ({ name: labels[name] || name, value }))
}

export function getLeadsByPeriod(leads: DashboardLead[]) {
  const map = new Map<string, number>()
  leads.forEach((l) => {
    const date = new Date(l.createdAt)
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    map.set(key, (map.get(key) || 0) + 1)
  })
  return Array.from(map.entries()).sort().map(([name, value]) => ({ name, value }))
}

export function getLeadsByCity(leads: DashboardLead[]) {
  const map = new Map<string, number>()
  leads.forEach((l) => map.set(l.city, (map.get(l.city) || 0) + 1))
  return Array.from(map.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10)
}

export function getLeadsByCountry(leads: DashboardLead[]) {
  const map = new Map<string, number>()
  leads.forEach((l) => map.set(l.country, (map.get(l.country) || 0) + 1))
  return Array.from(map.entries()).map(([name, value]) => ({ name, value }))
}

// ─── Mappers ─────────────────────────────────────────────

function mapPrismaUser(u: any): DashboardUser {
  return {
    id: u.id,
    email: u.email,
    role: u.role,
    createdAt: u.createdAt?.toISOString?.() ?? u.createdAt,
    updatedAt: u.updatedAt?.toISOString?.() ?? u.updatedAt,
    profile: u.profile
      ? {
          firstName: u.profile.firstName ?? null,
          lastName: u.profile.lastName ?? null,
          phone: u.profile.phone ?? null,
          city: u.profile.city ?? null,
          zipCode: u.profile.zipCode ?? null,
        }
      : null,
    status: (u.status === 'inactive' ? 'inactive' : 'active') as 'active' | 'inactive',
    source: u.source ?? 'Direct',
  }
}

function mapPrismaLead(l: any): DashboardLead {
  return {
    id: l.id,
    firstName: l.firstName,
    lastName: l.lastName,
    email: l.email,
    phone: l.phone,
    zipCode: l.zipCode,
    department: l.department,
    city: l.city ?? l.department,
    projectType: l.projectType,
    description: l.description ?? null,
    budget: l.budget ?? null,
    status: l.status,
    score: l.score ?? null,
    source: l.source ?? 'Formulaire devis',
    campaign: l.campaign ?? 'Organic',
    country: l.country ?? 'France',
    createdAt: l.createdAt?.toISOString?.() ?? l.createdAt,
    updatedAt: l.updatedAt?.toISOString?.() ?? l.updatedAt,
  }
}

// ─── Cursor-based pagination ─────────────────────────────

export interface CursorPaginationArgs {
  cursor?: string
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface CursorPaginationResult<T> {
  items: T[]
  nextCursor: string | null
  hasMore: boolean
}

export async function getUsersCursor(
  args: CursorPaginationArgs = {}
): Promise<CursorPaginationResult<DashboardUser>> {
  const limit = Math.min(100, Math.max(1, args.limit ?? 20))
  const orderBy = args.sortBy === 'email' ? { email: args.sortOrder ?? 'asc' } : { createdAt: args.sortOrder ?? 'desc' }

  const db = await prisma.user.findMany({
    take: limit + 1,
    ...(args.cursor ? { skip: 1, cursor: { id: args.cursor } } : {}),
    orderBy,
    include: { profile: true },
  })

  const hasMore = db.length > limit
  const items = hasMore ? db.slice(0, -1) : db
  const nextCursor = hasMore ? items[items.length - 1].id : null

  return { items: items.map(mapPrismaUser), nextCursor, hasMore }
}

export async function getLeadsCursor(
  args: CursorPaginationArgs = {}
): Promise<CursorPaginationResult<DashboardLead>> {
  const limit = Math.min(100, Math.max(1, args.limit ?? 20))
  const orderBy = args.sortBy === 'score' ? { score: args.sortOrder ?? 'desc' } : { createdAt: args.sortOrder ?? 'desc' }

  const db = await prisma.lead.findMany({
    take: limit + 1,
    ...(args.cursor ? { skip: 1, cursor: { id: args.cursor } } : {}),
    orderBy,
  })

  const hasMore = db.length > limit
  const items = hasMore ? db.slice(0, -1) : db
  const nextCursor = hasMore ? items[items.length - 1].id : null

  return { items: items.map(mapPrismaLead), nextCursor, hasMore }
}
