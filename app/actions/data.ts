'use server'

import { prisma } from '@/lib/prisma'
import type { Artisan } from '@/lib/data/artisans'
import type { Article } from '@/lib/data/blog'

// ==================== LEADS ====================

export async function submitLead(formData: FormData): Promise<{ success: boolean; error?: string }> {
  try {
    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const zipCode = formData.get('zipCode') as string
    const department = formData.get('department') as string
    const projectType = formData.get('projectType') as string
    const description = formData.get('description') as string
    const budget = formData.get('budget') as string

    if (!email || !firstName || !lastName || !zipCode) {
      return { success: false, error: 'Veuillez remplir tous les champs obligatoires.' }
    }

    await prisma.lead.create({
      data: {
        firstName,
        lastName,
        email,
        phone: phone || '',
        zipCode,
        department: department || zipCode.substring(0, 2),
        projectType: projectType || 'Non spécifié',
        description: description || '',
        budget: budget || '',
        status: 'NEW',
      },
    })

    return { success: true }
  } catch (err: any) {
    console.error('submitLead error:', err)
    return { success: false, error: err.message || 'Erreur serveur' }
  }
}

export async function getAllLeads() {
  return prisma.lead.findMany({
    orderBy: { createdAt: 'desc' },
    include: { specialty: true, artisan: true },
  })
}

export async function updateLeadStatus(leadId: string, status: string) {
  return prisma.lead.update({
    where: { id: leadId },
    data: { status: status as any },
  })
}

// ==================== ARTISANS ====================

