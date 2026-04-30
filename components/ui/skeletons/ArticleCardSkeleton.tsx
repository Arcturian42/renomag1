export function ArticleCardSkeleton() {
  return (
    <div className="flex flex-col rounded-xl overflow-hidden border border-slate-200 bg-white">
      <div className="relative h-44 bg-slate-100 animate-pulse" />
      <div className="flex flex-col flex-1 p-5 space-y-3">
        <div className="h-4 bg-slate-100 rounded animate-pulse w-3/4" />
        <div className="h-3 bg-slate-100 rounded animate-pulse w-full" />
        <div className="h-3 bg-slate-100 rounded animate-pulse w-2/3" />
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
          <div className="h-3 bg-slate-100 rounded animate-pulse w-20" />
          <div className="h-3 bg-slate-100 rounded animate-pulse w-16" />
        </div>
      </div>
    </div>
  )
}

export function ArticleFeaturedSkeleton() {
  return (
    <div className="group grid md:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-slate-200 bg-white">
      <div className="relative h-64 md:h-auto bg-slate-100 animate-pulse" />
      <div className="bg-white p-8 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <div className="h-4 bg-slate-100 rounded animate-pulse w-24" />
          <div className="h-8 bg-slate-100 rounded animate-pulse w-3/4" />
          <div className="h-4 bg-slate-100 rounded animate-pulse w-full" />
          <div className="h-4 bg-slate-100 rounded animate-pulse w-5/6" />
        </div>
        <div className="flex items-center justify-between mt-6 pt-5 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-100 animate-pulse" />
            <div className="space-y-1">
              <div className="h-3 bg-slate-100 rounded animate-pulse w-24" />
              <div className="h-2 bg-slate-100 rounded animate-pulse w-16" />
            </div>
          </div>
          <div className="h-3 bg-slate-100 rounded animate-pulse w-12" />
        </div>
      </div>
    </div>
  )
}
