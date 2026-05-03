import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { ARTISANS, type Artisan, type Review } from './artisans'
import { ARTICLES, type Article } from './blog'

function mapPrismaArtisan(a: any): Artisan {
  return {
    id: a.id,
    slug: a.slug,
    name: a.name,
    company: a.name,
    avatar: a.avatar ?? '',
    city: a.city,
    department: `${a.department} (${a.zipCode?.slice(0, 2) ?? a.department})`,
    region: a.region ?? '',
    address: a.address,
    phone: a.phone ?? '',
    email: a.email ?? '',
    website: a.website ?? undefined,
    description: a.description ?? '',
    specialties: a.specialties?.map((s: any) => s.name) ?? [],
    certifications: a.certifications?.map((c: any) => c.code) ?? [],
    rating: a.rating,
    reviewCount: a.reviewCount,
    projectCount: a.projectCount,
    yearsExperience: a.yearsExperience,
    responseTime: a.responseTime ?? '',
    verified: a.verified,
    premium: a.premium,
    available: a.available,
    siret: a.siret,
    since: a.since ?? 0,
    gallery: (a.gallery as string[]) ?? [],
    reviews:
      a.reviews?.map(
        (r: any): Review => ({
          id: r.id,
          author: r.author ?? '',
          avatar: r.avatar ?? '',
          rating: r.rating,
          date: r.date ?? r.createdAt?.toISOString() ?? '',
          comment: r.comment ?? '',
          project: r.project ?? '',
        })
      ) ?? [],
  }
}

function mapPrismaArticle(a: any): Article {
  return {
    id: a.id,
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt ?? '',
    content: a.content ?? '',
    category: a.category?.name ?? 'Non classé',
    author: a.author ?? 'RENOMAG',
    authorRole: a.authorRole ?? '',
    publishedAt: a.createdAt?.toISOString() ?? '',
    readTime: a.readTime,
    image: a.image ?? '',
    tags: (a.tags as string[]) ?? [],
    featured: a.featured,
  }
}

export async function getArtisans(): Promise<Artisan[]> {
  try {
    const db = await prisma.artisanCompany.findMany({
      include: { specialties: true, certifications: true, reviews: true },
    })
    if (db.length === 0) return ARTISANS
    return db.map(mapPrismaArtisan)
  } catch {
    return ARTISANS
  }
}

export async function getArtisanBySlug(slug: string): Promise<Artisan | undefined> {
  try {
    const db = await prisma.artisanCompany.findUnique({
      where: { slug },
      include: { specialties: true, certifications: true, reviews: true },
    })
    if (!db) return ARTISANS.find((a) => a.slug === slug)
    return mapPrismaArtisan(db)
  } catch {
    return ARTISANS.find((a) => a.slug === slug)
  }
}

export async function getArticles(): Promise<Article[]> {
  try {
    const db = await prisma.article.findMany({
      where: { published: true },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    })
    if (db.length === 0) return ARTICLES
    return db.map(mapPrismaArticle)
  } catch {
    return ARTICLES
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  try {
    const db = await prisma.article.findUnique({
      where: { slug },
      include: { category: true },
    })
    if (!db) return ARTICLES.find((a) => a.slug === slug)
    return mapPrismaArticle(db)
  } catch {
    return ARTICLES.find((a) => a.slug === slug)
  }
}

export async function getFeaturedArtisans(): Promise<Artisan[]> {
  const artisans = await getArtisans()

  // First try to get premium artisans
  const premiumArtisans = artisans.filter((a) => a.premium)
  if (premiumArtisans.length >= 3) {
    return premiumArtisans.slice(0, 6)
  }

  // If not enough premium artisans, get verified ones
  const verifiedArtisans = artisans.filter((a) => a.verified)
  if (verifiedArtisans.length >= 3) {
    return verifiedArtisans
      .sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount)
      .slice(0, 6)
  }

  // Otherwise, return top-rated artisans with most reviews
  return artisans
    .sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount)
    .slice(0, 6)
}

export interface ArtisansFilters {
  q?: string
  specialite?: string
  region?: string
  certification?: string
  minRating?: string
  sort?: string
  page?: string
  limit?: string
}

export interface ArticlesFilters {
  q?: string
  category?: string
  page?: string
  limit?: string
}

