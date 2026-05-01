export function ArtisanCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-xl bg-slate-100 animate-pulse flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-slate-100 rounded animate-pulse w-1/2" />
          <div className="h-3 bg-slate-100 rounded animate-pulse w-1/3" />
          <div className="flex gap-2">
            <div className="h-5 bg-slate-100 rounded-full animate-pulse w-16" />
            <div className="h-5 bg-slate-100 rounded-full animate-pulse w-20" />
          </div>
        </div>
      </div>
      <div className="h-3 bg-slate-100 rounded animate-pulse w-full" />
      <div className="h-3 bg-slate-100 rounded animate-pulse w-4/5" />
      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <div className="h-4 bg-slate-100 rounded animate-pulse w-24" />
        <div className="h-8 bg-slate-100 rounded animate-pulse w-28" />
      </div>
    </div>
  )
}
