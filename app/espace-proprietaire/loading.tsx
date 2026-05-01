import { StatsSkeleton, TableSkeleton } from '@/components/ui/skeletons/DashboardSkeleton'

export default function EspaceProprietaireLoading() {
  return (
    <div className="p-8 space-y-8">
      <div className="h-8 bg-slate-100 rounded animate-pulse w-64" />
      <StatsSkeleton count={3} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <div className="h-5 bg-slate-100 rounded animate-pulse w-32" />
          <div className="h-32 bg-slate-100 rounded animate-pulse w-full" />
        </div>
        <TableSkeleton rows={4} />
      </div>
    </div>
  )
}
