#!/usr/bin/env tsx
/**
 * Seed script using Supabase REST API
 * Run: npx tsx scripts/seed-supabase.ts
 */

import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const SPECIALTIES = [
  'Isolation thermique',
  'Pompe à chaleur',
  'Photovoltaïque',
  'Chauffe-eau solaire',
  'VMC Double flux',
  'ITE (Isolation par l\'extérieur)',
  'Isolation combles',
  'Menuiseries',
  'Chaudière biomasse',
  'Poêle à granulés',
]

const CERTIFICATIONS = [
  { code: 'RGE', name: 'Reconnu Garant de l\'Environnement' },
  { code: 'QualiPAC', name: 'Qualification PAC' },
  { code: 'QualiSol', name: 'Qualification Solaire' },
  { code: 'Qualibois', name: 'Qualification Biomasse' },
  { code: 'QualiPV', name: 'Qualification Photovoltaïque' },
  { code: 'Eco Artisan', name: 'Label Eco Artisan' },
]

const REGIONS = [
  'Île-de-France',
  'Auvergne-Rhône-Alpes',
  "Provence-Alpes-Côte d'Azur",
  'Hauts-de-France',
  'Nouvelle-Aquitaine',
  'Pays de la Loire',
  'Occitanie',
  'Bretagne',
  'Grand Est',
  'Normandie',
  'Centre-Val de Loire',
  'Bourgogne-Franche-Comté',
]

const CITIES = [
  ['Paris', '75', 'Île-de-France'],
  ['Lyon', '69', 'Auvergne-Rhône-Alpes'],
  ['Marseille', '13', "Provence-Alpes-Côte d'Azur"],
  ['Bordeaux', '33', 'Nouvelle-Aquitaine'],
  ['Nantes', '44', 'Pays de la Loire'],
  ['Toulouse', '31', 'Occitanie'],
  ['Lille', '59', 'Hauts-de-France'],
  ['Strasbourg', '67', 'Grand Est'],
  ['Rennes', '35', 'Bretagne'],
  ['Nice', '06', "Provence-Alpes-Côte d'Azur"],
]

const FIRST_NAMES = ['Jean', 'Marie', 'Pierre', 'Sophie', 'Lucas', 'Emma', 'Hugo', 'Léa', 'Thomas', 'Camille']
const LAST_NAMES = ['Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Petit', 'Durand', 'Leroy', 'Moreau', 'Simon']

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

async function seedSpecialties() {
  console.log('Seeding specialties...')
  for (const name of SPECIALTIES) {
    const { error } = await supabase.from('Specialty').upsert({ name }, { onConflict: 'name' })
    if (error) console.error('Specialty error:', error.message)
  }
}

async function seedCertifications() {
  console.log('Seeding certifications...')
  for (const cert of CERTIFICATIONS) {
    const { error } = await supabase.from('Certification').upsert(cert, { onConflict: 'code' })
    if (error) console.error('Certification error:', error.message)
  }
}

async function seedUsers() {
  console.log('Seeding users...')
  const users = Array.from({ length: 10 }, (_, i) => {
    const firstName = FIRST_NAMES[i % FIRST_NAMES.length]
    const lastName = LAST_NAMES[i % LAST_NAMES.length]
    return {
      id: `seed-user-${i + 1}`,
      email: `${slugify(firstName)}.${slugify(lastName)}${i + 1}@renomag.fr`,
      role: i < 3 ? 'ADMIN' : i < 7 ? 'ARTISAN' : 'USER',
      status: 'active',
      source: 'Seed',
    }
  })

  for (const user of users) {
    const { error } = await supabase.from('User').upsert(user, { onConflict: 'id' })
    if (error) console.error('User error:', error.message)
  }
  return users
}

async function seedArtisans(users: any[]) {
  console.log('Seeding artisans...')
  const artisanUsers = users.filter((u) => u.role === 'ARTISAN')

  for (let i = 0; i < artisanUsers.length; i++) {
    const user = artisanUsers[i]
    const [city, dept, region] = CITIES[i % CITIES.length]
    const companyName = `${city} Rénovation ${i + 1}`
    const slug = slugify(companyName)

    const { error } = await supabase.from('ArtisanCompany').upsert(
      {
        id: `seed-artisan-${i + 1}`,
        userId: user.id,
        slug,
        name: companyName,
        siret: `${dept}${String(i + 1).padStart(3, '0')}0001${String(i + 1).padStart(2, '0')}`,
        description: `Artisan RGE certifié spécialisé en rénovation énergétique à ${city}.`,
        address: `${(i + 1) * 12} Rue de la République`,
        city,
        zipCode: `${dept}00${(i + 1) % 10}`,
        department: dept,
        region,
        phone: `01${dept}${String(i + 1).padStart(2, '0')}${String(i + 1).padStart(2, '0')}${(i + 1) % 10}`,
        email: `contact@${slug}.fr`,
        website: `https://${slug}.fr`,
        rating: 4 + Math.random(),
        reviewCount: Math.floor(Math.random() * 50),
        projectCount: Math.floor(Math.random() * 200),
        yearsExperience: 5 + Math.floor(Math.random() * 20),
        responseTime: '< 2h',
        verified: true,
        premium: i % 3 === 0,
        available: true,
        since: 2010 + i,
        gallery: [],
      },
      { onConflict: 'id' }
    )
    if (error) console.error('Artisan error:', error.message)
  }
}

async function seedArticles() {
  console.log('Seeding articles...')
  const articles = [
    {
      id: 'seed-article-1',
      slug: 'maprimrenov-2024-tout-savoir',
      title: "MaPrimeRénov' 2024 : le guide complet",
      excerpt: "Tout ce que vous devez savoir sur MaPrimeRénov' en 2024.",
      content: "Contenu détaillé sur MaPrimeRénov'...",
      readTime: 8,
      image: 'https://images.unsplash.com/photo-1581578731117-104f2a863a30',
      tags: ['MaPrimeRénov', 'Aides', 'Rénovation'],
      featured: true,
    },
    {
      id: 'seed-article-2',
      slug: 'isolation-combles-guide',
      title: 'Isolation des combles : le guide pratique',
      excerpt: 'Comment isoler vos combles et économiser jusqu\'à 30% sur votre facture énergétique.',
      content: "Contenu détaillé sur l'isolation des combles...",
      readTime: 6,
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
      tags: ['Isolation', 'Énergie', 'Guide'],
      featured: false,
    },
  ]

  for (const article of articles) {
    const { error } = await supabase.from('Article').upsert(article, { onConflict: 'id' })
    if (error) console.error('Article error:', error.message)
  }
}

async function main() {
  console.log('🌱 Starting Supabase seed...\n')

  await seedSpecialties()
  await seedCertifications()
  const users = await seedUsers()
  await seedArtisans(users)
  await seedArticles()

  console.log('\n✅ Seed complete!')
}

main().catch(console.error)
