import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'RENOMAG — La référence de la rénovation énergétique en France',
    template: '%s | RENOMAG',
  },
  description:
    'Trouvez les meilleurs artisans RGE près de chez vous. Profitez des aides MaPrimeRénov\' et CEE pour financer votre rénovation énergétique. Devis gratuit en 24h.',
  keywords: [
    'rénovation énergétique',
    'artisan RGE',
    'MaPrimeRénov',
    'CEE',
    'isolation',
    'pompe à chaleur',
    'photovoltaïque',
    'renovation maison',
  ],
  authors: [{ name: 'RENOMAG' }],
  creator: 'RENOMAG',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://renomag.fr',
    siteName: 'RENOMAG',
    title: 'RENOMAG — La référence de la rénovation énergétique en France',
    description:
      'Trouvez les meilleurs artisans RGE et profitez des aides MaPrimeRénov\' et CEE.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RENOMAG — Rénovation énergétique',
    description: 'La plateforme de référence pour la rénovation énergétique en France.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Lexend:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
