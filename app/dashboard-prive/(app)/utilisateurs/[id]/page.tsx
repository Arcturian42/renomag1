import { getUserById } from '@/lib/data/dashboard'
import Link from 'next/link'
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Shield, User as UserIcon } from 'lucide-react'
import { notFound } from 'next/navigation'

export default async function UtilisateurDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const user = await getUserById(params.id)
  if (!user) notFound()

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <Link
        href="/dashboard-prive/utilisateurs"
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-primary-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour aux utilisateurs
      </Link>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-primary-700 flex items-center justify-center text-xl font-bold text-white">
            {user.profile?.firstName?.[0] || 'U'}
            {user.profile?.lastName?.[0] || ''}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl font-bold text-slate-900">
                {user.profile?.firstName || ''} {user.profile?.lastName || ''}
              </h1>
              <span
                className={`text-xs rounded-full px-2.5 py-0.5 font-medium ${
                  user.role === 'ADMIN'
                    ? 'bg-purple-100 text-purple-700'
                    : user.role === 'ARTISAN'
                    ? 'bg-accent-100 text-accent-700'
                    : 'bg-blue-100 text-blue-700'
                }`}
              >
                {user.role === 'ADMIN' && 'Administrateur'}
                {user.role === 'ARTISAN' && 'Artisan'}
                {user.role === 'USER' && 'Utilisateur'}
              </span>
              <span
                className={`text-xs rounded-full px-2.5 py-0.5 font-medium ${
                  user.status === 'active'
                    ? 'bg-eco-100 text-eco-700'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {user.status === 'active' ? 'Actif' : 'Inactif'}
              </span>
            </div>
            <p className="text-slate-500 text-sm mt-1">{user.email}</p>
          </div>
        </div>

        <div className="p-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Email</span>
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <Mail className="w-4 h-4 text-slate-400" />
              {user.email}
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Téléphone</span>
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <Phone className="w-4 h-4 text-slate-400" />
              {user.profile?.phone || 'Non renseigné'}
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Localisation</span>
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <MapPin className="w-4 h-4 text-slate-400" />
              {user.profile?.city || 'Non renseigné'} {user.profile?.zipCode ? `(${user.profile.zipCode})` : ''}
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Date d&apos;inscription</span>
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <Calendar className="w-4 h-4 text-slate-400" />
              {new Date(user.createdAt).toLocaleDateString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Rôle système</span>
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <Shield className="w-4 h-4 text-slate-400" />
              {user.role}
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Source d&apos;acquisition</span>
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <UserIcon className="w-4 h-4 text-slate-400" />
              {user.source}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
          <p className="text-xs text-slate-400">
            Dernière mise à jour : {new Date(user.updatedAt).toLocaleDateString('fr-FR')} — ID : {user.id}
          </p>
        </div>
      </div>
    </div>
  )
}