export async function getArtisans(): Promise<Artisan[]> {
  const artisans = await prisma.artisanCompany.findMany({
    include: {
      specialties: true,
      certifications: true,
      reviews: true,
      subscription: true,
      user: { include: { profile: true } },
    },
  })

  return artisans.map((a) => {
    const avgRating = a.reviews.length > 0
      ? a.reviews.reduce((sum, r) => sum + r.rating, 0) / a.reviews.length
      : 0

    const slug = a.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    const avatar = a.logoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(a.name)}&background=1e40af&color=fff&size=200`

    return {
      id: a.id,
      slug: slug || a.id,
      name: a.user?.profile?.firstName + ' ' + a.user?.profile?.lastName || 'Artisan',
      company: a.name,
      avatar,
      city: a.city,
      department: a.department,
      region: a.department ? `Région ${a.department}` : 'France',
      address: a.address,
      phone: a.phone || 'Non renseigné',
      email: a.user?.email || 'Non renseigné',
      website: a.website || undefined,
      description: a.description || `Artisan RGE spécialisé en ${a.specialties.map(s => s.name).join(', ')}.`,
      specialties: a.specialties.map((s) => s.name),
      certifications: a.certifications.map((c) => c.name as any),
      rating: Math.round(avgRating * 10) / 10 || 4.5,
      reviewCount: a.reviews.length,
      projectCount: Math.floor(Math.random() * 500) + 50, // Placeholder until real data
      yearsExperience: new Date().getFullYear() - (a.createdAt ? new Date(a.createdAt).getFullYear() : 2010),
      responseTime: '< 4h',
      verified: true,
      premium: a.isFeatured,
      available: true,
      siret: a.siret,
      since: a.createdAt ? new Date(a.createdAt).getFullYear() : 2010,
      gallery: a.logoUrl ? [a.logoUrl] : [],
      reviews: a.reviews.map((r) => ({
        id: r.id,
        author: 'Client',
        avatar: 'https://ui-avatars.com/api/?name=Client&background=f59e0b&color=fff',
        rating: r.rating,
        date: r.createdAt.toISOString().split('T')[0],
        comment: r.comment || '',
        project: 'Projet rénovation',
      })),
    }
  })
}

export async function getArtisanBySlug(slug: string): Promise<Artisan | null> {
  const artisans = await getArtisans()
  return artisans.find((a) => a.slug === slug) || null
}

// ==================== ARTICLES ====================

export async function getArticles(): Promise<Article[]> {
  const articles = await prisma.article.findMany({
    where: { published: true },
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  })

  return articles.map((a) => ({
    id: a.id,
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt || a.content.substring(0, 150) + '...',
    content: a.content,
    category: a.category?.name || 'Non classé',
    author: 'Équipe RENOMAG',
    authorRole: 'Experts rénovation',
    publishedAt: a.createdAt.toISOString().split('T')[0],
    readTime: Math.max(3, Math.ceil(a.content.length / 1500)),
    image: a.image || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800',
    tags: [a.category?.name || 'Général'],
    featured: false,
  }))
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const article = await prisma.article.findUnique({
    where: { slug },
    include: { category: true },
  })

  if (!article) return null

  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt || article.content.substring(0, 150) + '...',
    content: article.content,
    category: article.category?.name || 'Non classé',
    author: 'Équipe RENOMAG',
    authorRole: 'Experts rénovation',
    publishedAt: article.createdAt.toISOString().split('T')[0],
    readTime: Math.max(3, Math.ceil(article.content.length / 1500)),
    image: article.image || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800',
    tags: [article.category?.name || 'Général'],
    featured: false,
  }
}

// ==================== USERS / ADMIN ====================

export async function getAllUsers() {
  return prisma.user.findMany({
    include: { profile: true, artisan: true },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getAllArtisanCompanies() {
  return prisma.artisanCompany.findMany({
    include: { specialties: true, certifications: true, reviews: true, user: true },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getKPIs() {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [users, artisanCount, leads, articles, usersThisMonth, leadsThisMonth, convertedLeads] = await Promise.all([
    prisma.user.count(),
    prisma.artisanCompany.count(),
    prisma.lead.count(),
    prisma.article.count(),
    prisma.user.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.lead.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.lead.count({ where: { status: 'CONVERTED' } }),
  ])

  const conversionRate = leads > 0 ? Math.round((convertedLeads / leads) * 100) : 0

  return {
    users,
    artisanCount,
    leadCount: leads,
    leads,
    articles,
    usersThisMonth,
    leadsThisMonth,
    conversionRate,
  }
}

export async function getAllArtisans() {
  return prisma.artisanCompany.findMany({
    include: { specialties: true, certifications: true, reviews: true, subscription: true, user: { include: { profile: true } } },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getAllArticles() {
  return prisma.article.findMany({
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getDepartments() {
  return prisma.department.findMany({ orderBy: { code: 'asc' } })
}

export async function getArtisanLeads(artisanId: string) {
  return prisma.lead.findMany({
    where: { artisanId },
    orderBy: { createdAt: 'desc' },
    include: { specialty: true },
  })
}

export async function deleteUser(userId: string) {
  'use server'
  await prisma.user.delete({ where: { id: userId } })
}

// ==================== MESSAGES / NOTIFICATIONS ====================

export async function getMessages(userId: string) {
  return prisma.message.findMany({
    where: { OR: [{ senderId: userId }, { receiverId: userId }] },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getNotifications(userId: string) {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getUnreadNotificationsCount(userId: string) {
  return prisma.notification.count({
    where: { userId, read: false },
  })
}

// ==================== PROFILE UPDATES ====================

export async function updateProfileForm(formData: FormData) {
  const userId = formData.get('userId') as string
  if (!userId) return

  const data: any = {}
  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string
  const phone = formData.get('phone') as string
  const address = formData.get('address') as string
  const city = formData.get('city') as string
  const zipCode = formData.get('zipCode') as string

  if (firstName) data.firstName = firstName
  if (lastName) data.lastName = lastName
  if (phone) data.phone = phone
  if (address) data.address = address
  if (city) data.city = city
  if (zipCode) data.zipCode = zipCode

  await prisma.profile.upsert({
    where: { userId },
    create: { userId, ...data },
    update: data,
  })
}

export async function updateArtisanProfileForm(formData: FormData) {
  const userId = formData.get('userId') as string
  if (!userId) return

  const artisanData: any = {}
  const name = formData.get('companyName') as string
  const description = formData.get('description') as string
  const address = formData.get('address') as string
  const city = formData.get('city') as string
  const zipCode = formData.get('zipCode') as string
  const phone = formData.get('phone') as string
  const website = formData.get('website') as string

  if (name) artisanData.name = name
  if (description) artisanData.description = description
  if (address) artisanData.address = address
  if (city) artisanData.city = city
  if (zipCode) artisanData.zipCode = zipCode
  if (phone) artisanData.phone = phone
  if (website) artisanData.website = website

  await prisma.artisanCompany.update({
    where: { userId },
    data: artisanData,
  })

  // Also update profile fields if present
  const profileData: any = {}
  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string
  if (firstName) profileData.firstName = firstName
  if (lastName) profileData.lastName = lastName
  if (phone) profileData.phone = phone

  if (Object.keys(profileData).length > 0) {
    await prisma.profile.upsert({
      where: { userId },
      create: { userId, ...profileData },
      update: profileData,
    })
  }
}
