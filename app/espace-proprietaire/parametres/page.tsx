export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { Role } from '@prisma/client'
import { Bell, Shield, Trash2, AlertTriangle } from 'lucide-react'

export default async function ParametresPage() {
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

  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Paramètres</h1>
        <p className="text-slate-500 mt-1">Gérez vos préférences et votre compte</p>
      </div>

      {/* Notification preferences */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-5">
        <h2 className="font-semibold text-slate-900 mb-5 flex items-center gap-2">
          <Bell className="w-4 h-4 text-primary-600" />
          Préférences de notifications
        </h2>
        <div className="space-y-4">
          {[
            { id: 'email-new-message', label: 'Nouveaux messages', description: 'Recevoir un email lors d\'un nouveau message' },
            { id: 'email-new-match', label: 'Nouveaux artisans matchés', description: 'Recevoir un email quand un artisan correspond à votre projet' },
            { id: 'email-quote-received', label: 'Devis reçus', description: 'Recevoir un email quand un artisan envoie un devis' },
            { id: 'email-newsletter', label: 'Newsletter', description: 'Recevoir nos conseils rénovation et actualités' },
          ].map((pref) => (
            <label key={pref.id} className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="mt-0.5 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">{pref.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{pref.description}</p>
              </div>
            </label>
          ))}
        </div>
        <button className="btn-primary mt-5">
          Enregistrer les préférences
        </button>
      </div>

      {/* Privacy & Security */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-5">
        <h2 className="font-semibold text-slate-900 mb-5 flex items-center gap-2">
          <Shield className="w-4 h-4 text-primary-600" />
          Confidentialité et sécurité
        </h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-slate-900 mb-2">Mot de passe</h3>
            <p className="text-sm text-slate-500 mb-3">
              Dernière modification: Il y a 3 mois
            </p>
            <button className="btn-secondary text-sm">
              Changer mon mot de passe
            </button>
          </div>
          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-sm font-medium text-slate-900 mb-2">Télécharger mes données</h3>
            <p className="text-sm text-slate-500 mb-3">
              Téléchargez une copie de toutes vos données personnelles
            </p>
            <button className="btn-secondary text-sm">
              Demander mes données
            </button>
          </div>
        </div>
      </div>

      {/* Account deletion */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <h2 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          Zone de danger
        </h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-red-900 mb-2">Supprimer mon compte</h3>
            <p className="text-sm text-red-700 mb-3">
              Une fois supprimé, votre compte ne pourra pas être récupéré. Cette action est irréversible.
            </p>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors">
              <Trash2 className="w-4 h-4" />
              Supprimer définitivement mon compte
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
