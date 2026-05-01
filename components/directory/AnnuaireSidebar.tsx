'use client'

import { useCallback, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Filter } from 'lucide-react'

interface AnnuaireSidebarProps {
  regions: string[]
  defaultValues: {
    region?: string
    certification?: string
    minRating?: string
  }
}

const CERTIFICATIONS = ['RGE', 'QualiPAC', 'QualiSol', 'Qualibois', 'QualiPV']

const RATINGS = [
  { value: '4.5', label: '4.5+ ⭐' },
  { value: '4.0', label: '4.0+ ⭐' },
  { value: '3.5', label: '3.5+ ⭐' },
]

export default function AnnuaireSidebar({ regions, defaultValues }: AnnuaireSidebarProps) {
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
      params.delete('page')
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

  return (
    <aside className="hidden lg:block w-64 flex-shrink-0">
      <div className="bg-white rounded-xl border border-slate-200 p-5 sticky top-24">
        <div className="flex items-center gap-2 mb-5">
          <Filter className="w-4 h-4 text-slate-600" />
          <h2 className="font-semibold text-slate-900">Filtres</h2>
        </div>

        {/* Region */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-slate-700 mb-3">Région</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-hide">
            {regions.map((region) => (
              <label key={region} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                  checked={defaultValues.region === region}
                  onChange={() =>
                    updateFilter({
                      region: defaultValues.region === region ? undefined : region,
                    })
                  }
                />
                <span className="text-sm text-slate-600">{region}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-slate-700 mb-3">Certifications</h3>
          {CERTIFICATIONS.map((cert) => (
            <label key={cert} className="flex items-center gap-2 mb-2 cursor-pointer">
              <input
                type="checkbox"
                className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                checked={defaultValues.certification === cert}
                onChange={() =>
                  updateFilter({
                    certification: defaultValues.certification === cert ? undefined : cert,
                  })
                }
              />
              <span className="text-sm text-slate-600">{cert}</span>
            </label>
          ))}
        </div>

        {/* Rating */}
        <div>
          <h3 className="text-sm font-medium text-slate-700 mb-3">Note minimale</h3>
          {RATINGS.map((rating) => (
            <label key={rating.value} className="flex items-center gap-2 mb-2 cursor-pointer">
              <input
                type="radio"
                name="rating"
                className="border-slate-300 text-primary-600 focus:ring-primary-500"
                checked={defaultValues.minRating === rating.value}
                onChange={() => updateFilter({ minRating: rating.value })}
              />
              <span className="text-sm text-slate-600">{rating.label}</span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  )
}
