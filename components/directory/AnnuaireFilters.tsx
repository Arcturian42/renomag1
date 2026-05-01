'use client'

import { useState, useTransition } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Search, SlidersHorizontal, X } from 'lucide-react'

interface AnnuaireFiltersProps {
  specialties: string[]
  regions: string[]
  defaultValues: {
    q?: string
    specialite?: string
    region?: string
    certification?: string
    minRating?: string
    sort?: string
  }
  totalResults: number
}

export default function AnnuaireFilters({
  specialties,
  regions,
  defaultValues,
}: AnnuaireFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  const [q, setQ] = useState(defaultValues.q || '')
  const [specialite, setSpecialite] = useState(defaultValues.specialite || '')
  const [region, setRegion] = useState(defaultValues.region || '')
  const [certification, setCertification] = useState(defaultValues.certification || '')
  const [minRating, setMinRating] = useState(defaultValues.minRating || '')
  const [sort, setSort] = useState(defaultValues.sort || 'note')

  const applyFilters = (updates: Record<string, string>) => {
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (specialite) params.set('specialite', specialite)
    if (region) params.set('region', region)
    if (certification) params.set('certification', certification)
    if (minRating) params.set('minRating', minRating)
    if (sort) params.set('sort', sort)

    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })

    params.delete('page')

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`)
    })
  }

  const handleSearch = () => {
    applyFilters({ q })
  }

  const handleClear = () => {
    setQ('')
    setSpecialite('')
    setRegion('')
    setCertification('')
    setMinRating('')
    setSort('note')
    startTransition(() => {
      router.push(pathname)
    })
  }

  const hasFilters = q || specialite || region || certification || minRating || sort !== 'note'

  return (
    <div className="mt-6">
      {/* Search bar */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher un artisan, une ville, une spécialité..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={isPending}
          className="bg-primary-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
        >
          {isPending ? '...' : 'Rechercher'}
        </button>
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="lg:hidden flex items-center gap-2 bg-white border border-slate-200 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filtres
        </button>
      </div>

      {/* Filters */}
      <div className={`${showMobileFilters ? 'block' : 'hidden'} lg:block`}>
        <div className="flex flex-wrap items-center gap-3">
          <select
            className="input-field text-sm py-2"
            value={specialite}
            onChange={(e) => {
              setSpecialite(e.target.value)
              applyFilters({ specialite: e.target.value })
            }}
          >
            <option value="">Toutes les spécialités</option>
            {specialties.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select
            className="input-field text-sm py-2"
            value={region}
            onChange={(e) => {
              setRegion(e.target.value)
              applyFilters({ region: e.target.value })
            }}
          >
            <option value="">Toutes les régions</option>
            {regions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>

          <select
            className="input-field text-sm py-2"
            value={certification}
            onChange={(e) => {
              setCertification(e.target.value)
              applyFilters({ certification: e.target.value })
            }}
          >
            <option value="">Toutes les certifications</option>
            <option value="RGE">RGE</option>
            <option value="QualiPAC">QualiPAC</option>
            <option value="QualiSol">QualiSol</option>
            <option value="Qualibois">Qualibois</option>
            <option value="QualiPV">QualiPV</option>
            <option value="Eco Artisan">Eco Artisan</option>
          </select>

          <select
            className="input-field text-sm py-2"
            value={minRating}
            onChange={(e) => {
              setMinRating(e.target.value)
              applyFilters({ minRating: e.target.value })
            }}
          >
            <option value="">Toutes les notes</option>
            <option value="4">4+ étoiles</option>
            <option value="4.5">4.5+ étoiles</option>
            <option value="5">5 étoiles</option>
          </select>

          <select
            className="input-field text-sm py-2"
            value={sort}
            onChange={(e) => {
              setSort(e.target.value)
              applyFilters({ sort: e.target.value })
            }}
          >
            <option value="note">Note</option>
            <option value="avis">Nombre d'avis</option>
            <option value="recent">Plus récents</option>
            <option value="experience">Expérience</option>
          </select>

          {hasFilters && (
            <button
              onClick={handleClear}
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 font-medium"
            >
              <X className="w-3.5 h-3.5" />
              Réinitialiser
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
