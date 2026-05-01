export const dynamic = 'force-dynamic'
import { Bot, Play, Pause, RefreshCw, BarChart3, Clock, CheckCircle, AlertCircle } from 'lucide-react'

const AGENTS = [
  {
    id: 'hermes-01',
    name: 'Hermes-Scraper',
    description: 'Scraping des annuaires artisans et mises à jour certifications RGE',
    status: 'active',
    lastRun: 'Il y a 2 min',
    nextRun: 'Dans 28 min',
    tasksCompleted: 48230,
    tasksPending: 342,
    successRate: 98.2,
    avgRuntime: '12 min',
    category: 'Data',
  },
  {
    id: 'hermes-02',
    name: 'Hermes-Enrichment',
    description: 'Enrichissement des profils artisans (avis, certifications, contacts)',
    status: 'active',
    lastRun: 'Il y a 5 min',
    nextRun: 'Dans 55 min',
    tasksCompleted: 22100,
    tasksPending: 127,
    successRate: 96.8,
    avgRuntime: '8 min',
    category: 'Data',
  },
  {
    id: 'hermes-03',
    name: 'Hermes-Content',
    description: 'Production automatique d\'articles de blog et guides SEO',
    status: 'active',
    lastRun: 'Il y a 12 min',
    nextRun: 'Dans 3h',
    tasksCompleted: 892,
    tasksPending: 89,
    successRate: 99.1,
    avgRuntime: '4 min',
    category: 'Contenu',
  },
  {
    id: 'hermes-04',
    name: 'Hermes-SEO',
    description: 'Optimisation SEO des pages, meta tags et structure de liens',
    status: 'active',
    lastRun: 'Il y a 20 min',
    nextRun: 'Dans 4h',
    tasksCompleted: 5420,
    tasksPending: 56,
    successRate: 99.7,
    avgRuntime: '3 min',
    category: 'SEO',
  },
  {
    id: 'hermes-05',
    name: 'Hermes-Outreach',
    description: 'Campagnes email automatiques pour l\'acquisition d\'artisans',
    status: 'paused',
    lastRun: 'Il y a 1h',
    nextRun: 'Manuel',
    tasksCompleted: 3400,
    tasksPending: 45,
    successRate: 94.2,
    avgRuntime: '25 min',
    category: 'Outreach',
  },
  {
    id: 'hermes-06',
    name: 'Hermes-Matching',
    description: 'Algorithme de matching leads-artisans en temps réel',
    status: 'active',
    lastRun: 'Il y a 1 min',
    nextRun: 'Continu',
    tasksCompleted: 102300,
    tasksPending: 234,
    successRate: 99.9,
    avgRuntime: '<1 min',
    category: 'Core',
  },
  {
    id: 'hermes-07',
    name: 'Hermes-Analytics',
    description: 'Collecte et agrégation des métriques de performance',
    status: 'active',
    lastRun: 'Il y a 8 min',
    nextRun: 'Dans 22 min',
    tasksCompleted: 89400,
    tasksPending: 67,
    successRate: 99.5,
    avgRuntime: '2 min',
    category: 'Analytics',
  },
  {
    id: 'hermes-08',
    name: 'Hermes-LeadScore',
    description: 'Scoring et qualification automatique des leads entrants',
    status: 'active',
    lastRun: 'Il y a 3 min',
    nextRun: 'Continu',
    tasksCompleted: 45200,
    tasksPending: 189,
    successRate: 97.8,
    avgRuntime: '<1 min',
    category: 'Core',
  },
]

const CATEGORY_COLORS: Record<string, string> = {
  Data: 'bg-primary-100 text-primary-700',
  Contenu: 'bg-eco-100 text-eco-700',
  SEO: 'bg-purple-100 text-purple-700',
  Outreach: 'bg-amber-100 text-amber-700',
  Core: 'bg-rose-100 text-rose-700',
  Analytics: 'bg-teal-100 text-teal-700',
}

