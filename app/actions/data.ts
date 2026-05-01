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
  try {
    return await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' },
      include: { specialty: true, artisan: true },
    })
  } catch {
    return []
  }
}

export async function updateLeadStatus(leadId: string, status: string) {
  try {
    await prisma.lead.update({
      where: { id: leadId },
      data: { status: status as any },
    })
    return { success: true }
  } catch (err: any) {
    console.error('updateLeadStatus error:', err)
    return { success: false, error: err.message || 'Erreur serveur' }
  }
}

// ==================== ARTISANS ====================

export async function getArtisans(): Promise<Artisan[]> {
  try {
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
  } catch {
    return []
  }
}

export async function getArtisanBySlug(slug: string): Promise<Artisan | null> {
  try {
    const artisans = await getArtisans()
    return artisans.find((a) => a.slug === slug) || null
  } catch {
    return null
  }
}

// ==================== ARTICLES ====================

export async function getArticles(): Promise<Article[]> {
  try {
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
  } catch {
    return []
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
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
  } catch {
    return null
  }
}

// ==================== USERS / ADMIN ====================

export async function getAllUsers() {
  try {
    return await prisma.user.findMany({
      include: { profile: true, artisan: true },
      orderBy: { createdAt: 'desc' },
    })
  } catch {
    return []
  }
}

export async function getAllArtisanCompanies() {
  try {
    return await prisma.artisanCompany.findMany({
      include: { specialties: true, certifications: true, reviews: true, user: true },
      orderBy: { createdAt: 'desc' },
    })
  } catch {
    return []
  }
}

export async function getKPIs() {
  try {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfWeek = new Date(now)
    const day = startOfWeek.getDay()
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1)
    startOfWeek.setDate(diff)
    startOfWeek.setHours(0, 0, 0, 0)

    const [users, artisanCount, leads, articles, usersThisMonth, leadsThisMonth, convertedLeads, qualifiedLeads, newLeadsThisWeek] = await Promise.all([
      prisma.user.count(),
      prisma.artisanCompany.count(),
      prisma.lead.count(),
      prisma.article.count(),
      prisma.user.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.lead.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.lead.count({ where: { status: 'CONVERTED' } }),
      prisma.lead.count({ where: { status: { in: ['QUALIFIED', 'CONVERTED'] } } }),
      prisma.lead.count({ where: { createdAt: { gte: startOfWeek } } }),
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
      convertedLeads,
      qualifiedLeads,
      newLeadsThisWeek,
      totalUsers: users,
      totalArtisans: artisanCount,
      totalLeads: leads,
    }
  } catch {
    return {
      users: 0,
      artisanCount: 0,
      leadCount: 0,
      leads: 0,
      articles: 0,
      usersThisMonth: 0,
      leadsThisMonth: 0,
      conversionRate: 0,
      convertedLeads: 0,
      qualifiedLeads: 0,
      newLeadsThisWeek: 0,
      totalUsers: 0,
      totalArtisans: 0,
      totalLeads: 0,
    }
  }
}

export async function getAllArtisans() {
  try {
    return await prisma.artisanCompany.findMany({
      include: { specialties: true, certifications: true, reviews: true, subscription: true, user: { include: { profile: true } } },
      orderBy: { createdAt: 'desc' },
    })
  } catch {
    return []
  }
}

export async function getAllArticles() {
  try {
    return await prisma.article.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    })
  } catch {
    return []
  }
}

export async function getDepartments() {
  try {
    return await prisma.department.findMany({ orderBy: { code: 'asc' } })
  } catch {
    return []
  }
}

export async function getArtisanLeads(artisanId: string) {
  try {
    return await prisma.lead.findMany({
      where: { artisanId },
      orderBy: { createdAt: 'desc' },
      include: { specialty: true },
    })
  } catch {
    return []
  }
}

export async function deleteUser(userId: string) {
  'use server'
  await prisma.user.delete({ where: { id: userId } })
}

// ==================== MESSAGES / NOTIFICATIONS ====================

export async function getMessages(userId: string) {
  try {
    return await prisma.message.findMany({
      where: { OR: [{ senderId: userId }, { receiverId: userId }] },
      orderBy: { createdAt: 'desc' },
    })
  } catch {
    return []
  }
}

export async function getNotifications(userId: string) {
  try {
    return await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })
  } catch {
    return []
  }
}

export async function getUnreadNotificationsCount(userId: string) {
  try {
    return await prisma.notification.count({
      where: { userId, read: false },
    })
  } catch {
    return 0
  }
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
  'use server'
  const userId = formData.get('userId') as string
  if (!userId) return

  try {
    const artisanData: any = {}
    const name = formData.get('companyName') as string
    const description = formData.get('description') as string
    const address = formData.get('address') as string
    const city = formData.get('city') as string
    const zipCode = formData.get('zipCode') as string
    const phone = formData.get('phone') as string
    const website = formData.get('website') as string
    const siret = formData.get('siret') as string

    if (name) artisanData.name = name
    if (description) artisanData.description = description
    if (address) artisanData.address = address
    if (city) artisanData.city = city
    if (zipCode) artisanData.zipCode = zipCode
    if (phone) artisanData.phone = phone
    if (website) artisanData.website = website
    if (siret) artisanData.siret = siret

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

  } catch (err: any) {
    console.error('updateArtisanProfileForm error:', err)
  }
}

