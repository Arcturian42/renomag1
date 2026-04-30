import { MetadataRoute } from 'next'
import { getArtisans } from '@/lib/data/db'
import { getArticles } from '@/lib/data/db'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://renomag.fr'

  const staticRoutes = [
    '',
    '/annuaire',
    '/blog',
    '/aides',
    '/devis',
    '/comment-ca-marche',
    '/tarifs',
    '/partenaires',
    '/faq',
    '/glossaire',
    '/mentions-legales',
    '/confidentialite',
    '/cgv',
    '/cookies',
    '/connexion',
    '/inscription',
  ]

  const [artisans, articles] = await Promise.all([getArtisans(), getArticles()])

  return [
    ...staticRoutes.map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: route === '' ? 1 : 0.8,
    })),
    ...artisans.map((artisan) => ({
      url: `${baseUrl}/annuaire/${artisan.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    ...articles.map((article) => ({
      url: `${baseUrl}/blog/${article.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
}
