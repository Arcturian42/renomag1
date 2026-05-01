'use client'

import { useState } from 'react'
import { User, Home, Bell, Shield, LogOut, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { saveProfileInfo } from './actions'

type Props = {
  email: string
  firstName: string
  lastName: string
  phone: string
  zipCode: string
}

export default function CompteClient({ email, firstName, lastName, phone, zipCode }: Props) {
  const [pwLoading, setPwLoading] = useState(false)
  const [pwError, setPwError] = useState<string | null>(null)
  const [pwSuccess, setPwSuccess] = useState(false)
  const [infoLoading, setInfoLoading] = useState(false)
  const [infoSaved, setInfoSaved] = useState(false)

  async function handleInfoSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setInfoLoading(true)
    const fd = new FormData(e.currentTarget)
    const result = await saveProfileInfo(fd)
    setInfoLoading(false)
    if (!result?.error) {
      setInfoSaved(true)
      setTimeout(() => setInfoSaved(false), 3000)
    }
  }

  async function handlePasswordChange(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const newPassword = fd.get('newPassword') as string
    const confirmPassword = fd.get('confirmPassword') as string

    if (newPassword !== confirmPassword) {
      setPwError('Les mots de passe ne correspondent pas.')
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
        <h1 className="text-2xl font-bold text-slate-900">Mon compte</h1>
        <p className="text-slate-500 mt-1">Gérez vos informations personnelles et préférences.</p>
      </div>

      <div className="space-y-6">
        {/* Personal info */}
        <form onSubmit={handleInfoSave} className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-5">
            <User className="w-5 h-5 text-primary-600" />
            <h2 className="font-semibold text-slate-900">Informations personnelles</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Prénom</label>
              <input name="firstName" type="text" className="input-field" defaultValue={firstName} required />
            </div>
            <div>
              <label className="label">Nom</label>
              <input name="lastName" type="text" className="input-field" defaultValue={lastName} required />
            </div>
            <div>
              <label className="label">Email</label>
              <input type="email" className="input-field" value={email} readOnly />
            </div>
            <div>
              <label className="label">Téléphone</label>
              <input name="phone" type="tel" className="input-field" defaultValue={phone} />
            </div>
          </div>
          <div className="mt-5 flex justify-end">
            <button type="submit" disabled={infoLoading} className="btn-primary px-5 py-2.5 disabled:opacity-60">
              {infoLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Enregistrement...</> : infoSaved ? 'Sauvegardé ✓' : 'Enregistrer'}
            </button>
          </div>
        </form>

        {/* Housing info */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-5">
            <Home className="w-5 h-5 text-primary-600" />
            <h2 className="font-semibold text-slate-900">Mon logement</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Type de logement</label>
              <select className="input-field">
                <option>Maison individuelle</option>
                <option>Appartement</option>
              </select>
            </div>
            <div>
              <label className="label">Code postal</label>
              <input type="text" className="input-field" defaultValue={zipCode} />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-5">
            <Bell className="w-5 h-5 text-primary-600" />
            <h2 className="font-semibold text-slate-900">Notifications</h2>
          </div>
          <div className="space-y-4">
            {[
              { label: 'Nouveau devis reçu', desc: 'Email + SMS', enabled: true },
              { label: 'Nouveau message artisan', desc: 'Email', enabled: true },
              { label: 'Rappels administratifs', desc: 'Email', enabled: true },
              { label: 'Newsletter RENOMAG', desc: 'Email', enabled: false },
            ].map((notif) => (
              <div key={notif.label} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                <div>
                  <p className="text-sm font-medium text-slate-900">{notif.label}</p>
                  <p className="text-xs text-slate-400">{notif.desc}</p>
                </div>
                <button
                  type="button"
                  className={`relative inline-flex w-10 h-6 rounded-full transition-colors ${notif.enabled ? 'bg-primary-600' : 'bg-slate-200'}`}
                >
                  <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${notif.enabled ? 'translate-x-5' : 'translate-x-1'}`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Security */}
        <form onSubmit={handlePasswordChange} className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-5">
            <Shield className="w-5 h-5 text-primary-600" />
            <h2 className="font-semibold text-slate-900">Sécurité</h2>
          </div>
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
              <label className="label">Confirmer le nouveau mot de passe</label>
              <input name="confirmPassword" type="password" className="input-field" placeholder="••••••••" required />
            </div>
          </div>
          <div className="mt-5 flex justify-end">
            <button type="submit" disabled={pwLoading} className="btn-primary px-5 py-2.5 disabled:opacity-60">
              {pwLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Modification...</> : 'Modifier le mot de passe'}
            </button>
          </div>
        </form>

        {/* Danger zone */}
        <div className="bg-red-50 rounded-xl border border-red-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <LogOut className="w-5 h-5 text-red-600" />
            <h2 className="font-semibold text-red-900">Zone de danger</h2>
          </div>
          <p className="text-sm text-red-700 mb-4">
            La suppression de votre compte est irréversible. Toutes vos données seront effacées.
          </p>
          <button type="button" className="text-sm font-medium text-red-600 hover:text-red-800 border border-red-300 rounded-lg px-4 py-2 hover:bg-red-100 transition-colors">
            Supprimer mon compte
          </button>
        </div>
      </div>
    </div>
  )
}
