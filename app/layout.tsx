import type { Metadata, Viewport } from 'next'
import { Inter, Lexend } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
})

const lexend = Lexend({
  subsets: ['latin'],
  variable: '--font-lexend',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
})

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
  icons: {
    icon: '/favicon.ico',
  },
}

export const viewport: Viewport = {
  themeColor: '#0f2744',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${inter.variable} ${lexend.variable} font-sans antialiased`}>
        {children}
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  )
}
