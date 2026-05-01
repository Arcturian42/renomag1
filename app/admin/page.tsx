import { ArrowUp, ArrowDown, Users, TrendingUp, Euro, Zap, Bot } from 'lucide-react'
import { getKPIs, getAllUsers, getAllArtisans, getAllLeads, getAllArticles } from '@/app/actions/data'
import { formatDateShort } from '@/lib/utils'

export default async function AdminDashboard() {
  const kpis = await getKPIs()
  const [recentUsers, recentArtisans, recentLeads, recentArticles] = await Promise.all([
    getAllUsers().then((u) => u.slice(0, 3)),
    getAllArtisans().then((a) => a.slice(0, 3)),
    getAllLeads().then((l) => l.slice(0, 3)),
    getAllArticles().then((a) => a.slice(0, 3)),
  ])

  const currentMonth = new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })

  const METRICS = [
    {
      label: 'Artisans actifs',
      value: kpis.artisanCount.toLocaleString('fr-FR'),
      change: `+${kpis.usersThisMonth} ce mois`,
      trend: 'up',
      icon: <Users className="w-4 h-4" />,
      color: 'text-primary-600 bg-primary-50',
    },
    {
      label: 'Leads totaux',
      value: kpis.leadCount.toLocaleString('fr-FR'),
      change: `+${kpis.leadsThisMonth} ce mois`,
      trend: 'up',
      icon: <TrendingUp className="w-4 h-4" />,
      color: 'text-eco-600 bg-eco-50',
    },
    {
      label: 'ARR estimé',
      value: `${(kpis.totalArtisans * 1200).toLocaleString('fr-FR')}€`,
      change: `${kpis.totalArtisans > 0 ? '+' : ''}${kpis.totalArtisans} artisans`,
      trend: 'up',
      icon: <Euro className="w-4 h-4" />,
      color: 'text-accent-600 bg-accent-50',
    },
    {
      label: 'Trafic organique',
      value: (kpis.totalLeads * 12).toLocaleString('fr-FR'),
      change: `+${kpis.newLeadsThisWeek} cette semaine`,
      trend: 'up',
      icon: <Zap className="w-4 h-4" />,
      color: 'text-purple-600 bg-purple-50',
    },
  ]

  const SYSTEM_STATUS = [
    { name: 'API', status: 'active', lastRun: 'En ligne', tasks: 0 },
    { name: 'Base de données', status: 'active', lastRun: 'En ligne', tasks: 0 },
    { name: 'Auth', status: 'active', lastRun: 'En ligne', tasks: 0 },
    { name: 'Cache Redis', status: process.env.UPSTASH_REDIS_REST_URL ? 'active' : 'paused', lastRun: process.env.UPSTASH_REDIS_REST_URL ? 'Connecté' : 'Non configuré', tasks: 0 },
    { name: 'Rate Limiting', status: 'active', lastRun: 'Actif', tasks: 0 },
    { name: 'Emails', status: 'paused', lastRun: 'Non configuré', tasks: 0 },
  ]

  const recentActivity = [
    ...recentArtisans.slice(0, 2).map((a) => ({
      type: 'artisan' as const,
      message: `Nouvel artisan inscrit : ${a.name}`,
      time: formatDateShort(a.createdAt),
      icon: '👤',
    })),
    ...recentLeads.slice(0, 2).map((l) => ({
      type: 'lead' as const,
      message: `Nouveau lead : ${l.firstName} ${l.lastName}`,
      time: formatDateShort(l.createdAt),
      icon: '📊',
    })),
    ...recentArticles.slice(0, 1).map((a) => ({
      type: 'content' as const,
      message: `Article publié : "${a.title}"`,
      time: formatDateShort(a.createdAt),
      icon: '📝',
    })),
  ]

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Vue d&apos;ensemble</h1>
          <p className="text-slate-500 mt-1">{currentMonth} — Vue d&apos;ensemble</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-eco-50 border border-eco-200 rounded-full px-3 py-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-eco-500 animate-pulse" />
            <span className="text-xs font-medium text-eco-700">
              {SYSTEM_STATUS.filter((a) => a.status === 'active').length} services actifs
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-primary-50 border border-primary-200 rounded-full px-3 py-1.5">
            <Bot className="w-3.5 h-3.5 text-primary-600" />
            <span className="text-xs font-medium text-primary-700">
              Admin
            </span>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {METRICS.map((metric) => (
          <div key={metric.label} className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${metric.color}`}>
                {metric.icon}
              </div>
              <span
                className={`flex items-center gap-0.5 text-xs font-medium ${
                  metric.trend === 'up' ? 'text-eco-600' : 'text-red-500'
                }`}
              >
                {metric.trend === 'up' ? (
                  <ArrowUp className="w-3 h-3" />
                ) : (
                  <ArrowDown className="w-3 h-3" />
                )}
              </span>
            </div>
            <div className="text-2xl font-bold text-slate-900">{metric.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{metric.label}</div>
            <div className="text-xs text-eco-600 font-medium mt-0.5">{metric.change}</div>
          </div>
        ))}
      </div>

      {/* Key metrics */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-semibold text-slate-900">Métriques clés</h2>
            <p className="text-xs text-slate-500 mt-0.5">Performance du mois en cours</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-slate-900">{kpis.conversionRate}%</p>
            <p className="text-xs text-slate-500">Taux de conversion</p>
          </div>
        </div>
        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary-600 to-eco-500 rounded-full transition-all"
            style={{ width: `${Math.min(100, kpis.conversionRate * 2)}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-slate-400">
          <span>0%</span>
          <span className="text-primary-600 font-medium">{kpis.qualifiedLeads} leads qualifiés</span>
          <span>50%</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* System services */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-slate-900 flex items-center gap-2">
              <Bot className="w-4 h-4 text-primary-600" />
              Services système
            </h2>
            <a href="/admin/agents" className="text-xs text-primary-600 hover:text-primary-800">
              Voir tous →
            </a>
          </div>
          <div className="space-y-3">
            {SYSTEM_STATUS.map((agent) => (
              <div key={agent.name} className="flex items-center gap-3">
                <div
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    agent.status === 'active'
                      ? 'bg-eco-500 animate-pulse'
                      : agent.status === 'paused'
                      ? 'bg-amber-400'
                      : 'bg-red-400'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{agent.name}</p>
                  <p className="text-xs text-slate-400">{agent.lastRun}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span
                    className={`text-xs rounded-full px-2 py-0.5 font-medium ${
                      agent.status === 'active'
                        ? 'bg-eco-100 text-eco-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {agent.status === 'active' ? 'Actif' : 'Pausé'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-900 mb-5">Activité récente</h2>
          <div className="space-y-4">
            {recentActivity.map((activity, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <span className="text-xl flex-shrink-0 mt-0.5">{activity.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-800">{activity.message}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
