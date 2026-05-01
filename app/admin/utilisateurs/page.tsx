export const dynamic = 'force-dynamic'
import { Search, Filter, UserCheck, UserX } from 'lucide-react'
import { getAllUsers, deleteUser } from '@/app/actions/data'
import { formatDateShort } from '@/lib/utils'

export default async function AdminUtilisateursPage() {
  const users = await getAllUsers()

  const stats = [
    { label: 'Total utilisateurs', value: users.length },
    { label: 'Particuliers actifs', value: users.filter((u) => u.role === 'USER').length },
    { label: 'Artisans actifs', value: users.filter((u) => u.role === 'ARTISAN').length },
    { label: 'Admins', value: users.filter((u) => u.role === 'ADMIN').length },
  ]

  const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
    active: { label: 'Actif', color: 'bg-eco-100 text-eco-700' },
    inactive: { label: 'Inactif', color: 'bg-slate-100 text-slate-600' },
    suspended: { label: 'Suspendu', color: 'bg-red-100 text-red-700' },
  }

  const TYPE_CONFIG: Record<string, { label: string; color: string }> = {
    USER: { label: 'Particulier', color: 'bg-primary-100 text-primary-700' },
    ARTISAN: { label: 'Artisan', color: 'bg-accent-100 text-accent-700' },
    ADMIN: { label: 'Admin', color: 'bg-purple-100 text-purple-700' },
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Utilisateurs</h1>
        <p className="text-slate-500 mt-1">Gestion de tous les comptes de la plateforme.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="text-2xl font-bold text-slate-900">{s.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4 flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par nom ou email..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <select className="text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-500">
          <option>Tous types</option>
          <option>Particuliers</option>
          <option>Artisans</option>
        </select>
        <select className="text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-500">
          <option>Tous statuts</option>
          <option>Actif</option>
          <option>Inactif</option>
          <option>Suspendu</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">Utilisateur</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">Type</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">Statut</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">Inscription</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">Projets</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((user) => {
              const displayName = user.profile
                ? `${user.profile.firstName || ''} ${user.profile.lastName || ''}`.trim()
                : user.email
              const type = TYPE_CONFIG[user.role] || TYPE_CONFIG.USER
              const status = STATUS_CONFIG.active

              return (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{displayName || user.email}</p>
                      <p className="text-xs text-slate-400">{user.email}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs rounded-full px-2 py-1 font-medium ${type.color}`}>{type.label}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs rounded-full px-2 py-1 font-medium ${status.color}`}>{status.label}</span>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-500">{formatDateShort(user.createdAt)}</td>
                  <td className="px-5 py-4 text-sm font-medium text-slate-700">{user.artisan ? '-' : '0'}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 rounded-lg hover:bg-eco-50 text-eco-600 transition-colors" title="Activer">
                        <UserCheck className="w-4 h-4" />
                      </button>
                      <form action={deleteUser.bind(null, user.id)}>
                        <button
                          type="submit"
                          className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                          title="Supprimer"
                        >
                          <UserX className="w-4 h-4" />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
