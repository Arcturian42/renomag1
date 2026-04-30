import { TrendingUp, Euro, Users, Star, ArrowUp } from 'lucide-react'

const MONTHLY_DATA = [
  { month: 'Nov', leads: 12, ca: 22000, conversion: 30 },
  { month: 'Déc', leads: 15, ca: 28000, conversion: 33 },
  { month: 'Jan', leads: 18, ca: 34000, conversion: 35 },
  { month: 'Fév', leads: 16, ca: 30000, conversion: 31 },
  { month: 'Mar', leads: 20, ca: 38000, conversion: 36 },
  { month: 'Avr', leads: 24, ca: 48200, conversion: 38 },
]

const TOP_PROJECTS = [
  { type: 'Pompe à chaleur air/eau', count: 8, ca: '18 400€', avg: '2 300€' },
  { type: 'Isolation combles', count: 6, ca: '12 000€', avg: '2 000€' },
  { type: 'Panneaux solaires', count: 5, ca: '10 500€', avg: '2 100€' },
  { type: 'VMC double flux', count: 3, ca: '5 100€', avg: '1 700€' },
  { type: 'Isolation murs ext.', count: 2, ca: '4 200€', avg: '2 100€' },
]

export default function EspaceProAnalyticsPage() {
  const maxLeads = Math.max(...MONTHLY_DATA.map((d) => d.leads))

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
        <p className="text-slate-500 mt-1">Performance de votre activité sur RENOMAG</p>
      </div>

      {/* Period selector */}
      <div className="flex items-center gap-2 mb-8">
        {['7 jours', '30 jours', '3 mois', '6 mois', '12 mois'].map((period) => (
          <button
            key={period}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              period === '6 mois'
                ? 'bg-primary-600 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {period}
          </button>
        ))}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Leads total', value: '105', change: '+23%', icon: Users, color: 'text-primary-600 bg-primary-50' },
          { label: 'CA généré', value: '200 700€', change: '+31%', icon: Euro, color: 'text-eco-600 bg-eco-50' },
          { label: 'Taux conversion', value: '34%', change: '+4pts', icon: TrendingUp, color: 'text-accent-600 bg-accent-50' },
          { label: 'Note moyenne', value: '4.8/5', change: '+0.1', icon: Star, color: 'text-purple-600 bg-purple-50' },
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
                        style={{ width: `${(project.count / 8) * 100}%` }}
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
            {[
              { label: 'Leads reçus', value: 105, pct: 100, color: 'bg-primary-500' },
              { label: 'Contactés', value: 89, pct: 85, color: 'bg-primary-400' },
              { label: 'Devis envoyés', value: 62, pct: 59, color: 'bg-eco-500' },
              { label: 'Projets gagnés', value: 36, pct: 34, color: 'bg-eco-600' },
            ].map((step) => (
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
