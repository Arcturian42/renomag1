'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { sanitizeAndValidate } from '@/lib/sanitize'

async function requireAuth() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  return user
}

export async function createArticle(formData: FormData) {
  try {
    const authUser = await requireAuth()
    const dbUser = await prisma.user.findUnique({
      where: { id: authUser.id },
      include: { artisan: { include: { subscription: true } } },
    })

    if (!dbUser || dbUser.role !== 'ARTISAN' || !dbUser.artisan) {
      return { success: false, error: 'Accès réservé aux artisans' }
    }

    const artisan = dbUser.artisan
    const subscription = artisan.subscription

    // Vérifier le quota d'articles
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const articlesThisMonth = await prisma.article.count({
      where: {
        authorId: artisan.id,
        createdAt: { gte: startOfMonth },
      },
    })

    const quota = subscription?.articlesQuota ?? 1
    if (articlesThisMonth >= quota) {
      return { success: false, error: `Quota d'articles atteint (${quota}/mois)` }
    }

    let title = formData.get('title') as string
    let content = formData.get('content') as string
    let excerpt = formData.get('excerpt') as string
    const categoryId = formData.get('categoryId') as string

    if (!title || !content) {
      return { success: false, error: 'Titre et contenu requis' }
    }

    // XSS Protection: Sanitize all text inputs
    try {
      title = sanitizeAndValidate(title, 'title')
      content = sanitizeAndValidate(content, 'content')
      if (excerpt) excerpt = sanitizeAndValidate(excerpt, 'excerpt')
    } catch (error) {
      console.error('[createArticle] XSS protection triggered:', error)
      return { success: false, error: 'Contenu invalide — les balises HTML ne sont pas autorisées' }
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 100)

    // Unicité du slug
    let uniqueSlug = slug
    let count = 1
    while (await prisma.article.findUnique({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${slug}-${count++}`
    }

    await prisma.article.create({
      data: {
        title,
        slug: uniqueSlug,
        content,
        excerpt: excerpt || content.substring(0, 150) + '...',
        authorId: artisan.id,
        categoryId: categoryId || null,
        published: true,
      },
    })

    revalidatePath('/blog')
    revalidatePath('/espace-pro/articles')

    return { success: true }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue'
    return { success: false, error: message }
  }
}

export async function getArtisanArticles(artisanId: string) {
  const authUser = await requireAuth()
  const artisan = await prisma.artisanCompany.findFirst({
    where: { id: artisanId, userId: authUser.id },
  })
  if (!artisan) throw new Error('Forbidden')

  return prisma.article.findMany({
    where: { authorId: artisanId },
    orderBy: { createdAt: 'desc' },
    include: { category: true },
  })
}
