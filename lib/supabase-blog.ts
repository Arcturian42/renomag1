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

function stripMarkdown(text: string | null | undefined): string {
  if (!text) return ''
  return text
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/^\s{0,3}#{1,6}\s+/gm, '')
    .replace(/^\s*>\s?/gm, '')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/(^|[^*])\*([^*\n]+)\*/g, '$1$2')
    .replace(/(^|[^_])_([^_\n]+)_/g, '$1$2')
    .replace(/~~([^~]+)~~/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()
}

export function mapSupabaseArticle(row: SupabaseArticleRow): Article & { isAI: true } {
  const publishedAt =
    row.published_at ?? row.created_at ?? new Date().toISOString()
  return {
    id: `sb-${row.id}`,
    slug: row.slug,
    title: row.title,
    excerpt: stripMarkdown(row.excerpt),
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

const ARTICLE_COLUMNS =
  'id, title, slug, content, excerpt, status, category, tags, seo_score, published_at, created_at'

function buildSlugCandidates(slug: string): string[] {
  const variants = new Set<string>()
  const push = (s: string | undefined | null) => {
    if (s && s.trim().length > 0) variants.add(s)
  }
  push(slug)
  try { push(decodeURIComponent(slug)) } catch {}
  try { push(slug.normalize('NFC')) } catch {}
  try { push(slug.normalize('NFD')) } catch {}
  try { push(decodeURIComponent(slug).normalize('NFC')) } catch {}
  try { push(decodeURIComponent(slug).normalize('NFD')) } catch {}
  return Array.from(variants)
}

function escapeIlikePattern(s: string): string {
  return s.replace(/[\\%_]/g, '\\$&')
}

export async function getSupabaseArticleBySlug(
  slug: string
): Promise<(Article & { isAI: true }) | null> {
  const client = getClient()
  if (!client) return null

  const candidates = buildSlugCandidates(slug)

  try {
    for (const candidate of candidates) {
      const { data, error } = await client
        .from('articles')
        .select(ARTICLE_COLUMNS)
        .eq('slug', candidate)
        .eq('status', 'published')
        .maybeSingle()

      if (error) {
        console.error(
          `[supabase-blog] getSupabaseArticleBySlug eq error for "${candidate}":`,
          error.message
        )
        continue
      }
      if (data) {
        return mapSupabaseArticle(data as SupabaseArticleRow)
      }
    }

    for (const candidate of candidates) {
      const { data, error } = await client
        .from('articles')
        .select(ARTICLE_COLUMNS)
        .ilike('slug', escapeIlikePattern(candidate))
        .eq('status', 'published')
        .limit(1)

      if (error) {
        console.error(
          `[supabase-blog] getSupabaseArticleBySlug ilike error for "${candidate}":`,
          error.message
        )
        continue
      }
      if (data && data.length > 0) {
        return mapSupabaseArticle(data[0] as SupabaseArticleRow)
      }
    }

    console.warn(
      `[supabase-blog] getSupabaseArticleBySlug: no match for "${slug}" (tried ${candidates.length} variants)`
    )
    return null
  } catch (err) {
    console.error('[supabase-blog] getSupabaseArticleBySlug exception:', err)
    return null
  }
}
