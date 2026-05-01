import JsonLd from './JsonLd'
import type { Artisan } from '@/lib/data/artisans'

export default function LocalBusinessJsonLd({ artisan }: { artisan: Artisan }) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: artisan.company,
        image: artisan.avatar,
        telephone: artisan.phone,
        email: artisan.email,
        url: artisan.website || `https://renomag.fr/annuaire/${artisan.slug}`,
        address: {
          '@type': 'PostalAddress',
          streetAddress: artisan.address,
          addressLocality: artisan.city,
          addressRegion: artisan.region,
          addressCountry: 'FR',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: artisan.latitude || 0,
          longitude: artisan.longitude || 0,
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: artisan.rating,
          reviewCount: artisan.reviewCount,
        },
        priceRange: '€€',
      }}
    />
  )
}
