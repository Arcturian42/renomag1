import type { Metadata } from 'next'
import { CheckCircle } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import DevisForm from './components/DevisForm'

export const metadata: Metadata = {
  title: 'Obtenez vos devis gratuits — Devis en 2 minutes',
  description:
    'Remplissez notre formulaire en 2 minutes et recevez jusqu\'à 3 devis d\'artisans RGE certifiés dans votre région.',
}

interface DevisPageProps {
  searchParams: {
    artisan?: string
  }
}

export default async function DevisPage({ searchParams }: DevisPageProps) {
  // Fetch artisan data if artisan ID is provided
  let artisan = null
  if (searchParams.artisan) {
    try {
      artisan = await prisma.artisanCompany.findUnique({
        where: { id: searchParams.artisan },
        select: {
          id: true,
          name: true,
          avatar: true,
          city: true,
          specialties: {
            select: {
              name: true,
              slug: true,
            },
          },
        },
      })
    } catch (error) {
      console.error('Error fetching artisan:', error)
    }
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold text-slate-900">
            Obtenez vos devis gratuits
          </h1>
          <p className="text-slate-500 mt-1">
            En quelques minutes, recevez jusqu&apos;à 3 devis d&apos;artisans RGE certifiés
          </p>

          {/* Progress — rendered client-side inside DevisForm */}
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
        <DevisForm artisan={artisan} />
      </div>
    </div>
  )
}
