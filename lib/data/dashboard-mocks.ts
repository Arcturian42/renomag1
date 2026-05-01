// Fallback mock data used when DATABASE_URL is not configured
// These are automatically served by lib/data/dashboard.ts when Prisma fails

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
