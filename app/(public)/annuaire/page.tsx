import type { Metadata } from 'next'
import { Suspense } from 'react'
import { SPECIALTIES, REGIONS } from '@/lib/data/artisans'
import { getArtisansWithFilters } from '@/lib/data/db'
import ArtisanCard from '@/components/directory/ArtisanCard'
import AnnuaireSearchBar from '@/components/directory/AnnuaireSearchBar'
import AnnuaireSidebar from '@/components/directory/AnnuaireSidebar'
import { Search } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Annuaire des artisans RGE — Trouvez un professionnel certifié',
  description:
    'Consultez notre annuaire de 2 400+ artisans RGE certifiés en France. Filtrez par spécialité, région et certifications. Devis gratuit sous 24h.',
}

interface AnnuairePageProps {
  searchParams: {
    q?: string
    specialite?: string
    region?: string
    certification?: string
    minRating?: string
    sort?: string
    page?: string
  }
}

export default async function AnnuairePage({ searchParams }: AnnuairePageProps) {
  const params = searchParams
  const { artisans, total } = await getArtisansWithFilters(params)
  const currentPage = Math.max(1, parseInt(params.page ?? '1', 10))
  const limit = 12
  const totalPages = Math.ceil(total / limit)

  const searchBarDefaults = {
    q: params.q,
    specialite: params.specialite,
    sort: params.sort,
  }

  const sidebarDefaults = {
    region: params.region,
    certification: params.certification,
    minRating: params.minRating,
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="max-w-2xl">
            <div className="badge-primary mb-3">{total} artisans</div>
            <h1 className="text-3xl font-bold text-slate-900">
              Annuaire des artisans RGE
            </h1>
            <p className="mt-2 text-slate-500">
              Trouvez les meilleurs professionnels certifiés dans votre région
            </p>
          </div>

          <div className="mt-6">
            <Suspense fallback={<div className="h-12 bg-slate-100 animate-pulse rounded-lg" />}>
              <AnnuaireSearchBar specialties={SPECIALTIES} defaultValues={searchBarDefaults} />
            </Suspense>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <Suspense fallback={<div className="hidden lg:block w-64 h-96 bg-slate-100 animate-pulse rounded-xl" />}>
            <AnnuaireSidebar regions={REGIONS} defaultValues={sidebarDefaults} />
          </Suspense>

          {/* Results */}
          <div className="flex-1">
            <p className="text-sm text-slate-500 mb-5">
              <strong className="text-slate-900">{artisans.length} artisans</strong> affichés
              {total > artisans.length && (
                <span className="text-slate-400"> sur {total}</span>
              )}
            </p>

            {/* Cards */}
            {artisans.length === 0 ? (
              <div className="text-center py-16">
                <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Aucun artisan trouvé
                </h3>
                <p className="text-slate-500">
                  Essayez de modifier vos critères de recherche.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {artisans.map((artisan) => (
                  <ArtisanCard key={artisan.id} artisan={artisan} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <a
                    key={page}
                    href={`?${new URLSearchParams({ ...params, page: String(page) }).toString()}`}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors flex items-center justify-center ${
                      page === currentPage
                        ? 'bg-primary-800 text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {page}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
