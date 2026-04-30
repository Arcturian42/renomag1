import Link from 'next/link'
import {
  ClipboardList,
  Users,
  TrendingDown,
  FileCheck,
  ArrowRight,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react'

const PROJECT_STATUS = [
  { label: 'Devis reçus', value: 3, icon: <FileCheck className="w-4 h-4" />, color: 'text-primary-600 bg-primary-50' },
  { label: 'Artisans matchés', value: 3, icon: <Users className="w-4 h-4" />, color: 'text-eco-600 bg-eco-50' },
  { label: 'Économies estimées', value: '3 200€', icon: <TrendingDown className="w-4 h-4" />, color: 'text-accent-600 bg-accent-50' },
  { label: 'Aides calculées', value: '2 800€', icon: <CheckCircle className="w-4 h-4" />, color: 'text-purple-600 bg-purple-50' },
]

const TIMELINE = [
  {
    status: 'done',
    title: 'Demande de devis envoyée',
    date: '15 avril 2024',
    detail: 'Isolation combles + pompe à chaleur',
  },
  {
    status: 'done',
    title: '3 artisans sélectionnés',
    date: '15 avril 2024',
    detail: 'ThermoConfort Paris, Éco-Rénov Lyon, Nord Isolation',
  },
  {
    status: 'current',
    title: 'Devis en cours de réception',
    date: 'En cours',
    detail: '2/3 devis reçus — en attente de ThermoConfort Paris',
  },
  {
    status: 'pending',
    title: 'Choix de l\'artisan',
    date: 'À faire',
    detail: 'Comparer et choisir votre artisan',
  },
  {
    status: 'pending',
    title: 'Dépôt du dossier MaPrimeRénov\'',
    date: 'À venir',
    detail: 'Avant le début des travaux',
  },
  {
    status: 'pending',
    title: 'Réalisation des travaux',
    date: 'À venir',
    detail: 'Durée estimée : 3-5 jours',
  },
]

export default function EspaceProprietaireDashboard() {
  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Bonjour, Jean 👋</h1>
        <p className="text-slate-500 mt-1">
          Votre projet de rénovation est en cours — 2 devis reçus sur 3
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {PROJECT_STATUS.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-4">
            <div className={`inline-flex items-center justify-center w-8 h-8 rounded-lg ${stat.color} mb-3`}>
              {stat.icon}
            </div>
            <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Project timeline */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-slate-900">Suivi de mon projet</h2>
            <Link
              href="/espace-proprietaire/mon-projet"
              className="text-xs text-primary-600 hover:text-primary-800 flex items-center gap-1"
            >
              Détails <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-4">
            {TIMELINE.map((item, idx) => (
              <div key={idx} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                      item.status === 'done'
                        ? 'bg-eco-500'
                        : item.status === 'current'
                        ? 'bg-primary-600 ring-4 ring-primary-100'
                        : 'bg-slate-200'
                    }`}
                  >
                    {item.status === 'done' ? (
                      <CheckCircle className="w-3 h-3 text-white" />
                    ) : item.status === 'current' ? (
                      <Clock className="w-3 h-3 text-white" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-slate-400" />
                    )}
                  </div>
                  {idx < TIMELINE.length - 1 && (
                    <div
                      className={`w-px flex-1 mt-1 ${
                        item.status === 'done' ? 'bg-eco-300' : 'bg-slate-200'
                      }`}
                      style={{ minHeight: '12px' }}
                    />
                  )}
                </div>
                <div className="pb-4">
                  <p
                    className={`text-sm font-medium ${
                      item.status === 'pending' ? 'text-slate-400' : 'text-slate-900'
                    }`}
                  >
                    {item.title}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">{item.date}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Devis received */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-slate-900">Devis reçus</h2>
              <Link
                href="/espace-proprietaire/artisans"
                className="text-xs text-primary-600 hover:text-primary-800 flex items-center gap-1"
              >
                Voir tous <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-3">
              {[
                {
                  company: 'Éco-Rénov Lyon',
                  amount: '12 400€',
                  subsidy: '4 800€',
                  status: 'received',
                  date: '16 avr.',
                },
                {
                  company: 'Nord Isolation',
                  amount: '11 800€',
                  subsidy: '4 600€',
                  status: 'received',
                  date: '16 avr.',
                },
                {
                  company: 'ThermoConfort Paris',
                  amount: '—',
                  subsidy: '—',
                  status: 'pending',
                  date: 'Attendu ce soir',
                },
              ].map((devis) => (
                <div
                  key={devis.company}
                  className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-900">{devis.company}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{devis.date}</p>
                  </div>
                  {devis.status === 'received' ? (
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-900">{devis.amount}</p>
                      <p className="text-xs text-eco-600">-{devis.subsidy} aides</p>
                    </div>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-amber-600">
                      <Clock className="w-3 h-3" />
                      En attente
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Alert */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-800">Action requise</p>
              <p className="text-xs text-amber-700 mt-0.5">
                Déposez votre dossier MaPrimeRénov' avant de commencer les travaux. Votre
                artisan peut vous aider.
              </p>
              <Link
                href="/aides"
                className="text-xs font-medium text-amber-700 hover:text-amber-900 mt-1.5 inline-flex items-center gap-1"
              >
                En savoir plus <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Quick actions */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Actions rapides</h3>
            <div className="space-y-2">
              {[
                { label: 'Comparer les devis', href: '/espace-proprietaire/artisans', icon: '📋' },
                { label: 'Simuler mes aides', href: '/devis#simulateur', icon: '🧮' },
                { label: 'Contacter un artisan', href: '/espace-proprietaire/messages', icon: '💬' },
              ].map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <span>{action.icon}</span>
                  <span className="text-sm text-slate-700">{action.label}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 ml-auto" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
