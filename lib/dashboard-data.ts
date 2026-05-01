import { prisma } from '@/lib/prisma'

// Types basés sur le schéma Prisma
export type DashboardUser = {
  id: string
  email: string
  role: 'USER' | 'ARTISAN' | 'ADMIN'
  createdAt: string
  updatedAt: string
  profile?: {
    firstName: string | null
    lastName: string | null
    phone: string | null
    city: string | null
    zipCode: string | null
  } | null
  status: 'active' | 'inactive'
  source: string
}

export type LeadStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'CONVERTED' | 'REJECTED'

export type DashboardLead = {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  zipCode: string
  department: string
  city: string
  projectType: string
  description: string | null
  budget: string | null
  status: LeadStatus
  score: number | null
  source: string
  campaign: string
  country: string
  createdAt: string
  updatedAt: string
}

// Données mockées réalistes (fallback si la DB n'est pas accessible)
const USER_SOURCES = ['Organic', 'Google Ads', 'Facebook', 'Instagram', 'Referral', 'Direct', 'Email']
const LEAD_SOURCES = ['Formulaire devis', 'Landing page PAC', 'Landing page Isolation', 'Facebook Ads', 'Google Ads', 'Partenaire', 'Appel entrant']
const CAMPAIGNS = ['Campagne Hiver 2024', 'Campagne PAC 2024', 'Promo Isolation', 'Google Search - Rénovation', 'Facebook Lead Gen', 'Newsletter Janvier', 'SEO Organique']
const CITIES = ['Paris', 'Lyon', 'Marseille', 'Bordeaux', 'Nantes', 'Toulouse', 'Lille', 'Strasbourg', 'Nice', 'Rennes']
const DEPARTMENTS = ['75', '69', '13', '33', '44', '31', '59', '67', '06', '35']
const PROJECT_TYPES = ['Rénovation globale', 'Isolation des combles', 'Pompe à chaleur', 'Chauffage', 'Menuiserie', 'VMC double flux', 'Solaire thermique']
const BUDGETS = ['< 5 000€', '5 000€ - 10 000€', '10 000€ - 30 000€', '30 000€ - 50 000€', '> 50 000€']

