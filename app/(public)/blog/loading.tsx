import { ArticleCardSkeleton, ArticleFeaturedSkeleton } from '@/components/ui/skeletons/ArticleCardSkeleton'

export default function BlogLoading() {
  return (
    <div className="bg-white min-h-screen">
      {/* Header skeleton */}
      <div className="bg-slate-900 text-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-4">
            <div className="h-5 bg-slate-700 rounded animate-pulse w-32" />
            <div className="h-10 bg-slate-700 rounded animate-pulse w-3/4" />
            <div className="h-5 bg-slate-700 rounded animate-pulse w-full" />
          </div>
          <div className="mt-8 flex max-w-md gap-0">
            <div className="flex-1 h-10 bg-slate-700 rounded-l-xl animate-pulse" />
            <div className="h-10 bg-slate-700 rounded-r-xl animate-pulse w-24" />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Category pills */}
        <div className="flex flex-wrap gap-2 mb-10">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-8 bg-slate-100 rounded-full animate-pulse w-20" />
          ))}
        </div>

        {/* Featured article */}
        <div className="mb-10">
          <ArticleFeaturedSkeleton />
        </div>

        {/* Article grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <ArticleCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