export async function getArtisansWithFilters(
  filters: ArtisansFilters = {}
): Promise<{ artisans: Artisan[]; total: number }> {
  const page = Math.max(1, parseInt(filters.page ?? '1', 10))
  const limit = Math.min(50, Math.max(1, parseInt(filters.limit ?? '12', 10)))
  const skip = (page - 1) * limit

  try {
    const where: Prisma.ArtisanCompanyWhereInput = {}

    if (filters.q) {
      where.OR = [
        { name: { contains: filters.q, mode: 'insensitive' } },
        { city: { contains: filters.q, mode: 'insensitive' } },
        { department: { contains: filters.q, mode: 'insensitive' } },
      ]
    }

    if (filters.region) {
      where.region = { equals: filters.region, mode: 'insensitive' }
    }

    if (filters.specialite) {
      where.specialties = {
        some: { name: { equals: filters.specialite, mode: 'insensitive' } },
      }
    }

    if (filters.certification) {
      where.certifications = {
        some: { code: { equals: filters.certification, mode: 'insensitive' } },
      }
    }

    if (filters.minRating) {
      const min = parseFloat(filters.minRating)
      if (!isNaN(min)) {
        where.rating = { gte: min }
      }
    }

    const orderBy = (() => {
      switch (filters.sort) {
        case 'avis':
          return { reviewCount: 'desc' as const }
        case 'recent':
          return { createdAt: 'desc' as const }
        case 'experience':
          return { yearsExperience: 'desc' as const }
        default:
          return { rating: 'desc' as const }
      }
    })()

    const [db, totalCount] = await Promise.all([
      prisma.artisanCompany.findMany({
        where,
        include: { specialties: true, certifications: true, reviews: true },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.artisanCompany.count({ where }),
    ])

    // Fallback to mock data if DB is empty (development / seeding phase)
    if (db.length === 0 && totalCount === 0) {
      throw new Error('Empty DB — fallback to mock')
    }

    return { artisans: db.map(mapPrismaArtisan), total: totalCount }
  } catch {
    // Fallback: in-memory filtering on mock data
    let artisans = [...ARTISANS]

    if (filters.q) {
      const query = filters.q.toLowerCase()
      artisans = artisans.filter(
        (a) =>
          a.name.toLowerCase().includes(query) ||
          a.city.toLowerCase().includes(query) ||
          a.department.toLowerCase().includes(query) ||
          a.specialties.some((s) => s.toLowerCase().includes(query))
      )
    }

    if (filters.specialite) {
      artisans = artisans.filter((a) =>
        a.specialties.some((s) => s.toLowerCase() === filters.specialite!.toLowerCase())
      )
    }

    if (filters.region) {
      artisans = artisans.filter(
        (a) => a.region.toLowerCase() === filters.region!.toLowerCase()
      )
    }

    if (filters.certification) {
      artisans = artisans.filter((a) =>
        a.certifications.some((c) => c.toLowerCase() === filters.certification!.toLowerCase())
      )
    }

    if (filters.minRating) {
      const min = parseFloat(filters.minRating)
      if (!isNaN(min)) {
        artisans = artisans.filter((a) => a.rating >= min)
      }
    }

    switch (filters.sort) {
      case 'avis':
        artisans.sort((a, b) => b.reviewCount - a.reviewCount)
        break
      case 'recent':
        artisans.sort((a, b) => (b.since ?? 0) - (a.since ?? 0))
        break
      case 'experience':
        artisans.sort((a, b) => b.yearsExperience - a.yearsExperience)
        break
      default:
        artisans.sort((a, b) => b.rating - a.rating)
    }

    const total = artisans.length
    const start = skip
    return { artisans: artisans.slice(start, start + limit), total }
  }
}

export async function getArticlesWithFilters(filters: ArticlesFilters = {}): Promise<{ articles: Article[]; total: number }> {
  let articles = await getArticles()

  // Text search
  if (filters.q) {
    const query = filters.q.toLowerCase()
    articles = articles.filter(
      (a) =>
        a.title.toLowerCase().includes(query) ||
        a.excerpt.toLowerCase().includes(query) ||
        a.category.toLowerCase().includes(query)
    )
  }

  // Category filter
  if (filters.category) {
    articles = articles.filter(
      (a) => a.category.toLowerCase() === filters.category!.toLowerCase()
    )
  }

  const total = articles.length
  const page = Math.max(1, parseInt(filters.page ?? '1', 10))
  const limit = Math.min(50, Math.max(1, parseInt(filters.limit ?? '12', 10)))
  const start = (page - 1) * limit
  const paginated = articles.slice(start, start + limit)

  return { articles: paginated, total }
}

export async function getFeaturedArticles(): Promise<Article[]> {
  const articles = await getArticles()
  return articles.filter((a) => a.featured).slice(0, 3)
}
