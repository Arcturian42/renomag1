'use client'

import { useState } from 'react'
import { Settings, Bell, Shield, CreditCard, Trash2, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type Props = {
  email: string
  companyName: string
  siret: string
  address: string
}

export default function ParametresClient({ email, companyName, siret, address }: Props) {
  const [pwLoading, setPwLoading] = useState(false)
  const [pwError, setPwError] = useState<string | null>(null)
  const [pwSuccess, setPwSuccess] = useState(false)

  async function handlePasswordChange(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const newPassword = fd.get('newPassword') as string
    const confirmPassword = fd.get('confirmPassword') as string

    if (newPassword !== confirmPassword) {
      setPwError('Les mots de passe ne correspondent pas.')
      return
    }
    if (newPassword.length < 8) {
      setPwError('Le mot de passe doit faire au moins 8 caractères.')
      return
    }

    setPwLoading(true)
    setPwError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    setPwLoading(false)

    if (error) {
      setPwError(error.message)
    } else {
      setPwSuccess(true)
      ;(e.target as HTMLFormElement).reset()
      setTimeout(() => setPwSuccess(false), 4000)
    }
  }

  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Paramètres</h1>
        <p className="text-slate-500 mt-1">Gérez votre compte et vos préférences.</p>
      </div>

      <div className="space-y-6">
        {/* Notifications */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-5">
            <Bell className="w-5 h-5 text-primary-600" />
            <h2 className="font-semibold text-slate-900">Notifications</h2>
          </div>
          <div className="space-y-4">
            {[
              { label: 'Nouveau lead disponible', desc: 'Email + SMS immédiat', enabled: true },
              { label: 'Message client reçu', desc: 'Email', enabled: true },
              { label: 'Rapport hebdomadaire', desc: 'Email le lundi matin', enabled: true },
              { label: 'Alertes certification RGE', desc: 'Email 30 jours avant expiration', enabled: true },
              { label: 'Offres et promotions RENOMAG', desc: 'Email mensuel', enabled: false },
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

        {/* Lead preferences */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-5">
            <Settings className="w-5 h-5 text-primary-600" />
            <h2 className="font-semibold text-slate-900">Préférences leads</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Rayon d&apos;intervention (km)</label>
              <select className="input-field">
                <option>25 km</option>
                <option>50 km</option>
                <option>75 km</option>
                <option>100 km</option>
              </select>
            </div>
            <div>
              <label className="label">Budget minimum (€)</label>
              <input type="number" className="input-field" defaultValue="3000" />
            </div>
          </div>
          <div className="mt-5 flex justify-end">
            <button type="button" className="btn-primary px-5 py-2.5">Enregistrer</button>
          </div>
        </div>

        {/* Security */}
        <form onSubmit={handlePasswordChange} className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-5">
            <Shield className="w-5 h-5 text-primary-600" />
            <h2 className="font-semibold text-slate-900">Sécurité</h2>
          </div>
          <p className="text-sm text-slate-500 mb-4">Email : <span className="font-medium text-slate-700">{email}</span></p>
          {pwError && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm text-red-700">{pwError}</div>
          )}
          {pwSuccess && (
            <div className="mb-4 bg-eco-50 border border-eco-200 rounded-lg px-3 py-2 text-sm text-eco-700">Mot de passe modifié avec succès.</div>
          )}
          <div className="space-y-4">
            <div>
              <label className="label">Nouveau mot de passe</label>
              <input name="newPassword" type="password" className="input-field" placeholder="••••••••" minLength={8} required />
            </div>
            <div>
              <label className="label">Confirmer le mot de passe</label>
              <input name="confirmPassword" type="password" className="input-field" placeholder="••••••••" required />
            </div>
          </div>
          <div className="mt-5 flex justify-end">
            <button type="submit" disabled={pwLoading} className="btn-primary px-5 py-2.5 disabled:opacity-60">
              {pwLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Modification...</> : 'Modifier le mot de passe'}
            </button>
          </div>
        </form>

        {/* Billing */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-5">
            <CreditCard className="w-5 h-5 text-primary-600" />
            <h2 className="font-semibold text-slate-900">Facturation</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Raison sociale</label>
              <input type="text" className="input-field" defaultValue={companyName} readOnly />
            </div>
            <div>
              <label className="label">SIRET</label>
              <input type="text" className="input-field" defaultValue={siret} readOnly />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Adresse de facturation</label>
              <input type="text" className="input-field" defaultValue={address} readOnly />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-3">
            Pour modifier ces informations, rendez-vous sur{' '}
            <a href="/espace-pro/profil" className="text-primary-600 hover:underline">votre profil</a>.
          </p>
        </div>

        {/* Danger zone */}
        <div className="bg-red-50 rounded-xl border border-red-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <Trash2 className="w-5 h-5 text-red-600" />
            <h2 className="font-semibold text-red-900">Zone de danger</h2>
          </div>
          <p className="text-sm text-red-700 mb-4">
            La suppression de votre compte artisan est définitive. Tous vos leads et données seront effacés.
          </p>
          <button type="button" className="text-sm font-medium text-red-600 hover:text-red-800 border border-red-300 rounded-lg px-4 py-2 hover:bg-red-100 transition-colors">
            Fermer mon compte artisan
          </button>
        </div>
      </div>
    </div>
  )
}