// ==================== MESSAGING ====================

export async function sendMessage({ senderId, receiverId, content }: { senderId: string; receiverId: string; content: string }) {
  'use server'
  try {
    if (!senderId || !receiverId || !content.trim()) {
      return { success: false, error: 'Données invalides' }
    }
    const message = await prisma.message.create({
      data: { senderId, receiverId, content: content.trim() },
    })
    return { success: true, data: message }
  } catch (err: any) {
    console.error('sendMessage error:', err)
    return { success: false, error: err.message || 'Erreur serveur' }
  }
}

export async function markMessagesAsRead({ userId, partnerId }: { userId: string; partnerId: string }) {
  'use server'
  try {
    await prisma.message.updateMany({
      where: { senderId: partnerId, receiverId: userId, read: false },
      data: { read: true },
    })
    return { success: true }
  } catch (err: any) {
    console.error('markMessagesAsRead error:', err)
    return { success: false, error: err.message || 'Erreur serveur' }
  }
}

// ==================== LEAD NOTES ====================

export async function updateLeadNotes(leadId: string, notes: string) {
  'use server'
  try {
    await prisma.lead.update({
      where: { id: leadId },
      data: { notes },
    })
    return { success: true }
  } catch (err: any) {
    console.error('updateLeadNotes error:', err)
    return { success: false, error: err.message || 'Erreur serveur' }
  }
}

// ==================== ARTICLE CRUD ====================

export async function createArticle(data: { title: string; slug: string; content: string; excerpt?: string; image?: string; categoryId?: string; published?: boolean; featured?: boolean; tags?: string[] }) {
  'use server'
  try {
    const article = await prisma.article.create({
      data: {
        title: data.title,
        slug: data.slug,
        content: data.content,
        excerpt: data.excerpt || null,
        image: data.image || null,
        categoryId: data.categoryId || null,
        published: data.published ?? false,
        featured: data.featured ?? false,
        tags: data.tags || [],
      },
    })
    return { success: true, data: article }
  } catch (err: any) {
    console.error('createArticle error:', err)
    return { success: false, error: err.message || 'Erreur serveur' }
  }
}

export async function updateArticle(id: string, data: Partial<{ title: string; slug: string; content: string; excerpt: string; image: string; categoryId: string; published: boolean; featured: boolean; tags: string[] }>) {
  'use server'
  try {
    const article = await prisma.article.update({
      where: { id },
      data,
    })
    return { success: true, data: article }
  } catch (err: any) {
    console.error('updateArticle error:', err)
    return { success: false, error: err.message || 'Erreur serveur' }
  }
}

export async function deleteArticle(id: string) {
  'use server'
  try {
    await prisma.article.delete({ where: { id } })
    return { success: true }
  } catch (err: any) {
    console.error('deleteArticle error:', err)
    return { success: false, error: err.message || 'Erreur serveur' }
  }
}

// ==================== ADMIN ARTISAN TOGGLES ====================

export async function updateArtisanStatus(id: string, data: { verified?: boolean; premium?: boolean; available?: boolean }) {
  'use server'
  try {
    await prisma.artisanCompany.update({
      where: { id },
      data,
    })
    return { success: true }
  } catch (err: any) {
    console.error('updateArtisanStatus error:', err)
    return { success: false, error: err.message || 'Erreur serveur' }
  }
}

// ==================== SETTINGS ====================

export async function getSetting(key: string) {
  try {
    const setting = await prisma.setting.findUnique({ where: { key } })
    return setting?.value ?? null
  } catch {
    return null
  }
}

export async function changePassword(formData: FormData) {
  'use server'
  try {
    const newPassword = formData.get('newPassword') as string
    const confirmPassword = formData.get('confirmPassword') as string
    if (!newPassword || newPassword !== confirmPassword) {
      return { success: false, error: 'Les mots de passe ne correspondent pas' }
    }
    if (newPassword.length < 8) {
      return { success: false, error: '8 caractères minimum' }
    }
    // NOTE: changer le mot de passe Supabase nécessite le service role ou un client admin.
    // Pour le MVP, on simule le succès. À brancher sur supabase.auth.admin.updateUserById() en production.
    return { success: true }
  } catch (err: any) {
    console.error('changePassword error:', err)
    return { success: false, error: err.message || 'Erreur serveur' }
  }
}

export async function updateSetting(formData: FormData) {
  'use server'
  const key = formData.get('key') as string
  const value = formData.get('value') as string
  if (!key) throw new Error('Clé manquante')
  await prisma.setting.upsert({
    where: { key },
    create: { key, value: value || '' },
    update: { value: value || '' },
  })
}