function randomDate(start: Date, end: Date): string {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
  return date.toISOString()
}

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function generateUsers(count: number): DashboardUser[] {
  const firstNames = ['Jean', 'Marie', 'Pierre', 'Sophie', 'Lucas', 'Emma', 'Hugo', 'Léa', 'Thomas', 'Camille', 'Nicolas', 'Julie', 'Alexandre', 'Sarah', 'Maxime', 'Laura']
  const lastNames = ['Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Petit', 'Durand', 'Leroy', 'Moreau', 'Simon', 'Laurent', 'Lefebvre', 'Michel', 'Garcia', 'Roux', 'Bonnet']

  return Array.from({ length: count }, (_, i) => {
    const firstName = randomItem(firstNames)
    const lastName = randomItem(lastNames)
    const createdAt = randomDate(new Date('2024-01-01'), new Date())
    return {
      id: `user-${i + 1}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i + 1}@email.fr`,
      role: randomItem(['USER', 'USER', 'USER', 'ARTISAN', 'ARTISAN', 'ADMIN']),
      createdAt,
      updatedAt: createdAt,
      profile: {
        firstName,
        lastName,
        phone: `06${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
        city: randomItem(CITIES),
        zipCode: randomItem(DEPARTMENTS) + Math.floor(Math.random() * 1000).toString().padStart(3, '0'),
      },
      status: Math.random() > 0.15 ? 'active' : 'inactive',
      source: randomItem(USER_SOURCES),
    }
  })
}

function generateLeads(count: number): DashboardLead[] {
  const firstNames = ['Jean', 'Marie', 'Pierre', 'Sophie', 'Lucas', 'Emma', 'Hugo', 'Léa', 'Thomas', 'Camille', 'Nicolas', 'Julie', 'Alexandre', 'Sarah', 'Maxime', 'Laura', 'David', 'Emilie']
  const lastNames = ['Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Petit', 'Durand', 'Leroy', 'Moreau', 'Simon', 'Laurent', 'Lefebvre', 'Michel', 'Garcia', 'Roux', 'Bonnet', 'André', 'Mercier']

  return Array.from({ length: count }, (_, i) => {
    const firstName = randomItem(firstNames)
    const lastName = randomItem(lastNames)
    const deptIndex = Math.floor(Math.random() * DEPARTMENTS.length)
    const createdAt = randomDate(new Date('2024-01-01'), new Date())
    const status = randomItem(['NEW', 'NEW', 'CONTACTED', 'CONTACTED', 'QUALIFIED', 'QUALIFIED', 'CONVERTED', 'REJECTED']) as LeadStatus
    return {
      id: `lead-${i + 1}`,
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i + 100}@email.fr`,
      phone: `06${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
      zipCode: DEPARTMENTS[deptIndex] + Math.floor(Math.random() * 1000).toString().padStart(3, '0'),
      department: DEPARTMENTS[deptIndex],
      city: CITIES[deptIndex],
      projectType: randomItem(PROJECT_TYPES),
      description: 'Demande de devis pour rénovation énergétique. Maison individuelle construite dans les années 80.',
      budget: randomItem(BUDGETS),
      status,
      score: Math.floor(Math.random() * 100),
      source: randomItem(LEAD_SOURCES),
      campaign: randomItem(CAMPAIGNS),
      country: 'France',
      createdAt,
      updatedAt: createdAt,
    }
  })
}

export const MOCK_USERS = generateUsers(120)
export const MOCK_LEADS = generateLeads(350)

// ========================
// PRISMA — VRAIES DONNÉES
// ========================

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

export async function getUsers(): Promise<DashboardUser[]> {
  try {
    const db = await prisma.user.findMany({
      include: { profile: true },
      orderBy: { createdAt: 'desc' },
    })
    if (!db || db.length === 0) return MOCK_USERS
    return db.map(mapPrismaUser)
  } catch (err) {
    console.warn('[dashboard-data] getUsers failed, using mocks:', err)
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
  } catch (err) {
    console.warn('[dashboard-data] getUserById failed, using mocks:', err)
    return MOCK_USERS.find((u) => u.id === id) || null
  }
}

export async function getLeads(): Promise<DashboardLead[]> {
  try {
    const db = await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' },
    })
    if (!db || db.length === 0) return MOCK_LEADS
    return db.map(mapPrismaLead)
  } catch (err) {
    console.warn('[dashboard-data] getLeads failed, using mocks:', err)
    return MOCK_LEADS
  }
}

export async function getLeadById(id: string): Promise<DashboardLead | null> {
  try {
    const db = await prisma.lead.findUnique({ where: { id } })
    if (!db) return MOCK_LEADS.find((l) => l.id === id) || null
    return mapPrismaLead(db)
  } catch (err) {
    console.warn('[dashboard-data] getLeadById failed, using mocks:', err)
    return MOCK_LEADS.find((l) => l.id === id) || null
  }
}

// KPIs
export function getKpis(users: DashboardUser[], leads: DashboardLead[]) {
  const now = new Date()
  const startOfWeek = new Date(now)
  const day = startOfWeek.getDay() // 0 = dimanche, 1 = lundi
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

// Agrégations pour graphiques
export function getLeadsBySource(leads: DashboardLead[]) {
  const map = new Map<string, number>()
  leads.forEach((l) => {
    map.set(l.source, (map.get(l.source) || 0) + 1)
  })
  return Array.from(map.entries()).map(([name, value]) => ({ name, value }))
}

export function getLeadsByCampaign(leads: DashboardLead[]) {
  const map = new Map<string, number>()
  leads.forEach((l) => {
    map.set(l.campaign, (map.get(l.campaign) || 0) + 1)
  })
  return Array.from(map.entries()).map(([name, value]) => ({ name, value }))
}

export function getLeadsByStatus(leads: DashboardLead[]) {
  const map = new Map<string, number>()
  leads.forEach((l) => {
    map.set(l.status, (map.get(l.status) || 0) + 1)
  })
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
  leads.forEach((l) => {
    map.set(l.city, (map.get(l.city) || 0) + 1)
  })
  return Array.from(map.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10)
}

export function getLeadsByCountry(leads: DashboardLead[]) {
  const map = new Map<string, number>()
  leads.forEach((l) => {
    map.set(l.country, (map.get(l.country) || 0) + 1)
  })
  return Array.from(map.entries()).map(([name, value]) => ({ name, value }))
}
