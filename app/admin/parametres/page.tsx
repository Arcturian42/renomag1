import { Settings, Bell, Shield, Database, Zap, Globe } from 'lucide-react'

export default function AdminParametresPage() {
  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Paramètres</h1>
        <p className="text-slate-500 mt-1">Configuration globale de la plateforme RENOMAG.</p>
      </div>

      <div className="space-y-6">
        {/* Platform settings */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-5">
            <Globe className="w-5 h-5 text-primary-600" />
            <h2 className="font-semibold text-slate-900">Paramètres plateforme</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label" htmlFor="nom-de-la-plateforme">Nom de la plateforme</label>
              <input id="nom-de-la-plateforme" type="text" className="input-field" defaultValue="RENOMAG" />
            </div>
            <div>
              <label className="label" htmlFor="email-support">Email support</label>
              <input id="email-support" type="email" className="input-field" defaultValue="contact@renomag.fr" />
            </div>
            <div>
              <label className="label" htmlFor="nombre-max-de-devis-par-lead">Nombre max de devis par lead</label>
              <select id="nombre-max-de-devis-par-lead" className="input-field">
                <option>2</option>
                <option selected>3</option>
                <option>4</option>
                <option>5</option>
              </select>
            </div>
            <div>
              <label className="label" htmlFor="dlai-de-rponse-artisan-heures">Délai de réponse artisan (heures)</label>
              <input id="dlai-de-rponse-artisan-heures" type="number" className="input-field" defaultValue="48" />
            </div>
          </div>
          <div className="mt-4">
            <span className="label mb-2 block">Maintenance</span>
            <div className="flex items-center gap-3">
              <button className="relative inline-flex w-10 h-6 rounded-full bg-slate-200">
                <span className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow" />
              </button>
              <span className="text-sm text-slate-600">Mode maintenance désactivé</span>
            </div>
          </div>
          <div className="mt-5 flex justify-end">
            <button className="btn-primary px-5 py-2.5">Enregistrer</button>
          </div>
        </div>

        {/* Hermes agents config */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-5">
            <Zap className="w-5 h-5 text-primary-600" />
            <h2 className="font-semibold text-slate-900">Configuration agents Hermes</h2>
          </div>
          <div className="space-y-4">
            {[
              { name: 'Hermes-Scraper', desc: 'Scraping des annuaires artisans', enabled: true },
              { name: 'Hermes-Enrichment', desc: 'Enrichissement des données artisans', enabled: true },
              { name: 'Hermes-Content', desc: 'Génération de contenu blog', enabled: true },
              { name: 'Hermes-Outreach', desc: 'Prospection automatique artisans', enabled: false },
              { name: 'Hermes-Matching', desc: 'Algorithme de matching leads/artisans', enabled: true },
              { name: 'Hermes-Analytics', desc: 'Rapports et analytics automatiques', enabled: true },
            ].map((agent) => (
              <div key={agent.name} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{agent.name}</p>
                  <p className="text-xs text-slate-400">{agent.desc}</p>
                </div>
                <button
                  className={`relative inline-flex w-10 h-6 rounded-full transition-colors ${agent.enabled ? 'bg-primary-600' : 'bg-slate-200'}`}
                >
                  <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${agent.enabled ? 'translate-x-5' : 'translate-x-1'}`} />
                </button>
              </div>
            ))}
          </div>
          <div className="mt-5 flex justify-end">
            <button className="btn-primary px-5 py-2.5">Enregistrer</button>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-5">
            <Bell className="w-5 h-5 text-primary-600" />
            <h2 className="font-semibold text-slate-900">Alertes administrateur</h2>
          </div>
          <div className="space-y-4">
            {[
              { label: 'Certification RGE expirée', desc: 'Alerte email immédiate', enabled: true },
              { label: 'Artisan suspendu automatiquement', desc: 'Email + Slack', enabled: true },
              { label: 'Rapport quotidien', desc: 'Email à 8h chaque matin', enabled: true },
              { label: 'Anomalie agent Hermes', desc: 'SMS + Email', enabled: true },
              { label: 'Nouveau lead sans match', desc: 'Email dans les 30 min', enabled: false },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                <div>
                  <p className="text-sm font-medium text-slate-900">{item.label}</p>
                  <p className="text-xs text-slate-400">{item.desc}</p>
                </div>
                <button
                  className={`relative inline-flex w-10 h-6 rounded-full transition-colors ${item.enabled ? 'bg-primary-600' : 'bg-slate-200'}`}
                >
                  <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${item.enabled ? 'translate-x-5' : 'translate-x-1'}`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Security */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-5">
            <Shield className="w-5 h-5 text-primary-600" />
            <h2 className="font-semibold text-slate-900">Sécurité</h2>
          </div>
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label" htmlFor="email-administrateur">Email administrateur</label>
              <input id="email-administrateur" type="email" className="input-field" defaultValue="admin@renomag.fr" />
              </div>
              <div>
                <label className="label" htmlFor="authentification-2fa">Authentification 2FA</label>
              <select id="authentification-2fa" className="input-field">
                  <option>Activé (recommandé)</option>
                  <option>Désactivé</option>
                </select>
              </div>
            </div>
            <div>
              <label className="label" htmlFor="ips-autorises-pour-ladmin-une-">IPs autorisées pour l'admin (une par ligne)</label>
              <textarea id="ips-autorises-pour-ladmin-une-" className="input-field h-20 resize-none" defaultValue="0.0.0.0/0" />
            </div>
          </div>
          <div className="mt-5 flex justify-end">
            <button className="btn-primary px-5 py-2.5">Enregistrer</button>
          </div>
        </div>

        {/* Database */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-5">
            <Database className="w-5 h-5 text-primary-600" />
            <h2 className="font-semibold text-slate-900">Maintenance base de données</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            <button className="text-sm font-medium text-slate-700 border border-slate-200 rounded-lg px-4 py-2.5 hover:bg-slate-50 transition-colors">
              Exporter les données
            </button>
            <button className="text-sm font-medium text-slate-700 border border-slate-200 rounded-lg px-4 py-2.5 hover:bg-slate-50 transition-colors">
              Vider le cache
            </button>
            <button className="text-sm font-medium text-amber-700 border border-amber-200 rounded-lg px-4 py-2.5 hover:bg-amber-50 transition-colors">
              Logs système
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
