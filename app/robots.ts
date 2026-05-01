import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/espace-pro', '/espace-proprietaire', '/admin', '/dashboard-prive'],
    },
    sitemap: 'https://renomag.fr/sitemap.xml',
  }
}
