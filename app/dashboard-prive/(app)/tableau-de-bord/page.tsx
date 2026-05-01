import { getUsers, getLeads, getKpis } from '@/lib/data/dashboard'
import KpiCards from '@/components/dashboard/KpiCards'
import {
  TrendingUp,
  Users,
  Target,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'

export default async function TableauDeBordPage() {
  const [users, leads] = await Promise.all([getUsers(), getLeads()])
  const kpis = getKpis(users, leads)

  const recentLeads = [...leads]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8)

  const recentUsers = [...users]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">Tableau de bord</h1>
          <p className="text-slate-500 mt-1">Vue d&apos;ensemble de vos performances</p>
        </div>
        <div className="flex items-center gap-1.5 bg-eco-50 border border-eco-200 rounded-full px-3 py-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-eco-500 animate-pulse" />
          <span className="text-xs font-medium text-eco-700">Données temps réel</span>
        </div>
      </div>

      {/* KPIs */}
      <KpiCards kpis={kpis} />

      {/* Recent activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary-600" />
              Derniers leads
            </h2>
            <a href="/dashboard-prive/leads" className="text-xs text-primary-600 hover:text-primary-800">
              Voir tous →
            </a>
          </div>
          <div className="space-y-3">
            {recentLeads.map((lead) => (
              <div key={lead.id} className="flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center text-xs font-bold text-primary-700">
                  {lead.firstName[0]}{lead.lastName[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {lead.firstName} {lead.lastName}
                  </p>
                  <p className="text-xs text-slate-400">{lead.projectType} — {lead.city}</p>
                </div>
                <span
                  className={`text-xs rounded-full px-2 py-0.5 font-medium ${
                    lead.status === 'NEW'
                      ? 'bg-blue-100 text-blue-700'
                      : lead.status === 'QUALIFIED'
                      ? 'bg-eco-100 text-eco-700'
                      : lead.status === 'CONVERTED'
                      ? 'bg-primary-100 text-primary-700'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {lead.status === 'NEW' && 'Nouveau'}
                  {lead.status === 'CONTACTED' && 'Contacté'}
                  {lead.status === 'QUALIFIED' && 'Qualifié'}
                  {lead.status === 'CONVERTED' && 'Converti'}
                  {lead.status === 'REJECTED' && 'Rejeté'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-primary-600" />
              Derniers inscrits
            </h2>
            <a href="/dashboard-prive/utilisateurs" className="text-xs text-primary-600 hover:text-primary-800">
              Voir tous →
            </a>
          </div>
          <div className="space-y-3">
            {recentUsers.map((user) => (
              <div key={user.id} className="flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent-50 flex items-center justify-center text-xs font-bold text-accent-700">
                  {user.profile?.firstName?.[0] || 'U'}{user.profile?.lastName?.[0] || ''}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {user.profile?.firstName || ''} {user.profile?.lastName || ''}
                  </p>
                  <p className="text-xs text-slate-400">{user.email}</p>
                </div>
                <span
                  className={`text-xs rounded-full px-2 py-0.5 font-medium ${
                    user.status === 'active'
                      ? 'bg-eco-100 text-eco-700'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {user.status === 'active' ? 'Actif' : 'Inactif'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500">Taux de qualification</span>
            <ArrowUpRight className="w-4 h-4 text-eco-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {((kpis.qualifiedLeads / Math.max(kpis.totalLeads, 1)) * 100).toFixed(1)}%
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500">Moyenne score lead</span>
            <Target className="w-4 h-4 text-primary-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {Math.round(leads.reduce((sum, l) => sum + (l.score || 0), 0) / Math.max(leads.length, 1))}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500">Leads / utilisateur</span>
            <Users className="w-4 h-4 text-accent-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {(kpis.totalLeads / Math.max(kpis.totalUsers, 1)).toFixed(1)}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500">Rejets</span>
            <ArrowDownRight className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {leads.filter((l) => l.status === 'REJECTED').length}
          </div>
        </div>
      </div>
    </div>
  )
}
