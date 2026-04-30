import type { Metadata } from 'next'
import { ARTISANS, SPECIALTIES, REGIONS } from '@/lib/data/artisans'
import ArtisanCard from '@/components/directory/ArtisanCard'
import { Search, SlidersHorizontal, MapPin, Filter } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Annuaire des artisans RGE — Trouvez un professionnel certifié',
  description:
    'Consultez notre annuaire de 2 400+ artisans RGE certifiés en France. Filtrez par spécialité, région et certifications. Devis gratuit sous 24h.',
}

export default function AnnuairePage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="max-w-2xl">
            <div className="badge-primary mb-3">2 400+ artisans</div>
            <h1 className="text-3xl font-bold text-slate-900">
              Annuaire des artisans RGE
            </h1>
            <p className="mt-2 text-slate-500">
              Trouvez les meilleurs professionnels certifiés dans votre région
            </p>
          </div>

          {/* Search bar */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3 max-w-3xl">
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Ville, département ou code postal..."
                className="input-field pl-10"
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select className="input-field pl-10 pr-8 appearance-none cursor-pointer">
                <option value="">Toutes spécialités</option>
                {SPECIALTIES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <button className="btn-primary px-6 whitespace-nowrap">
              <Search className="w-4 h-4" />
              Rechercher
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar filters */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-xl border border-slate-200 p-5 sticky top-24">
              <div className="flex items-center gap-2 mb-5">
                <Filter className="w-4 h-4 text-slate-600" />
                <h2 className="font-semibold text-slate-900">Filtres</h2>
              </div>

              {/* Region */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-slate-700 mb-3">Région</h3>
                <div className="space-y-2">
                  {REGIONS.map((region) => (
                    <label key={region} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-slate-600">{region}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Specialties */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-slate-700 mb-3">Spécialités</h3>
                <div className="space-y-2">
                  {SPECIALTIES.slice(0, 6).map((spec) => (
                    <label key={spec} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-slate-600">{spec}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-slate-700 mb-3">Certifications</h3>
                {['RGE', 'QualiPAC', 'QualiSol', 'Qualibois', 'QualiPV'].map((cert) => (
                  <label key={cert} className="flex items-center gap-2 mb-2 cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked={cert === 'RGE'}
                      className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-slate-600">{cert}</span>
                  </label>
                ))}
              </div>

              {/* Rating */}
              <div>
                <h3 className="text-sm font-medium text-slate-700 mb-3">Note minimale</h3>
                {[4.5, 4.0, 3.5].map((rating) => (
                  <label key={rating} className="flex items-center gap-2 mb-2 cursor-pointer">
                    <input
                      type="radio"
                      name="rating"
                      className="border-slate-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-slate-600">{rating}+ ⭐</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1">
            {/* Sort bar */}
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-slate-500">
                <strong className="text-slate-900">{ARTISANS.length} artisans</strong> trouvés
              </p>
              <div className="flex items-center gap-3">
                <button className="lg:hidden flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900">
                  <SlidersHorizontal className="w-4 h-4" />
                  Filtres
                </button>
                <select className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20">
                  <option>Mieux notés</option>
                  <option>Plus d'avis</option>
                  <option>Plus récents</option>
                  <option>Disponibles</option>
                </select>
              </div>
            </div>

            {/* Cards */}
            <div className="space-y-4">
              {ARTISANS.map((artisan) => (
                <ArtisanCard key={artisan.id} artisan={artisan} />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex items-center justify-center gap-2">
              {[1, 2, 3, '...', 8].map((page, i) => (
                <button
                  key={i}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                    page === 1
                      ? 'bg-primary-800 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
