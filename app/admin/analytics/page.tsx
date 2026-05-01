export const dynamic = 'force-dynamic'
import { ArrowUp, ArrowDown, Users, Euro, TrendingUp, Zap, Bot } from 'lucide-react'
import { getKPIs } from '@/app/actions/data'

const MONTHLY = [
  { month: 'Nov', leads: 680, artisans: 2180, arr: 145000 },
  { month: 'Déc', leads: 720, artisans: 2250, arr: 152000 },
  { month: 'Jan', leads: 790, artisans: 2310, arr: 159000 },
  { month: 'Fév', leads: 750, artisans: 2340, arr: 164000 },
  { month: 'Mar', leads: 820, artisans: 2390, arr: 172000 },
  { month: 'Avr', leads: 890, artisans: 2418, arr: 184000 },
]

const CHANNEL_DATA = [
  { channel: 'Organique SEO', leads: 412, pct: 46, color: 'bg-eco-500' },
  { channel: 'Agents Hermes', leads: 267, pct: 30, color: 'bg-primary-500' },
  { channel: 'Réseaux sociaux', leads: 134, pct: 15, color: 'bg-accent-500' },
  { channel: 'Recommandations', leads: 77, pct: 9, color: 'bg-purple-500' },
]

export default async function AdminAnalyticsPage() {
  const kpis = await getKPIs()
  const maxLeads = Math.max(...MONTHLY.map((d) => d.leads))

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
      value: '184 000€',
      change: '+22% vs M-1',
      up: true,
      icon: Euro,
      color: 'text-accent-600 bg-accent-50',
    },
    {
      label: 'Trafic organique',
      value: '48 200',
      change: '+34% vs M-1',
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
        <select className="text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-500">
          <option>6 derniers mois</option>
          <option>12 derniers mois</option>
          <option>Tout le temps</option>
        </select>
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
                  {kpi.change}
                </span>
              </div>
              <div className="text-2xl font-bold text-slate-900">{kpi.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{kpi.label}</div>
            </div>
          )
        })}
      </div>

      {/* ARR progress */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-semibold text-slate-900">Objectif ARR</h2>
            <p className="text-xs text-slate-500 mt-0.5">500 000€ en 18 mois — Mois 7/18</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-primary-700">184 000€</p>
            <p className="text-xs text-slate-500">36,8% de l&apos;objectif</p>
          </div>
        </div>
        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary-600 to-eco-500 rounded-full" style={{ width: '36.8%' }} />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Leads bar chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-900 mb-5">Leads générés par mois</h2>
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
          <h2 className="font-semibold text-slate-900 mb-5">Sources de leads (ce mois)</h2>
          <div className="space-y-4">
            {CHANNEL_DATA.map((ch) => (
              <div key={ch.channel}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-700">{ch.channel}</span>
                  <span className="font-semibold text-slate-900">
                    {ch.leads} <span className="text-slate-400 font-normal">({ch.pct}%)</span>
                  </span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${ch.color}`} style={{ width: `${ch.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Agents performance */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center gap-2 mb-5">
          <Bot className="w-5 h-5 text-primary-600" />
          <h2 className="font-semibold text-slate-900">Performance des agents Hermes</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left font-semibold text-slate-500 text-xs uppercase tracking-wide pb-3">Agent</th>
                <th className="text-left font-semibold text-slate-500 text-xs uppercase tracking-wide pb-3">Tâches / jour</th>
                <th className="text-left font-semibold text-slate-500 text-xs uppercase tracking-wide pb-3">Taux succès</th>
                <th className="text-left font-semibold text-slate-500 text-xs uppercase tracking-wide pb-3">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { name: 'Hermes-Scraper', tasks: 342, success: 98 },
                { name: 'Hermes-Enrichment', tasks: 127, success: 94 },
                { name: 'Hermes-Content', tasks: 89, success: 99 },
                { name: 'Hermes-Matching', tasks: 234, success: 97 },
                { name: 'Hermes-Analytics', tasks: 67, success: 100 },
              ].map((agent) => (
                <tr key={agent.name} className="hover:bg-slate-50">
                  <td className="py-3 font-medium text-slate-900">{agent.name}</td>
                  <td className="py-3 text-slate-600">{agent.tasks}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-eco-500 rounded-full" style={{ width: `${agent.success}%` }} />
                      </div>
                      <span className="text-slate-700 font-medium">{agent.success}%</span>
                    </div>
                  </td>
                  <td className="py-3">
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-eco-700 bg-eco-50 rounded-full px-2 py-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-eco-500 animate-pulse" />
                      Actif
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
