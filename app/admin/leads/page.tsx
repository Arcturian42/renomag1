import { TrendingUp, Users, Euro, BarChart3 } from 'lucide-react'
import { getAllLeads, getKPIs, getDepartments } from '@/app/actions/data'

export default async function AdminLeadsPage() {
  const [leads, kpis, departments] = await Promise.all([
    getAllLeads(),
    getKPIs(),
    getDepartments(),
  ])

  const regionMap = new Map<string, string>()
  departments.forEach((d) => regionMap.set(d.code, d.region))

  // Monthly chart for last 7 months
  const monthlyData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setMonth(d.getMonth() - (6 - i))
    const monthLabel = d.toLocaleDateString('fr-FR', { month: 'short' })
    const yearMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const count = leads.filter((l) => {
      const c = new Date(l.createdAt)
      return `${c.getFullYear()}-${String(c.getMonth() + 1).padStart(2, '0')}` === yearMonth
    }).length
    return { month: monthLabel, value: count }
  })

  const maxValue = Math.max(...monthlyData.map((d) => d.value), 1)

  // Group by region
  const regionGroups = new Map<string, { count: number; converted: number }>()
  leads.forEach((l) => {
    const region = regionMap.get(l.department) || l.department || 'Inconnu'
    const existing = regionGroups.get(region) || { count: 0, converted: 0 }
    existing.count++
    if (l.status === 'CONVERTED') existing.converted++
    regionGroups.set(region, existing)
  })

  const regionData = Array.from(regionGroups.entries())
    .map(([region, data]) => ({
      region,
      count: data.count,
      conversion: data.count > 0 ? `${((data.converted / data.count) * 100).toFixed(0)}%` : '0%',
    }))
    .sort((a, b) => b.count - a.count)

  const stats = [
    {
      label: 'Leads ce mois',
      value: kpis.leadsThisMonth.toLocaleString('fr-FR'),
      change: `+${kpis.leadsThisMonth}`,
      icon: <TrendingUp className="w-4 h-4" />,
      color: 'text-primary-600 bg-primary-50',
    },
    {
      label: 'Total actifs',
      value: kpis.leadCount.toLocaleString('fr-FR'),
      change: 'All time',
      icon: <Users className="w-4 h-4" />,
      color: 'text-eco-600 bg-eco-50',
    },
    {
      label: 'Taux conversion',
      value: `${kpis.conversionRate}%`,
      change: '+2.1pts',
      icon: <BarChart3 className="w-4 h-4" />,
      color: 'text-accent-600 bg-accent-50',
    },
    {
      label: 'Revenus leads',
      value: '178 000€',
      change: '+31%',
      icon: <Euro className="w-4 h-4" />,
      color: 'text-purple-600 bg-purple-50',
    },
  ]

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Leads</h1>
        <p className="text-slate-500 mt-1">Vue globale des leads et conversions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-5">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${stat.color} mb-3`}>
              {stat.icon}
            </div>
            <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
            <div className="text-xs text-eco-600 font-medium mt-0.5">{stat.change}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
        <h2 className="font-semibold text-slate-900 mb-5">Évolution mensuelle des leads</h2>
        <div className="flex items-end gap-3 h-40">
          {monthlyData.map((d) => (
            <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-xs font-medium text-slate-600">{d.value}</span>
              <div
                className="w-full rounded-t-lg bg-gradient-to-t from-primary-700 to-primary-500 transition-all"
                style={{ height: `${(d.value / maxValue) * 120}px` }}
              />
              <span className="text-xs text-slate-400">{d.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* By region */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="font-semibold text-slate-900">Leads par région</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Région</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Leads</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Taux conversion</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Revenus générés</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Tendance</th>
            </tr>
          </thead>
          <tbody>
            {regionData.map((row) => (
              <tr key={row.region} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-900">{row.region}</td>
                <td className="px-4 py-4 text-slate-600">{row.count.toLocaleString('fr-FR')}</td>
                <td className="px-4 py-4">
                  <span className="text-eco-600 font-semibold">{row.conversion}</span>
                </td>
                <td className="px-4 py-4 font-semibold text-slate-900">—</td>
                <td className="px-4 py-4 text-right">
                  <span className="text-eco-600 text-xs flex items-center justify-end gap-0.5">
                    <TrendingUp className="w-3 h-3" />
                    +
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
