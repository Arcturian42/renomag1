export function StatsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-slate-200 p-6 space-y-3">
          <div className="h-4 bg-slate-100 rounded animate-pulse w-24" />
          <div className="h-8 bg-slate-100 rounded animate-pulse w-16" />
          <div className="h-3 bg-slate-100 rounded animate-pulse w-20" />
        </div>
      ))}
    </div>
  )
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden space-y-4 p-4">
      <div className="h-8 bg-slate-100 rounded animate-pulse w-full" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-12 bg-slate-100 rounded animate-pulse w-full" />
      ))}
    </div>
  )
}

export function ChartSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="h-5 bg-slate-100 rounded animate-pulse w-32 mb-6" />
      <div className="h-64 bg-slate-100 rounded animate-pulse w-full" />
    </div>
  )
}