export default function AgentsPage() {
  const activeCount = AGENTS.filter((a) => a.status === 'active').length
  const totalTasks = AGENTS.reduce((acc, a) => acc + a.tasksCompleted, 0)

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Bot className="w-6 h-6 text-primary-600" />
            Agents Hermes
          </h1>
          <p className="text-slate-500 mt-1">
            Système autonome de 23 agents — {activeCount} actifs en ce moment
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-eco-50 border border-eco-200 rounded-full px-3 py-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-eco-500 animate-pulse" />
            <span className="text-xs font-medium text-eco-700">{activeCount}/23 actifs</span>
          </div>
          <button className="btn-secondary text-xs py-2">
            <RefreshCw className="w-3.5 h-3.5" />
            Actualiser
          </button>
        </div>
      </div>

      {/* System stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: 'Tâches totales',
            value: totalTasks.toLocaleString('fr-FR'),
            icon: <CheckCircle className="w-4 h-4" />,
            color: 'text-eco-600 bg-eco-50',
          },
          {
            label: 'Agents actifs',
            value: `${activeCount}/23`,
            icon: <Bot className="w-4 h-4" />,
            color: 'text-primary-600 bg-primary-50',
          },
          {
            label: 'Taux de succès',
            value: '98.4%',
            icon: <BarChart3 className="w-4 h-4" />,
            color: 'text-accent-600 bg-accent-50',
          },
          {
            label: 'Intervention manuelle',
            value: '<1%',
            icon: <AlertCircle className="w-4 h-4" />,
            color: 'text-purple-600 bg-purple-50',
          },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-4">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${stat.color} mb-3`}>
              {stat.icon}
            </div>
            <div className="text-xl font-bold text-slate-900">{stat.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Agents grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {AGENTS.map((agent) => (
          <div
            key={agent.id}
            className={`bg-white rounded-xl border p-5 ${
              agent.status === 'active' ? 'border-slate-200' : 'border-amber-200 bg-amber-50/30'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    agent.status === 'active' ? 'bg-eco-100' : 'bg-amber-100'
                  }`}
                >
                  <Bot
                    className={`w-4 h-4 ${
                      agent.status === 'active' ? 'text-eco-700' : 'text-amber-700'
                    }`}
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm">{agent.name}</h3>
                  <span className={`text-xs rounded-full px-2 py-0.5 font-medium ${CATEGORY_COLORS[agent.category]}`}>
                    {agent.category}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    agent.status === 'active' ? 'bg-eco-500 animate-pulse' : 'bg-amber-400'
                  }`}
                />
                <span
                  className={`text-xs font-medium ${
                    agent.status === 'active' ? 'text-eco-700' : 'text-amber-700'
                  }`}
                >
                  {agent.status === 'active' ? 'Actif' : 'Pausé'}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-500 mb-4 leading-relaxed">{agent.description}</p>

            <div className="grid grid-cols-3 gap-3 mb-4 text-xs">
              <div>
                <p className="text-slate-400 mb-0.5">Tâches complétées</p>
                <p className="font-semibold text-slate-900">
                  {agent.tasksCompleted.toLocaleString('fr-FR')}
                </p>
              </div>
              <div>
                <p className="text-slate-400 mb-0.5">En attente</p>
                <p className="font-semibold text-slate-900">{agent.tasksPending}</p>
              </div>
              <div>
                <p className="text-slate-400 mb-0.5">Taux succès</p>
                <p className="font-semibold text-eco-600">{agent.successRate}%</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <div className="text-xs text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {agent.lastRun} · Prochain : {agent.nextRun}
              </div>
              <div className="flex items-center gap-2">
                <button className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                  <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                </button>
                {agent.status === 'active' ? (
                  <button className="flex items-center gap-1 text-xs text-amber-700 hover:bg-amber-50 rounded-lg px-2 py-1.5 transition-colors">
                    <Pause className="w-3 h-3" />
                    Pausé
                  </button>
                ) : (
                  <button className="flex items-center gap-1 text-xs text-eco-700 hover:bg-eco-50 rounded-lg px-2 py-1.5 transition-colors">
                    <Play className="w-3 h-3" />
                    Démarrer
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
