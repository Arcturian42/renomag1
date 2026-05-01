import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { ArrowUp, ArrowDown, TrendingUp, Users, Euro, Star } from 'lucide-react'

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  new: { label: 'Nouveau', color: 'bg-primary-100 text-primary-700' },
  contacted: { label: 'Contacté', color: 'bg-amber-100 text-amber-700' },
  devis_sent: { label: 'Devis envoyé', color: 'bg-purple-100 text-purple-700' },
  won: { label: 'Gagné', color: 'bg-eco-100 text-eco-700' },
  lost: { label: 'Perdu', color: 'bg-red-100 text-red-700' },
}

export default async function EspaceProDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/connexion')
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: { artisan: { include: { reviews: true, subscription: true } }, profile: true },
  })

  if (!dbUser || dbUser.role !== 'ARTISAN') {
    redirect('/espace-proprietaire')
  }

  const artisan = dbUser.artisan
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const leads = artisan
    ? await prisma.lead.findMany({
        where: { artisanId: artisan.id },
        orderBy: { createdAt: 'desc' },
      })
    : []

  const leadsThisMonth = leads.filter((l) => new Date(l.createdAt) >= startOfMonth)
  const convertedLeads = leads.filter((l) => l.status === 'CONVERTED')
  const conversionRate = leads.length > 0 ? Math.round((convertedLeads.length / leads.length) * 100) : 0

  const reviews = artisan?.reviews || []
  const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : '—'

  const unreadMessages = await prisma.message.count({
    where: { receiverId: user.id, read: false },
  })

  const newLeadsCount = leads.filter((l) => l.status === 'NEW').length

  const displayName = artisan?.name || dbUser.profile?.firstName || user.email?.split('@')[0] || 'Artisan'

  const STATS = [
    {
      label: 'Leads ce mois',
      value: String(leadsThisMonth.length),
      change: '+0%',
      trend: 'up',
      icon: <Users className="w-4 h-4" />,
      color: 'text-primary-600 bg-primary-50',
    },
    {
      label: 'CA généré',
      value: `${convertedLeads.length * 12000}€`,
      change: '+0%',
      trend: 'up',
      icon: <Euro className="w-4 h-4" />,
      color: 'text-eco-600 bg-eco-50',
    },
    {
      label: 'Taux de conversion',
      value: `${conversionRate}%`,
      change: '+0pts',
      trend: 'up',
      icon: <TrendingUp className="w-4 h-4" />,
      color: 'text-accent-600 bg-accent-50',
    },
    {
      label: 'Note moyenne',
      value: avgRating,
      change: '+0',
      trend: 'up',
      icon: <Star className="w-4 h-4" />,
      color: 'text-purple-600 bg-purple-50',
    },
  ]

  const recentLeads = leads.slice(0, 4)

  // Profile score based on completion
  const scoreFields = [
    !!artisan?.name,
    !!artisan?.description && artisan.description.length > 50,
    !!artisan?.phone,
    !!artisan?.website,
    reviews.length > 0,
  ]
  const profileScore = Math.round((scoreFields.filter(Boolean).length / scoreFields.length) * 100)

  const quotaUsed = leadsThisMonth.length
  const quotaMax = artisan?.subscription?.plan?.toLowerCase().includes('premium') ? 999 : 20
  const overQuota = quotaUsed > quotaMax && quotaMax !== 999

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Tableau de bord</h1>
        <p className="text-slate-500 mt-1">{artisan?.name || displayName} — {now.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STATS.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${stat.color}`}>
                {stat.icon}
              </div>
              <span
                className={`flex items-center gap-0.5 text-xs font-medium ${
                  stat.trend === 'up' ? 'text-eco-600' : 'text-red-500'
                }`}
              >
                {stat.trend === 'up' ? (
                  <ArrowUp className="w-3 h-3" />
                ) : (
                  <ArrowDown className="w-3 h-3" />
                )}
                {stat.change}
              </span>
            </div>
            <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent leads */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-slate-900">Derniers leads</h2>
            <a
              href="/espace-pro/leads"
              className="text-xs text-primary-600 hover:text-primary-800 font-medium"
            >
              Voir tous →
            </a>
          </div>
          <div className="space-y-3">
            {recentLeads.length === 0 && (
              <p className="text-sm text-slate-500">Aucun lead pour le moment.</p>
            )}
            {recentLeads.map((lead) => {
              const statusKey = lead.status === 'NEW' ? 'new' : lead.status === 'CONTACTED' ? 'contacted' : lead.status === 'QUALIFIED' ? 'devis_sent' : lead.status === 'CONVERTED' ? 'won' : 'lost'
              const statusConf = STATUS_CONFIG[statusKey]
              return (
                <div
                  key={lead.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-xs font-bold text-primary-700 flex-shrink-0">
                    {lead.firstName[0]}{lead.lastName[0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {lead.firstName} {lead.lastName}
                      </p>
                      <span className="text-xs text-slate-400">—</span>
                      <p className="text-xs text-slate-400 truncate">{lead.department}</p>
                    </div>
                    <p className="text-xs text-slate-500 truncate">{lead.projectType}</p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <p className="text-sm font-semibold text-slate-900">{lead.budget || '—'}</p>
                    <span
                      className={`inline-block text-xs rounded-full px-2 py-0.5 font-medium mt-0.5 ${statusConf.color}`}
                    >
                      {statusConf.label}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 flex-shrink-0">
                    {new Date(lead.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Monthly quota */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Quota mensuel</h3>
            <div className="mb-2">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-600">Leads utilisés</span>
                <span className="font-medium text-slate-900">{quotaUsed}/{quotaMax === 999 ? '∞' : quotaMax}</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary-600 rounded-full" style={{ width: `${Math.min((quotaUsed / (quotaMax === 999 ? Math.max(quotaUsed, 1) : quotaMax)) * 100, 100)}%` }} />
              </div>
            </div>
            {overQuota && (
              <p className="text-xs text-amber-600 mt-2">
                Quota dépassé — Passez à Premium pour des leads illimités
              </p>
            )}
            <a
              href="/espace-pro/abonnement"
              className="mt-3 block text-center text-xs font-semibold bg-accent-500 hover:bg-accent-600 text-white rounded-lg px-4 py-2 transition-colors"
            >
              Passer à Premium
            </a>
          </div>

          {/* Profile score */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Score de profil</h3>
            <div className="flex items-center gap-3 mb-3">
              <div className="text-3xl font-bold text-primary-700">{profileScore}</div>
              <div className="text-xs text-slate-500">
                <p>Sur 100</p>
                <p className="text-eco-600 font-medium">{profileScore >= 80 ? 'Excellent' : profileScore >= 50 ? 'Bon profil' : 'À compléter'}</p>
              </div>
            </div>
            <div className="space-y-2 text-xs">
              {[
                { label: 'Identité entreprise', score: artisan?.name ? 100 : 0, done: !!artisan?.name },
                { label: 'Description', score: artisan?.description && artisan.description.length > 50 ? 100 : 40, done: !!(artisan?.description && artisan.description.length > 50) },
                { label: 'Contact', score: artisan?.phone ? 100 : 0, done: !!artisan?.phone },
                { label: 'Avis clients', score: reviews.length > 0 ? 100 : 0, done: reviews.length > 0 },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-slate-600 mb-0.5">
                    <span>{item.label}</span>
                    <span>{item.score}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.done ? 'bg-eco-500' : 'bg-primary-400'}`}
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Actions rapides</h3>
            {[
              { label: 'Voir les nouveaux leads', href: '/espace-pro/leads', badge: String(newLeadsCount) },
              { label: 'Mettre à jour mon profil', href: '/espace-pro/profil' },
              { label: 'Ajouter des photos', href: '/espace-pro/profil#galerie' },
            ].map((action) => (
              <a
                key={action.label}
                href={action.href}
                className="flex items-center justify-between py-2 text-sm text-slate-700 hover:text-primary-700 transition-colors border-b border-slate-100 last:border-0"
              >
                <span>{action.label}</span>
                {action.badge && Number(action.badge) > 0 && (
                  <span className="text-xs font-bold bg-accent-500 text-white rounded-full px-1.5 py-0.5">
                    {action.badge}
                  </span>
                )}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
