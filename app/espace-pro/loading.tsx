import { StatsSkeleton, TableSkeleton } from '@/components/ui/skeletons/DashboardSkeleton'

export default function EspaceProLoading() {
  return (
    <div className="p-8 space-y-8">
      <div className="h-8 bg-slate-100 rounded animate-pulse w-56" />
      <StatsSkeleton count={3} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TableSkeleton rows={5} />
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <div className="h-5 bg-slate-100 rounded animate-pulse w-32" />
          <div className="h-48 bg-slate-100 rounded animate-pulse w-full" />
        </div>
      </div>
    </div>
  )
}
