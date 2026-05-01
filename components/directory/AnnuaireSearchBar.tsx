'use client'

import { useCallback, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, MapPin, X } from 'lucide-react'

interface AnnuaireSearchBarProps {
  specialties: string[]
  defaultValues: {
    q?: string
    specialite?: string
    sort?: string
  }
}

const SORT_OPTIONS = [
  { value: 'note', label: 'Mieux notés' },
  { value: 'avis', label: 'Plus d\'avis' },
  { value: 'recent', label: 'Plus récents' },
  { value: 'experience', label: 'Plus d\'expérience' },
]

export default function AnnuaireSearchBar({
  specialties,
  defaultValues,
}: AnnuaireSearchBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const createQueryString = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString())
      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === '') {
          params.delete(key)
        } else {
          params.set(key, value)
        }
      })
      if (Object.keys(updates).some((k) => k !== 'page')) {
        params.delete('page')
      }
      return params.toString()
    },
    [searchParams]
  )

  const updateFilter = (updates: Record<string, string | undefined>) => {
    startTransition(() => {
      const query = createQueryString(updates)
      router.push(`?${query}`, { scroll: false })
    })
  }

  const hasFilters = defaultValues.q || defaultValues.specialite || defaultValues.sort

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="flex flex-col sm:flex-row gap-3 max-w-3xl">
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Ville, département ou code postal..."
            className="input-field pl-10"
            defaultValue={defaultValues.q ?? ''}
            onChange={(e) => {
              const value = e.target.value
              window.clearTimeout((e.target as any)._timeout)
              ;(e.target as any)._timeout = window.setTimeout(() => {
                updateFilter({ q: value || undefined })
              }, 300)
            }}
          />
        </div>
        <div className="relative">
          <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <select
            className="input-field pl-10 pr-8 appearance-none cursor-pointer"
            value={defaultValues.specialite ?? ''}
            onChange={(e) => updateFilter({ specialite: e.target.value || undefined })}
          >
            <option value="">Toutes spécialités</option>
            {specialties.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <select
          className="text-sm border border-slate-200 rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          value={defaultValues.sort ?? 'note'}
          onChange={(e) => updateFilter({ sort: e.target.value })}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Active filters */}
      {hasFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-slate-500">Filtres actifs :</span>
          {defaultValues.q && (
            <FilterTag label={`Recherche: ${defaultValues.q}`} onRemove={() => updateFilter({ q: undefined })} />
          )}
          {defaultValues.specialite && (
            <FilterTag label={defaultValues.specialite} onRemove={() => updateFilter({ specialite: undefined })} />
          )}
          {defaultValues.sort && defaultValues.sort !== 'note' && (
            <FilterTag
              label={SORT_OPTIONS.find((o) => o.value === defaultValues.sort)?.label ?? defaultValues.sort}
              onRemove={() => updateFilter({ sort: undefined })}
            />
          )}
          <button
            onClick={() => {
              startTransition(() => {
                router.push('?', { scroll: false })
              })
            }}
            className="text-sm text-primary-700 hover:text-primary-800 font-medium flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" />
            Tout effacer
          </button>
        </div>
      )}

      {isPending && (
        <div className="text-sm text-slate-400">Mise à jour des résultats...</div>
      )}
    </div>
  )
}

function FilterTag({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 bg-primary-50 text-primary-800 text-xs font-medium px-2.5 py-1 rounded-full">
      {label}
      <button onClick={onRemove} className="hover:text-primary-900">
        <X className="w-3 h-3" />
      </button>
    </span>
  )
}
