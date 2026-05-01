import JsonLd from './JsonLd'
import type { Article } from '@/lib/data/blog'

export default function ArticleJsonLd({ article }: { article: Article }) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: article.title,
        description: article.excerpt,
        image: article.image,
        datePublished: article.publishedAt,
        dateModified: article.publishedAt,
        author: {
          '@type': 'Person',
          name: article.author,
        },
        publisher: {
          '@type': 'Organization',
          name: 'RENOMAG',
          logo: {
            '@type': 'ImageObject',
            url: 'https://renomag.fr/logo.png',
          },
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `https://renomag.fr/blog/${article.slug}`,
        },
      }}
    />
  )
}
