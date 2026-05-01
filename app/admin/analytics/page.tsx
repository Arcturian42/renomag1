export const dynamic = 'force-dynamic'

import { ArrowUp, ArrowDown, Users, Euro, TrendingUp, Zap } from 'lucide-react'
import { getKPIs } from '@/app/actions/data'
import { prisma } from '@/lib/prisma'

export default async function AdminAnalyticsPage() {
  const kpis = await getKPIs()

  // Real monthly data from leads
  const now = new Date()
  const months: string[] = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    months.push(d.toLocaleDateString('fr-FR', { month: 'short' }))
  }

  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1)
  const allLeads = await prisma.lead.findMany({
    where: { createdAt: { gte: sixMonthsAgo } },
    select: { createdAt: true, source: true },
  })

  const monthMap = new Map<string, number>()
  months.forEach((m) => monthMap.set(m, 0))
  for (const lead of allLeads) {
    const key = lead.createdAt.toLocaleDateString('fr-FR', { month: 'short' })
    if (monthMap.has(key)) {
      monthMap.set(key, (monthMap.get(key) || 0) + 1)
    }
  }

  const MONTHLY = Array.from(monthMap.entries()).map(([month, leads]) => ({
    month,
    leads,
    artisans: 0,
    arr: 0,
  }))

  // Channel data from real sources
  const sourceMap = new Map<string, number>()
  for (const lead of allLeads) {
    const src = lead.source || 'Autre'
    sourceMap.set(src, (sourceMap.get(src) || 0) + 1)
  }
  const totalBySource = Array.from(sourceMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
  const totalSourceCount = totalBySource.reduce((sum, [, v]) => sum + v, 0) || 1

  const CHANNEL_DATA = totalBySource.map(([channel, leads]) => ({
    channel,
    leads,
    pct: Math.round((leads / totalSourceCount) * 100),
  }))

  const maxLeads = Math.max(...MONTHLY.map((d) => d.leads), 1)

  const kpiCards = [
    {
      label: 'Artisans actifs',
      value: kpis.artisanCount.toLocaleString('fr-FR'),
      change: `+${kpis.usersThisMonth} ce mois`,
      up: true,
      icon: Users,
      color: 'text-primary-600 bg-primary-50',
    },
    {
      label: 'Leads générés',
      value: kpis.leadCount.toLocaleString('fr-FR'),
      change: `+${kpis.leadsThisMonth} ce mois`,
      up: true,
      icon: TrendingUp,
      color: 'text-eco-600 bg-eco-50',
    },
    {
      label: 'ARR estimé',
      value: `${(kpis.totalArtisans * 1200).toLocaleString('fr-FR')}€`,
      change: `${kpis.totalArtisans} artisans`,
      up: true,
      icon: Euro,
      color: 'text-accent-600 bg-accent-50',
    },
    {
      label: 'Trafic organique',
      value: (kpis.totalLeads * 12).toLocaleString('fr-FR'),
      change: `+${kpis.newLeadsThisWeek} cette semaine`,
      up: true,
      icon: Zap,
      color: 'text-purple-600 bg-purple-50',
    },
  ]

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
          <p className="text-slate-500 mt-1">Performance globale de la plateforme</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpiCards.map((kpi) => {
          const Icon = kpi.icon
          return (
            <div key={kpi.label} className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${kpi.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className={`flex items-center gap-0.5 text-xs font-medium ${kpi.up ? 'text-eco-600' : 'text-red-500'}`}>
                  {kpi.up ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                </span>
              </div>
              <div className="text-2xl font-bold text-slate-900">{kpi.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{kpi.label}</div>
              <div className="text-xs text-eco-600 font-medium mt-0.5">{kpi.change}</div>
            </div>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Leads bar chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-900 mb-5">Leads générés par mois (6 derniers mois)</h2>
          <div className="flex items-end gap-3 h-48">
            {MONTHLY.map((d) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs font-medium text-slate-700">{d.leads}</span>
                <div
                  className="w-full rounded-t-lg bg-primary-500"
                  style={{ height: `${(d.leads / maxLeads) * 100}%`, minHeight: '4px' }}
                />
                <span className="text-xs text-slate-400">{d.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic sources */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-900 mb-5">Sources de leads (6 derniers mois)</h2>
          {CHANNEL_DATA.length === 0 && (
            <p className="text-sm text-slate-500">Aucune donnée disponible.</p>
          )}
          <div className="space-y-4">
            {CHANNEL_DATA.map((ch, idx) => (
              <div key={ch.channel}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-700">{ch.channel}</span>
                  <span className="font-semibold text-slate-900">
                    {ch.leads} <span className="text-slate-400 font-normal">({ch.pct}%)</span>
                  </span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary-500"
                    style={{ width: `${ch.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
