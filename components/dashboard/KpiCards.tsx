'use client'

import { TrendingUp, Users, Target, Zap, ArrowUpRight, ArrowDownRight } from 'lucide-react'

type KpiCardsProps = {
  kpis: {
    totalLeads: number
    newLeadsThisWeek: number
    conversionRate: string
    qualifiedLeads: number
    activeUsers: number
    totalUsers: number
    totalArtisans: number
  }
}

export default function KpiCards({ kpis }: KpiCardsProps) {
  const cards = [
    {
      label: 'Leads totaux',
      value: kpis.totalLeads.toLocaleString('fr-FR'),
      change: '+12% vs mois dernier',
      trend: 'up' as const,
      icon: TrendingUp,
      color: 'bg-primary-50 text-primary-700',
      border: 'border-primary-200',
    },
    {
      label: 'Nouveaux leads cette semaine',
      value: kpis.newLeadsThisWeek.toString(),
      change: '+8% vs semaine dernière',
      trend: 'up' as const,
      icon: Zap,
      color: 'bg-accent-50 text-accent-700',
      border: 'border-accent-200',
    },
    {
      label: 'Taux de conversion',
      value: `${kpis.conversionRate}%`,
      change: '+2.3% vs mois dernier',
      trend: 'up' as const,
      icon: Target,
      color: 'bg-eco-50 text-eco-700',
      border: 'border-eco-200',
    },
    {
      label: 'Leads qualifiés',
      value: kpis.qualifiedLeads.toLocaleString('fr-FR'),
      change: '+5% vs mois dernier',
      trend: 'up' as const,
      icon: Target,
      color: 'bg-purple-50 text-purple-700',
      border: 'border-purple-200',
    },
    {
      label: 'Utilisateurs actifs',
      value: kpis.activeUsers.toLocaleString('fr-FR'),
      change: `${kpis.totalUsers} inscrits au total`,
      trend: 'up' as const,
      icon: Users,
      color: 'bg-blue-50 text-blue-700',
      border: 'border-blue-200',
    },
    {
      label: 'Artisans inscrits',
      value: kpis.totalArtisans.toLocaleString('fr-FR'),
      change: '+15 ce mois',
      trend: 'up' as const,
      icon: Users,
      color: 'bg-teal-50 text-teal-700',
      border: 'border-teal-200',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <div
            key={card.label}
            className={`bg-white rounded-xl border ${card.border} p-5 shadow-sm hover:shadow-md transition-shadow`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${card.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              {card.trend === 'up' ? (
                <ArrowUpRight className="w-4 h-4 text-eco-500" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-red-500" />
              )}
            </div>
            <div className="text-2xl font-bold text-slate-900">{card.value}</div>
            <div className="text-sm text-slate-500 mt-0.5">{card.label}</div>
            <div className="text-xs text-slate-400 font-medium mt-1">{card.change}</div>
          </div>
        )
      })}
    </div>
  )
}
