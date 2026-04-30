import { Search, Filter, UserCheck, UserX } from 'lucide-react'

const USERS = [
  { id: 'U001', name: 'Jean Dupont', email: 'jean.dupont@email.fr', type: 'particulier', status: 'active', joined: '10 avr. 2024', projects: 1 },
  { id: 'U002', name: 'Marie Martin', email: 'marie.martin@gmail.com', type: 'particulier', status: 'active', joined: '8 avr. 2024', projects: 2 },
  { id: 'U003', name: 'ThermoConfort Paris', email: 'contact@thermoconfort.fr', type: 'artisan', status: 'active', joined: '1 mars 2024', projects: 24 },
  { id: 'U004', name: 'Éco-Rénov Lyon', email: 'info@eco-renov-lyon.fr', type: 'artisan', status: 'active', joined: '15 jan. 2024', projects: 31 },
  { id: 'U005', name: 'Pierre Bernard', email: 'pierre.b@outlook.com', type: 'particulier', status: 'inactive', joined: '5 avr. 2024', projects: 0 },
  { id: 'U006', name: 'Nord Isolation', email: 'contact@nord-isolation.fr', type: 'artisan', status: 'suspended', joined: '20 fév. 2024', projects: 8 },
  { id: 'U007', name: 'Sophie Laurent', email: 'slaurent@free.fr', type: 'particulier', status: 'active', joined: '12 avr. 2024', projects: 1 },
  { id: 'U008', name: 'Chaleur Plus Nantes', email: 'contact@chaleurplus.fr', type: 'artisan', status: 'active', joined: '3 avr. 2024', projects: 6 },
]

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  active: { label: 'Actif', color: 'bg-eco-100 text-eco-700' },
  inactive: { label: 'Inactif', color: 'bg-slate-100 text-slate-600' },
  suspended: { label: 'Suspendu', color: 'bg-red-100 text-red-700' },
}

const TYPE_CONFIG: Record<string, { label: string; color: string }> = {
  particulier: { label: 'Particulier', color: 'bg-primary-100 text-primary-700' },
  artisan: { label: 'Artisan', color: 'bg-accent-100 text-accent-700' },
}

export default function AdminUtilisateursPage() {
  const stats = [
    { label: 'Total utilisateurs', value: USERS.length },
    { label: 'Particuliers actifs', value: USERS.filter((u) => u.type === 'particulier' && u.status === 'active').length },
    { label: 'Artisans actifs', value: USERS.filter((u) => u.type === 'artisan' && u.status === 'active').length },
    { label: 'Comptes suspendus', value: USERS.filter((u) => u.status === 'suspended').length },
  ]

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
            {USERS.map((user) => {
              const status = STATUS_CONFIG[user.status]
              const type = TYPE_CONFIG[user.type]
              return (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{user.name}</p>
                      <p className="text-xs text-slate-400">{user.email}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs rounded-full px-2 py-1 font-medium ${type.color}`}>{type.label}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs rounded-full px-2 py-1 font-medium ${status.color}`}>{status.label}</span>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-500">{user.joined}</td>
                  <td className="px-5 py-4 text-sm font-medium text-slate-700">{user.projects}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 rounded-lg hover:bg-eco-50 text-eco-600 transition-colors" title="Activer">
                        <UserCheck className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors" title="Suspendre">
                        <UserX className="w-4 h-4" />
                      </button>
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
