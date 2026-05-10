export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { Role } from '@prisma/client'
import { Settings, Bell, Shield, CreditCard, Trash2 } from 'lucide-react'
import BillingForm from '@/components/settings/BillingForm'

export default async function EspaceProParametresPage({
  searchParams,
}: {
  searchParams: { success?: string; error?: string }
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/connexion')

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: { artisan: true },
  })

  if (!dbUser || dbUser.role !== Role.ARTISAN) {
    redirect('/espace-proprietaire')
  }

  const artisan = dbUser.artisan

  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Paramètres</h1>
        <p className="text-slate-500 mt-1">Gérez votre compte et vos préférences.</p>
      </div>

      {/* Success/Error messages */}
      {searchParams.success === 'billing' && (
        <div className="mb-6 bg-eco-50 border border-eco-200 text-eco-800 px-4 py-3 rounded-lg">
          ✅ Informations de facturation enregistrées avec succès !
        </div>
      )}
      {searchParams.error === 'billing' && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          ❌ Erreur lors de l'enregistrement. Veuillez réessayer.
        </div>
      )}

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
              <label className="label" htmlFor="rayon-dintervention-km">Rayon d'intervention (km)</label>
              <select id="rayon-dintervention-km" className="input-field">
                <option>25 km</option>
                <option>50 km</option>
                <option defaultValue="75">75 km</option>
                <option>100 km</option>
              </select>
            </div>
            <div>
              <label className="label" htmlFor="budget-minimum-">Budget minimum (€)</label>
              <input id="budget-minimum-" type="number" className="input-field" defaultValue="3000" />
            </div>
          </div>
          <div className="mt-4">
            <p className="label">Types de travaux acceptés</p>
            <div className="grid sm:grid-cols-2 gap-2 mt-2">
              {[
                { label: 'Isolation combles', checked: true },
                { label: 'Isolation murs', checked: true },
                { label: 'Pompes à chaleur', checked: true },
                { label: 'Panneaux solaires', checked: false },
                { label: 'VMC', checked: true },
                { label: 'Fenêtres / menuiseries', checked: false },
              ].map((item) => (
                <label key={item.label} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked={item.checked} className="rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                  <span className="text-sm text-slate-700">{item.label}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="mt-5 flex justify-end">
            <button className="btn-primary px-5 py-2.5">Enregistrer</button>
          </div>
        </div>

        {/* Security */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-5">
            <Shield className="w-5 h-5 text-primary-600" />
            <h2 className="font-semibold text-slate-900">Sécurité</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="label" htmlFor="mot-de-passe-actuel">Mot de passe actuel</label>
              <input id="mot-de-passe-actuel" type="password" className="input-field" placeholder="••••••••" />
            </div>
            <div>
              <label className="label" htmlFor="nouveau-mot-de-passe">Nouveau mot de passe</label>
              <input id="nouveau-mot-de-passe" type="password" className="input-field" placeholder="••••••••" />
            </div>
          </div>
          <div className="mt-5 flex justify-end">
            <button className="btn-primary px-5 py-2.5">Modifier</button>
          </div>
        </div>

        {/* Billing - Now using actual user data */}
        <BillingForm
          companyName={artisan?.name || ''}
          siret={artisan?.siret || ''}
          billingAddress={artisan?.billingAddress || ''}
          tvaNumber={artisan?.tvaNumber || ''}
        />

        {/* Danger zone */}
        <div className="bg-red-50 rounded-xl border border-red-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <Trash2 className="w-5 h-5 text-red-600" />
            <h2 className="font-semibold text-red-900">Zone de danger</h2>
          </div>
          <p className="text-sm text-red-700 mb-4">
            La suppression de votre compte artisan est définitive. Tous vos leads et données seront effacés.
          </p>
          <button className="text-sm font-medium text-red-600 hover:text-red-800 border border-red-300 rounded-lg px-4 py-2 hover:bg-red-100 transition-colors">
            Fermer mon compte artisan
          </button>
        </div>
      </div>
    </div>
  )
}
