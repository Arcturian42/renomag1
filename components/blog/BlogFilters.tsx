'use client'

import { useCallback, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, X } from 'lucide-react'

interface BlogFiltersProps {
  categories: string[]
  defaultValues: {
    q?: string
    category?: string
  }
}

export default function BlogFilters({ categories, defaultValues }: BlogFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const createQueryString = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams?.toString() ?? '')
      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === '') {
          params.delete(key)
        } else {
          params.set(key, value)
        }
      })
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

  const hasFilters = defaultValues.q || defaultValues.category

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="flex max-w-md gap-0">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher un article..."
            className="w-full rounded-l-xl bg-white/10 border border-white/20 px-4 pl-10 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent-400/50"
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
        <button
          onClick={() => {
            const input = document.querySelector('input[type="text"]') as HTMLInputElement
            const q = input?.value
            if (q) updateFilter({ q })
          }}
          className="btn-accent rounded-l-none rounded-r-xl px-5"
        >
          Chercher
        </button>
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => updateFilter({ category: undefined })}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            !defaultValues.category
              ? 'bg-primary-800 text-white'
              : 'border border-slate-200 text-slate-600 hover:border-primary-300 hover:text-primary-700'
          }`}
        >
          Tous
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => updateFilter({ category: cat })}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              defaultValues.category === cat
                ? 'bg-primary-800 text-white'
                : 'border border-slate-200 text-slate-600 hover:border-primary-300 hover:text-primary-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Active filters */}
      {hasFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-slate-400">Filtres actifs :</span>
          {defaultValues.q && (
            <FilterTag label={`Recherche: ${defaultValues.q}`} onRemove={() => updateFilter({ q: undefined })} />
          )}
          {defaultValues.category && (
            <FilterTag label={defaultValues.category} onRemove={() => updateFilter({ category: undefined })} />
          )}
          <button
            onClick={() => {
              startTransition(() => {
                router.push('?', { scroll: false })
              })
            }}
            className="text-sm text-accent-400 hover:text-accent-300 font-medium flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" />
            Tout effacer
          </button>
        </div>
      )}

      {isPending && (
        <div className="text-sm text-slate-400">Mise à jour des articles...</div>
      )}
    </div>
  )
}

function FilterTag({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 bg-white/10 text-white text-xs font-medium px-2.5 py-1 rounded-full border border-white/20">
      {label}
      <button onClick={onRemove} className="hover:text-accent-300">
        <X className="w-3 h-3" />
      </button>
    </span>
  )
}
