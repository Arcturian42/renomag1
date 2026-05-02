export const dynamic = 'force-dynamic'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { Role } from '@prisma/client'
import { TrendingUp, Euro, Users, Star, ArrowUp } from 'lucide-react'

export default async function EspaceProAnalyticsPage({
  searchParams,
}: {
  searchParams: { period?: string }
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/connexion')
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: { artisan: true },
  })

  if (!dbUser || dbUser.role !== Role.ARTISAN) {
    redirect('/espace-proprietaire')
  }

  const artisan = dbUser.artisan

  // Period filter
  const period = searchParams.period || '6m'
  const now = new Date()
  let monthsBack = 6
  if (period === '7d') monthsBack = 0
  if (period === '30d') monthsBack = 1
  if (period === '3m') monthsBack = 3
  if (period === '12m') monthsBack = 12

  const fromDate = new Date(now.getFullYear(), now.getMonth() - monthsBack, now.getDate())
  if (period === '7d') fromDate.setDate(now.getDate() - 7)
  if (period === '30d') fromDate.setDate(now.getDate() - 30)

  const leads = artisan
    ? await prisma.lead.findMany({
        where: {
          artisanId: artisan.id,
          createdAt: { gte: fromDate },
        },
        orderBy: { createdAt: 'asc' },
      })
    : []

  const reviews = artisan
    ? await prisma.review.findMany({
        where: { artisanId: artisan.id },
      })
    : []

  const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : '0'
  const totalLeads = leads.length
  const convertedLeads = leads.filter((l) => l.status === 'CONVERTED').length
  const conversionRate = totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0

  // Group leads by month for chart
  const monthMap = new Map<string, number>()
  for (let i = monthsBack - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = d.toLocaleDateString('fr-FR', { month: 'short' })
    monthMap.set(key, 0)
  }

  for (const lead of leads) {
    const key = new Date(lead.createdAt).toLocaleDateString('fr-FR', { month: 'short' })
    if (monthMap.has(key)) {
      monthMap.set(key, (monthMap.get(key) || 0) + 1)
    }
  }

  const MONTHLY_DATA = Array.from(monthMap.entries()).map(([month, leads]) => ({
    month,
    leads,
    ca: leads * 15000,
    conversion: totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0,
  }))

  const maxLeads = Math.max(...MONTHLY_DATA.map((d) => d.leads), 1)

  // Project type breakdown
  const projectTypeMap = new Map<string, number>()
  for (const lead of leads) {
    projectTypeMap.set(lead.projectType, (projectTypeMap.get(lead.projectType) || 0) + 1)
  }

  const TOP_PROJECTS = Array.from(projectTypeMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([type, count]) => ({
      type,
      count,
      ca: `${count * 12} 000€`,
      avg: `${Math.round(count * 12000 / count)}€`,
    }))

  // Conversion funnel
  const contacted = leads.filter((l) => ['CONTACTED', 'QUALIFIED', 'CONVERTED', 'REJECTED'].includes(l.status)).length
  const devisSent = leads.filter((l) => ['QUALIFIED', 'CONVERTED', 'REJECTED'].includes(l.status)).length
  const won = convertedLeads

  const funnel = [
    { label: 'Leads reçus', value: totalLeads, pct: 100, color: 'bg-primary-500' },
    { label: 'Contactés', value: contacted, pct: totalLeads > 0 ? Math.round((contacted / totalLeads) * 100) : 0, color: 'bg-primary-400' },
    { label: 'Devis envoyés', value: devisSent, pct: totalLeads > 0 ? Math.round((devisSent / totalLeads) * 100) : 0, color: 'bg-eco-500' },
    { label: 'Projets gagnés', value: won, pct: totalLeads > 0 ? Math.round((won / totalLeads) * 100) : 0, color: 'bg-eco-600' },
  ]

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
        <p className="text-slate-500 mt-1">Performance de votre activité sur RENOMAG</p>
      </div>

      {/* Period selector */}
      <div className="flex items-center gap-2 mb-8">
        {[
          { label: '7 jours', value: '7d' },
          { label: '30 jours', value: '30d' },
          { label: '3 mois', value: '3m' },
          { label: '6 mois', value: '6m' },
          { label: '12 mois', value: '12m' },
        ].map((p) => (
          <Link
            key={p.value}
            href={`/espace-pro/analytics?period=${p.value}`}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              period === p.value
                ? 'bg-primary-600 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {p.label}
          </Link>
        ))}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Leads total', value: String(totalLeads), change: '+0%', icon: Users, color: 'text-primary-600 bg-primary-50' },
          { label: 'CA généré', value: `${convertedLeads * 15000}€`, change: '+0%', icon: Euro, color: 'text-eco-600 bg-eco-50' },
          { label: 'Taux conversion', value: `${conversionRate}%`, change: '+0pts', icon: TrendingUp, color: 'text-accent-600 bg-accent-50' },
          { label: 'Note moyenne', value: `${avgRating}/5`, change: '+0', icon: Star, color: 'text-purple-600 bg-purple-50' },
        ].map((kpi) => {
          const Icon = kpi.icon
          return (
            <div key={kpi.label} className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${kpi.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="flex items-center gap-0.5 text-xs font-medium text-eco-600">
                  <ArrowUp className="w-3 h-3" />
                  {kpi.change}
                </span>
              </div>
              <div className="text-2xl font-bold text-slate-900">{kpi.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{kpi.label}</div>
            </div>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Leads bar chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-900 mb-5">Leads par mois</h2>
          <div className="flex items-end gap-3 h-40">
            {MONTHLY_DATA.map((d) => (
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

        {/* CA by project type */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-900 mb-5">Top travaux (6 mois)</h2>
          <div className="space-y-3">
            {TOP_PROJECTS.length === 0 && (
              <p className="text-sm text-slate-500">Aucun projet enregistré.</p>
            )}
            {TOP_PROJECTS.map((project) => (
              <div key={project.type} className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-slate-800 truncate">{project.type}</p>
                    <span className="text-sm font-semibold text-slate-900 ml-2">{project.ca}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-400 rounded-full"
                        style={{ width: `${(project.count / Math.max(...TOP_PROJECTS.map((p) => p.count), 1)) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-400">{project.count} projets</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Conversion funnel */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-900 mb-5">Entonnoir de conversion</h2>
          <div className="space-y-3">
            {funnel.map((step) => (
              <div key={step.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-700">{step.label}</span>
                  <span className="font-semibold text-slate-900">{step.value} ({step.pct}%)</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${step.color}`} style={{ width: `${step.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly revenue */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-900 mb-5">CA mensuel (€)</h2>
          <div className="space-y-3">
            {MONTHLY_DATA.map((d) => (
              <div key={d.month} className="flex items-center gap-3">
                <span className="text-sm text-slate-500 w-8">{d.month}</span>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-eco-500 rounded-full"
                    style={{ width: `${(d.ca / 50000) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-slate-800 w-20 text-right">
                  {(d.ca / 1000).toFixed(0)}k€
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
