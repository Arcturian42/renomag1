'use client'

import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Search } from 'lucide-react'
import { cn } from '@/lib/utils'

type Column<T> = {
  key: string
  header: string
  render?: (item: T) => React.ReactNode
  sortable?: boolean
}

type DataTableProps<T> = {
  data: T[]
  columns: Column<T>[]
  searchKeys?: string[]
  itemsPerPage?: number
  onRowClick?: (item: T) => void
}

export default function DataTable<T extends Record<string, any>>({
  data,
  columns,
  searchKeys = [],
  itemsPerPage = 20,
  onRowClick,
}: DataTableProps<T>) {
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    let result = [...data]
    if (search && searchKeys.length > 0) {
      const q = search.toLowerCase()
      result = result.filter((item) =>
        searchKeys.some((key) => {
          const val = key.split('.').reduce((o, k) => o?.[k], item)
          return String(val).toLowerCase().includes(q)
        })
      )
    }
    if (sortKey) {
      result.sort((a, b) => {
        const aVal = sortKey.split('.').reduce((o, k) => o?.[k], a)
        const bVal = sortKey.split('.').reduce((o, k) => o?.[k], b)
        if (aVal < bVal) return sortDir === 'asc' ? -1 : 1
        if (aVal > bVal) return sortDir === 'asc' ? 1 : -1
        return 0
      })
    }
    return result
  }, [data, search, searchKeys, sortKey, sortDir])

  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage)

  function toggleSort(key: string) {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
    setPage(1)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
          />
        </div>
        <div className="text-sm text-slate-500">
          {filtered.length} résultat{filtered.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={cn(
                      'px-4 py-3 font-semibold whitespace-nowrap',
                      col.sortable && 'cursor-pointer select-none hover:text-primary-700'
                    )}
                    onClick={() => col.sortable && toggleSort(col.key)}
                  >
                    <div className="flex items-center gap-1">
                      {col.header}
                      {col.sortable && sortKey === col.key && (
                        sortDir === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-8 text-center text-slate-400">
                    Aucun résultat trouvé
                  </td>
                </tr>
              ) : (
                paginated.map((item, idx) => (
                  <tr
                    key={idx}
                    className={cn(
                      'transition-colors',
                      onRowClick ? 'hover:bg-slate-50 cursor-pointer' : 'hover:bg-slate-50'
                    )}
                    onClick={() => onRowClick?.(item)}
                  >
                    {columns.map((col) => (
                      <td key={col.key} className="px-4 py-3 whitespace-nowrap">
                        {col.render ? col.render(item) : item[col.key]}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Précédent
            </button>
            <span className="text-sm text-slate-500">
              Page {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Suivant
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
