export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { updateArtisanProfileForm } from '@/app/actions/data'
import { changePassword } from '@/app/actions/auth'
import { Settings, Bell, Shield, CreditCard } from 'lucide-react'

async function handleChangePassword(formData: FormData) {
  'use server'
  await changePassword(formData)
}

export default async function EspaceProParametresPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/connexion')
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: { artisan: true, profile: true },
  })

  if (!dbUser || dbUser.role !== 'ARTISAN') {
    redirect('/espace-proprietaire')
  }

  const artisan = dbUser.artisan

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
              { label: 'Nouveau lead disponible', desc: 'Email + SMS immédiat' },
              { label: 'Message client reçu', desc: 'Email' },
              { label: 'Rapport hebdomadaire', desc: 'Email le lundi matin' },
              { label: 'Alertes certification RGE', desc: 'Email 30 jours avant expiration' },
              { label: 'Offres et promotions RENOMAG', desc: 'Email mensuel' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                <div>
                  <p className="text-sm font-medium text-slate-900">{item.label}</p>
                  <p className="text-xs text-slate-400">{item.desc}</p>
                </div>
                <button
                  type="button"
                  className="relative inline-flex w-10 h-6 rounded-full bg-primary-600"
                >
                  <span className="absolute top-1 w-4 h-4 rounded-full bg-white shadow translate-x-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Lead preferences */}
        <form action={updateArtisanProfileForm} className="bg-white rounded-xl border border-slate-200 p-6">
          <input type="hidden" name="userId" value={user.id} />
          <div className="flex items-center gap-3 mb-5">
            <Settings className="w-5 h-5 text-primary-600" />
            <h2 className="font-semibold text-slate-900">Préférences leads</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label" htmlFor="rayon">Rayon d&apos;intervention (km)</label>
              <select id="rayon" name="rayon" className="input-field" defaultValue={artisan?.responseTime?.replace(/[^0-9]/g, '') || '50'}>
                <option value="25">25 km</option>
                <option value="50">50 km</option>
                <option value="75">75 km</option>
                <option value="100">100 km</option>
              </select>
            </div>
            <div>
              <label className="label" htmlFor="budget">Budget minimum (€)</label>
              <input id="budget" name="budget" type="number" className="input-field" defaultValue="3000" />
            </div>
          </div>
          <div className="mt-5 flex justify-end">
            <button type="submit" className="btn-primary px-5 py-2.5">Enregistrer</button>
          </div>
        </form>

        {/* Security */}
        <form action={handleChangePassword} className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-5">
            <Shield className="w-5 h-5 text-primary-600" />
            <h2 className="font-semibold text-slate-900">Sécurité</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="label" htmlFor="newPassword">Nouveau mot de passe</label>
              <input id="newPassword" name="newPassword" type="password" className="input-field" placeholder="••••••••" minLength={8} required />
            </div>
            <div>
              <label className="label" htmlFor="confirmPassword">Confirmer le mot de passe</label>
              <input id="confirmPassword" name="confirmPassword" type="password" className="input-field" placeholder="••••••••" minLength={8} required />
            </div>
          </div>
          <div className="mt-5 flex justify-end">
            <button type="submit" className="btn-primary px-5 py-2.5">Modifier</button>
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
              <label className="label" htmlFor="raison">Raison sociale</label>
              <input id="raison" type="text" className="input-field" defaultValue={artisan?.name || ''} readOnly />
            </div>
            <div>
              <label className="label" htmlFor="siret-fact">SIRET</label>
              <input id="siret-fact" type="text" className="input-field" defaultValue={artisan?.siret || ''} readOnly />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-3">Modifiez ces informations dans votre profil artisan.</p>
        </div>
      </div>
    </div>
  )
}
