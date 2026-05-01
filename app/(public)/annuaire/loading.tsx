import { ArtisanCardSkeleton } from '@/components/ui/skeletons/ArtisanCardSkeleton'

export default function AnnuaireLoading() {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header skeleton */}
      <div className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-4">
          <div className="h-5 bg-slate-100 rounded animate-pulse w-32" />
          <div className="h-8 bg-slate-100 rounded animate-pulse w-1/2" />
          <div className="h-4 bg-slate-100 rounded animate-pulse w-2/3" />
          <div className="mt-6 flex flex-col sm:flex-row gap-3 max-w-3xl">
            <div className="flex-1 h-10 bg-slate-100 rounded animate-pulse" />
            <div className="h-10 bg-slate-100 rounded animate-pulse w-48" />
            <div className="h-10 bg-slate-100 rounded animate-pulse w-32" />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar skeleton */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-6">
              <div className="h-5 bg-slate-100 rounded animate-pulse w-20" />
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="h-4 bg-slate-100 rounded animate-pulse w-16" />
                  {Array.from({ length: 4 }).map((_, j) => (
                    <div key={j} className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-slate-100 rounded animate-pulse" />
                      <div className="h-3 bg-slate-100 rounded animate-pulse w-24" />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </aside>

          {/* Results skeleton */}
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between mb-5">
              <div className="h-4 bg-slate-100 rounded animate-pulse w-32" />
              <div className="h-8 bg-slate-100 rounded animate-pulse w-24" />
            </div>
            {Array.from({ length: 4 }).map((_, i) => (
              <ArtisanCardSkeleton key={i} />
            ))}
            <div className="mt-8 flex items-center justify-center gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="w-9 h-9 bg-slate-100 rounded-lg animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
