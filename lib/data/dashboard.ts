import { prisma } from '@/lib/prisma'
import {
  MOCK_USERS,
  MOCK_LEADS,
  type DashboardUser,
  type DashboardLead,
  type LeadStatus,
} from './dashboard-mocks'

// Re-exports for consumers
export type { DashboardUser, DashboardLead, LeadStatus }

// ─── Users ───────────────────────────────────────────────

export async function getUsers(): Promise<DashboardUser[]> {
  try {
    const db = await prisma.user.findMany({
      include: { profile: true },
      orderBy: { createdAt: 'desc' },
    })
    if (!db || db.length === 0) return MOCK_USERS
    return db.map(mapPrismaUser)
  } catch {
    return MOCK_USERS
  }
}

export async function getUserById(id: string): Promise<DashboardUser | null> {
  try {
    const db = await prisma.user.findUnique({
      where: { id },
      include: { profile: true },
    })
    if (!db) return MOCK_USERS.find((u) => u.id === id) || null
    return mapPrismaUser(db)
  } catch {
    return MOCK_USERS.find((u) => u.id === id) || null
  }
}

// ─── Leads ───────────────────────────────────────────────

export async function getLeads(): Promise<DashboardLead[]> {
  try {
    const db = await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' },
    })
    if (!db || db.length === 0) return MOCK_LEADS
    return db.map(mapPrismaLead)
  } catch {
    return MOCK_LEADS
  }
}

export async function getLeadById(id: string): Promise<DashboardLead | null> {
  try {
    const db = await prisma.lead.findUnique({ where: { id } })
    if (!db) return MOCK_LEADS.find((l) => l.id === id) || null
    return mapPrismaLead(db)
  } catch {
    return MOCK_LEADS.find((l) => l.id === id) || null
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
