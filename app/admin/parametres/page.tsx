export const dynamic = 'force-dynamic'

import { Settings, Bell, Shield, Database, Globe } from 'lucide-react'
import { updateSetting, getSetting } from '@/app/actions/data'

async function handleUpdateSetting(formData: FormData) {
  'use server'
  await updateSetting(formData)
}

export default async function AdminParametresPage() {
  const platformName = await getSetting('platform_name')
  const supportEmail = await getSetting('support_email')
  const maxQuotes = await getSetting('max_quotes_per_lead')
  const responseDelay = await getSetting('artisan_response_hours')

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Paramètres</h1>
        <p className="text-slate-500 mt-1">Configuration globale de la plateforme RENOMAG.</p>
      </div>

      <div className="space-y-6">
        {/* Platform settings */}
        <form action={handleUpdateSetting} className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-5">
            <Globe className="w-5 h-5 text-primary-600" />
            <h2 className="font-semibold text-slate-900">Paramètres plateforme</h2>
          </div>
          <input type="hidden" name="key" value="platform_name" />
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label" htmlFor="platform_name">Nom de la plateforme</label>
              <input id="platform_name" name="value" type="text" className="input-field" defaultValue={platformName || 'RENOMAG'} />
            </div>
          </div>
          <div className="mt-5 flex justify-end">
            <button type="submit" className="btn-primary px-5 py-2.5">Enregistrer</button>
          </div>
        </form>

        <form action={handleUpdateSetting} className="bg-white rounded-xl border border-slate-200 p-6">
          <input type="hidden" name="key" value="support_email" />
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label" htmlFor="support_email">Email support</label>
              <input id="support_email" name="value" type="email" className="input-field" defaultValue={supportEmail || 'contact@renomag.fr'} />
            </div>
          </div>
          <div className="mt-5 flex justify-end">
            <button type="submit" className="btn-primary px-5 py-2.5">Enregistrer</button>
          </div>
        </form>

        <form action={handleUpdateSetting} className="bg-white rounded-xl border border-slate-200 p-6">
          <input type="hidden" name="key" value="max_quotes_per_lead" />
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label" htmlFor="max_quotes">Nombre max de devis par lead</label>
              <select id="max_quotes" name="value" className="input-field" defaultValue={maxQuotes || '3'}>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>
          </div>
          <div className="mt-5 flex justify-end">
            <button type="submit" className="btn-primary px-5 py-2.5">Enregistrer</button>
          </div>
        </form>

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
              { label: 'Anomalie système', desc: 'SMS + Email', enabled: true },
              { label: 'Nouveau lead sans match', desc: 'Email dans les 30 min', enabled: false },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                <div>
                  <p className="text-sm font-medium text-slate-900">{item.label}</p>
                  <p className="text-xs text-slate-400">{item.desc}</p>
                </div>
                <button
                  type="button"
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
                <label className="label" htmlFor="admin_email">Email administrateur</label>
                <input id="admin_email" type="email" className="input-field" defaultValue="admin@renomag.fr" />
              </div>
              <div>
                <label className="label" htmlFor="2fa">Authentification 2FA</label>
                <select id="2fa" className="input-field">
                  <option>Activé (recommandé)</option>
                  <option>Désactivé</option>
                </select>
              </div>
            </div>
            <div>
              <label className="label" htmlFor="ips">IPs autorisées pour l&apos;admin (une par ligne)</label>
              <textarea id="ips" className="input-field h-20 resize-none" defaultValue="0.0.0.0/0" />
            </div>
          </div>
          <div className="mt-5 flex justify-end">
            <button type="button" className="btn-primary px-5 py-2.5">Enregistrer</button>
          </div>
        </div>

        {/* Database */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-5">
            <Database className="w-5 h-5 text-primary-600" />
            <h2 className="font-semibold text-slate-900">Maintenance base de données</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            <button type="button" className="text-sm font-medium text-slate-700 border border-slate-200 rounded-lg px-4 py-2.5 hover:bg-slate-50 transition-colors">
              Exporter les données
            </button>
            <button type="button" className="text-sm font-medium text-slate-700 border border-slate-200 rounded-lg px-4 py-2.5 hover:bg-slate-50 transition-colors">
              Vider le cache
            </button>
            <button type="button" className="text-sm font-medium text-amber-700 border border-amber-200 rounded-lg px-4 py-2.5 hover:bg-amber-50 transition-colors">
              Logs système
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
