import 'server-only'
import { createClient } from '@supabase/supabase-js'
import type { Article } from '@/lib/data/blog'

type SupabaseBlogClient = ReturnType<typeof createBlogClient>

export interface SupabaseArticleRow {
  id: string
  title: string
  slug: string
  content: string | null
  excerpt: string | null
  status: string | null
  category: string | null
  tags: string[] | null
  seo_score: number | null
  published_at: string | null
  created_at: string | null
}

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800'

function createBlogClient(url: string, key: string) {
  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    db: { schema: 'content' },
  })
}

let cachedClient: SupabaseBlogClient | null = null

function getClient(): SupabaseBlogClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) return null

  if (cachedClient) return cachedClient

  cachedClient = createBlogClient(url, key)
  return cachedClient
}

function estimateReadTime(content: string | null): number {
  if (!content) return 1
  const words = content.trim().split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
}

export function mapSupabaseArticle(row: SupabaseArticleRow): Article & { isAI: true } {
  const publishedAt =
    row.published_at ?? row.created_at ?? new Date().toISOString()
  return {
    id: `sb-${row.id}`,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt ?? '',
    content: row.content ?? '',
    category: row.category ?? 'Non classé',
    author: 'Agent IA RENOMAG',
    authorRole: 'Rédacteur IA',
    publishedAt,
    readTime: estimateReadTime(row.content),
    image: DEFAULT_IMAGE,
    tags: row.tags ?? [],
    featured: false,
    isAI: true,
  }
}

export async function getSupabaseArticles(): Promise<(Article & { isAI: true })[]> {
  const client = getClient()
  if (!client) return []

  try {
    const { data, error } = await client
      .from('articles')
      .select(
        'id, title, slug, content, excerpt, status, category, tags, seo_score, published_at, created_at'
      )
      .eq('status', 'published')
      .order('published_at', { ascending: false, nullsFirst: false })

    if (error) {
      console.error('[supabase-blog] getSupabaseArticles error:', error.message)
      return []
    }

    return (data as SupabaseArticleRow[]).map(mapSupabaseArticle)
  } catch (err) {
    console.error('[supabase-blog] getSupabaseArticles exception:', err)
    return []
  }
}

export async function getSupabaseArticleBySlug(
  slug: string
): Promise<(Article & { isAI: true }) | null> {
  const client = getClient()
  if (!client) return null

  try {
    const { data, error } = await client
      .from('articles')
      .select(
        'id, title, slug, content, excerpt, status, category, tags, seo_score, published_at, created_at'
      )
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle()

    if (error) {
      console.error('[supabase-blog] getSupabaseArticleBySlug error:', error.message)
      return null
    }
    if (!data) return null

    return mapSupabaseArticle(data as SupabaseArticleRow)
  } catch (err) {
    console.error('[supabase-blog] getSupabaseArticleBySlug exception:', err)
    return null
  }
}
