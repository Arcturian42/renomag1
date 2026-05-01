import { StatsSkeleton, TableSkeleton } from '@/components/ui/skeletons/DashboardSkeleton'

export default function AdminLoading() {
  return (
    <div className="p-8 space-y-8">
      <div className="h-8 bg-slate-100 rounded animate-pulse w-48" />
      <StatsSkeleton count={4} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TableSkeleton rows={6} />
        </div>
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
            <div className="h-5 bg-slate-100 rounded animate-pulse w-32" />
            <div className="h-40 bg-slate-100 rounded animate-pulse w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}
