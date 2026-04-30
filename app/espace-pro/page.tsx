import { ArrowUp, ArrowDown, TrendingUp, Users, Euro, Star } from 'lucide-react'

const STATS = [
  {
    label: 'Leads ce mois',
    value: '24',
    change: '+18%',
    trend: 'up',
    icon: <Users className="w-4 h-4" />,
    color: 'text-primary-600 bg-primary-50',
  },
  {
    label: 'CA généré',
    value: '48 200€',
    change: '+32%',
    trend: 'up',
    icon: <Euro className="w-4 h-4" />,
    color: 'text-eco-600 bg-eco-50',
  },
  {
    label: 'Taux de conversion',
    value: '38%',
    change: '+5pts',
    trend: 'up',
    icon: <TrendingUp className="w-4 h-4" />,
    color: 'text-accent-600 bg-accent-50',
  },
  {
    label: 'Note moyenne',
    value: '4.8',
    change: '+0.1',
    trend: 'up',
    icon: <Star className="w-4 h-4" />,
    color: 'text-purple-600 bg-purple-50',
  },
]

const RECENT_LEADS = [
  {
    id: 'L001',
    name: 'Jean Dupont',
    city: 'Paris 16e',
    project: 'Isolation combles + PAC',
    budget: '15 000€',
    status: 'new',
    date: 'Il y a 2h',
  },
  {
    id: 'L002',
    name: 'Marie Martin',
    city: 'Versailles',
    project: 'Panneaux solaires 6kWc',
    budget: '12 000€',
    status: 'contacted',
    date: 'Il y a 5h',
  },
  {
    id: 'L003',
    name: 'Pierre Bernard',
    city: 'Boulogne-Billancourt',
    project: 'VMC double flux',
    budget: '5 500€',
    status: 'devis_sent',
    date: 'Hier',
  },
  {
    id: 'L004',
    name: 'Sophie Laurent',
    city: 'Saint-Denis',
    project: 'Isolation murs extérieur',
    budget: '18 000€',
    status: 'won',
    date: '2 jours',
  },
]

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  new: { label: 'Nouveau', color: 'bg-primary-100 text-primary-700' },
  contacted: { label: 'Contacté', color: 'bg-amber-100 text-amber-700' },
  devis_sent: { label: 'Devis envoyé', color: 'bg-purple-100 text-purple-700' },
  won: { label: 'Gagné', color: 'bg-eco-100 text-eco-700' },
  lost: { label: 'Perdu', color: 'bg-red-100 text-red-700' },
}

export default function EspaceProDashboard() {
  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Tableau de bord</h1>
        <p className="text-slate-500 mt-1">ThermoConfort Paris — Avril 2024</p>
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
            {RECENT_LEADS.map((lead) => {
              const statusConf = STATUS_CONFIG[lead.status]
              return (
                <div
                  key={lead.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-xs font-bold text-primary-700 flex-shrink-0">
                    {lead.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {lead.name}
                      </p>
                      <span className="text-xs text-slate-400">—</span>
                      <p className="text-xs text-slate-400 truncate">{lead.city}</p>
                    </div>
                    <p className="text-xs text-slate-500 truncate">{lead.project}</p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <p className="text-sm font-semibold text-slate-900">{lead.budget}</p>
                    <span
                      className={`inline-block text-xs rounded-full px-2 py-0.5 font-medium mt-0.5 ${statusConf.color}`}
                    >
                      {statusConf.label}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 flex-shrink-0">{lead.date}</p>
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
                <span className="font-medium text-slate-900">24/20</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary-600 rounded-full" style={{ width: '100%' }} />
              </div>
            </div>
            <p className="text-xs text-amber-600 mt-2">
              Quota dépassé — Passez à Premium pour des leads illimités
            </p>
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
              <div className="text-3xl font-bold text-primary-700">82</div>
              <div className="text-xs text-slate-500">
                <p>Sur 100</p>
                <p className="text-eco-600 font-medium">Bon profil</p>
              </div>
            </div>
            <div className="space-y-2 text-xs">
              {[
                { label: 'Certifications', score: 100, done: true },
                { label: 'Photos galerie', score: 60, done: false },
                { label: 'Description', score: 80, done: false },
                { label: 'Avis clients', score: 90, done: true },
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
              { label: 'Voir les nouveaux leads', href: '/espace-pro/leads', badge: '7' },
              { label: 'Mettre à jour mon profil', href: '/espace-pro/profil' },
              { label: 'Ajouter des photos', href: '/espace-pro/profil#galerie' },
            ].map((action) => (
              <a
                key={action.label}
                href={action.href}
                className="flex items-center justify-between py-2 text-sm text-slate-700 hover:text-primary-700 transition-colors border-b border-slate-100 last:border-0"
              >
                <span>{action.label}</span>
                {action.badge && (
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
