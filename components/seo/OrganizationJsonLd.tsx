import JsonLd from './JsonLd'

export default function OrganizationJsonLd() {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'RENOMAG',
        url: 'https://renomag.fr',
        logo: 'https://renomag.fr/logo.png',
        description:
          'La plateforme de référence pour connecter les particuliers aux meilleurs artisans RGE et maximiser leurs aides à la rénovation énergétique.',
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+33-1-23-45-67-89',
          contactType: 'customer service',
          areaServed: 'FR',
          availableLanguage: ['French'],
        },
        sameAs: [
          'https://twitter.com/renomag',
          'https://linkedin.com/company/renomag',
          'https://facebook.com/renomag',
        ],
      }}
    />
  )
}
