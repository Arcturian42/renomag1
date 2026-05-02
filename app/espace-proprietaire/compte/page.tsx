export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { Role } from '@prisma/client'
import { updateOwnerProfile } from '@/app/actions/artisan'
import { Save, User, Bell, Shield } from 'lucide-react'

export default async function ComptePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/connexion')

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: { profile: true },
  })

  if (!dbUser || (dbUser.role !== Role.USER && dbUser.role !== Role.ADMIN)) {
    redirect('/espace-pro')
  }

  const profile = dbUser.profile

  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <form action={updateOwnerProfile} className="space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Mon compte</h1>
            <p className="text-slate-500 mt-1">Gérez vos informations personnelles</p>
          </div>
          <button type="submit" className="btn-primary">
            <Save className="w-4 h-4" />
            Enregistrer
          </button>
        </div>

        {/* Personal info */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-900 mb-5 flex items-center gap-2">
            <User className="w-4 h-4 text-primary-600" />
            Informations personnelles
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label" htmlFor="firstName">Prénom</label>
              <input
                id="firstName" name="firstName" type="text"
                defaultValue={profile?.firstName || ''}
                className="input-field"
              />
            </div>
            <div>
              <label className="label" htmlFor="lastName">Nom</label>
              <input
                id="lastName" name="lastName" type="text"
                defaultValue={profile?.lastName || ''}
                className="input-field"
              />
            </div>
            <div>
              <label className="label" htmlFor="email">Email</label>
              <input
                id="email" type="email"
                defaultValue={dbUser.email}
                disabled
                className="input-field bg-slate-50"
              />
            </div>
            <div>
              <label className="label" htmlFor="phone">Téléphone</label>
              <input
                id="phone" name="phone" type="tel"
                defaultValue={profile?.phone || ''}
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-900 mb-5 flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary-600" />
            Adresse
          </h2>
          <div className="space-y-4">
            <div>
              <label className="label" htmlFor="address">Adresse</label>
              <input
                id="address" name="address" type="text"
                defaultValue={profile?.address || ''}
                className="input-field"
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label" htmlFor="city">Ville</label>
                <input
                  id="city" name="city" type="text"
                  defaultValue={profile?.city || ''}
                  className="input-field"
                />
              </div>
              <div>
                <label className="label" htmlFor="zipCode">Code postal</label>
                <input
                  id="zipCode" name="zipCode" type="text"
                  defaultValue={profile?.zipCode || ''}
                  className="input-field"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
