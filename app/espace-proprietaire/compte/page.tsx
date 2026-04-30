import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { User, Home, Bell, Shield, LogOut } from 'lucide-react'
import { updateProfileForm } from '@/app/actions/data'

export default async function ProprietaireComptePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/connexion')
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: { profile: true },
  })

  if (!dbUser || dbUser.role === 'ARTISAN') {
    redirect('/espace-pro')
  }

  const profile = dbUser.profile

  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Mon compte</h1>
        <p className="text-slate-500 mt-1">Gérez vos informations personnelles et préférences.</p>
      </div>

      <form action={updateProfileForm} className="space-y-6">
        <input type="hidden" name="userId" value={user.id} />
        <input type="hidden" name="role" value="USER" />

        {/* Personal info */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-5">
            <User className="w-5 h-5 text-primary-600" />
            <h2 className="font-semibold text-slate-900">Informations personnelles</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Prénom</label>
              <input type="text" name="firstName" className="input-field" defaultValue={profile?.firstName || ''} />
            </div>
            <div>
              <label className="label">Nom</label>
              <input type="text" name="lastName" className="input-field" defaultValue={profile?.lastName || ''} />
            </div>
            <div>
              <label className="label">Email</label>
              <input type="email" className="input-field bg-slate-50" defaultValue={dbUser.email} readOnly />
            </div>
            <div>
              <label className="label">Téléphone</label>
              <input type="tel" name="phone" className="input-field" defaultValue={profile?.phone || ''} />
            </div>
          </div>
          <div className="mt-5 flex justify-end">
            <button type="submit" className="btn-primary px-5 py-2.5">Enregistrer</button>
          </div>
        </div>

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
              <label className="label">Surface (m²)</label>
              <input type="number" className="input-field" defaultValue="120" />
            </div>
            <div>
              <label className="label">Année de construction</label>
              <input type="number" className="input-field" defaultValue="1985" />
            </div>
            <div>
              <label className="label">Code postal</label>
              <input type="text" name="zipCode" className="input-field" defaultValue={profile?.zipCode || ''} />
            </div>
          </div>
          <div className="mt-5 flex justify-end">
            <button type="submit" className="btn-primary px-5 py-2.5">Enregistrer</button>
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
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-5">
            <Shield className="w-5 h-5 text-primary-600" />
            <h2 className="font-semibold text-slate-900">Sécurité</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="label">Mot de passe actuel</label>
              <input type="password" className="input-field" placeholder="••••••••" />
            </div>
            <div>
              <label className="label">Nouveau mot de passe</label>
              <input type="password" className="input-field" placeholder="••••••••" />
            </div>
            <div>
              <label className="label">Confirmer le nouveau mot de passe</label>
              <input type="password" className="input-field" placeholder="••••••••" />
            </div>
          </div>
          <div className="mt-5 flex justify-end">
            <button type="button" className="btn-primary px-5 py-2.5">Modifier le mot de passe</button>
          </div>
        </div>

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
      </form>
    </div>
  )
}
