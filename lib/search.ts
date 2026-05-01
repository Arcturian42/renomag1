import { Meilisearch } from 'meilisearch'
import { logger } from './logger'

const host = process.env.MEILISEARCH_HOST
const apiKey = process.env.MEILISEARCH_API_KEY

let client: Meilisearch | null = null
if (host) {
  client = new Meilisearch({ host, apiKey })
}

export function getSearchClient(): Meilisearch | null {
  return client
}

export async function indexArtisans(artisans: Array<{
  id: string
  name: string
  city: string
  department: string
  region?: string | null
  specialties: string[]
  certifications: string[]
  description?: string
}>) {
  if (!client) return
  try {
    const index = client.index('artisans')
    await index.addDocuments(artisans, { primaryKey: 'id' })
    await index.updateSettings({
      searchableAttributes: ['name', 'city', 'department', 'region', 'specialties', 'certifications', 'description'],
      filterableAttributes: ['city', 'department', 'region', 'specialties', 'certifications'],
      sortableAttributes: ['name', 'city'],
    })
  } catch (err) {
    logger.error({ err }, 'Meilisearch index artisans failed')
  }
}

export async function indexArticles(articles: Array<{
  id: string
  title: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  slug: string
}>) {
  if (!client) return
  try {
    const index = client.index('articles')
    await index.addDocuments(articles, { primaryKey: 'id' })
    await index.updateSettings({
      searchableAttributes: ['title', 'excerpt', 'content', 'category', 'tags'],
      filterableAttributes: ['category', 'tags'],
      sortableAttributes: ['title'],
    })
  } catch (err) {
    logger.error({ err }, 'Meilisearch index articles failed')
  }
}

export async function searchArtisans(query: string, options?: { limit?: number; offset?: number }) {
  if (!client) return { hits: [], total: 0 }
  try {
    const result = await client.index('artisans').search(query, {
      limit: options?.limit ?? 12,
      offset: options?.offset ?? 0,
    })
    return { hits: result.hits, total: result.estimatedTotalHits ?? 0 }
  } catch {
    return { hits: [], total: 0 }
  }
}

export async function searchArticles(query: string, options?: { limit?: number; offset?: number }) {
  if (!client) return { hits: [], total: 0 }
  try {
    const result = await client.index('articles').search(query, {
      limit: options?.limit ?? 12,
      offset: options?.offset ?? 0,
    })
    return { hits: result.hits, total: result.estimatedTotalHits ?? 0 }
  } catch {
    return { hits: [], total: 0 }
  }
}
