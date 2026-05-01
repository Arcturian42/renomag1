export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { updateProfileForm } from '@/app/actions/data'
import { changePassword } from '@/app/actions/auth'
import { User, Home, Bell, Shield, LogOut } from 'lucide-react'

async function handleChangePassword(formData: FormData) {
  'use server'
  await changePassword(formData)
}

export default async function ProprietaireComptePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/connexion')
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: { profile: true },
  })

  const profile = dbUser?.profile

  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Mon compte</h1>
        <p className="text-slate-500 mt-1">Gérez vos informations personnelles et préférences.</p>
      </div>

      <div className="space-y-6">
        {/* Personal info */}
        <form action={updateProfileForm} className="bg-white rounded-xl border border-slate-200 p-6">
          <input type="hidden" name="userId" value={user.id} />
          <div className="flex items-center gap-3 mb-5">
            <User className="w-5 h-5 text-primary-600" />
            <h2 className="font-semibold text-slate-900">Informations personnelles</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label" htmlFor="firstName">Prénom</label>
              <input id="firstName" name="firstName" type="text" className="input-field" defaultValue={profile?.firstName || ''} />
            </div>
            <div>
              <label className="label" htmlFor="lastName">Nom</label>
              <input id="lastName" name="lastName" type="text" className="input-field" defaultValue={profile?.lastName || ''} />
            </div>
            <div>
              <label className="label" htmlFor="email">Email</label>
              <input id="email" type="email" className="input-field" defaultValue={dbUser?.email || ''} readOnly />
            </div>
            <div>
              <label className="label" htmlFor="phone">Téléphone</label>
              <input id="phone" name="phone" type="tel" className="input-field" defaultValue={profile?.phone || ''} />
            </div>
          </div>
          <div className="mt-5 flex justify-end">
            <button type="submit" className="btn-primary px-5 py-2.5">Enregistrer</button>
          </div>
        </form>

        {/* Housing info */}
        <form action={updateProfileForm} className="bg-white rounded-xl border border-slate-200 p-6">
          <input type="hidden" name="userId" value={user.id} />
          <div className="flex items-center gap-3 mb-5">
            <Home className="w-5 h-5 text-primary-600" />
            <h2 className="font-semibold text-slate-900">Mon logement</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label" htmlFor="address">Adresse</label>
              <input id="address" name="address" type="text" className="input-field" defaultValue={profile?.address || ''} />
            </div>
            <div>
              <label className="label" htmlFor="city">Ville</label>
              <input id="city" name="city" type="text" className="input-field" defaultValue={profile?.city || ''} />
            </div>
            <div>
              <label className="label" htmlFor="zipCode">Code postal</label>
              <input id="zipCode" name="zipCode" type="text" className="input-field" defaultValue={profile?.zipCode || ''} />
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
              <label className="label" htmlFor="confirmPassword">Confirmer le nouveau mot de passe</label>
              <input id="confirmPassword" name="confirmPassword" type="password" className="input-field" placeholder="••••••••" minLength={8} required />
            </div>
          </div>
          <div className="mt-5 flex justify-end">
            <button type="submit" className="btn-primary px-5 py-2.5">Modifier le mot de passe</button>
          </div>
        </form>
      </div>
    </div>
  )
}
