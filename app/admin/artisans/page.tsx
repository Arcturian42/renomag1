export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { Search, Filter, Plus } from 'lucide-react'
import { ArtisanRow } from './ArtisanRow'

export default async function AdminArtisansPage() {
  const artisans = await prisma.artisanCompany.findMany({
    include: { user: true },
    orderBy: { createdAt: 'desc' },
  })

  const total = artisans.length
  const verified = artisans.filter((a) => a.verified).length
  const premium = artisans.filter((a) => a.premium).length
  const pending = artisans.filter((a) => !a.verified).length

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Artisans</h1>
          <p className="text-slate-500 mt-1">{total} artisans dans la base</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Chercher un artisan..."
              className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>
          <button className="flex items-center gap-1.5 px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white hover:bg-slate-50">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            Filtres
          </button>
          <button className="btn-primary text-sm py-2">
            <Plus className="w-3.5 h-3.5" />
            Ajouter
          </button>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total', value: String(total), color: 'text-slate-900' },
          { label: 'Vérifiés', value: String(verified), color: 'text-eco-600' },
          { label: 'Premium', value: String(premium), color: 'text-accent-600' },
          { label: 'En attente', value: String(pending), color: 'text-amber-600' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-4 text-center">
            <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Artisan
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Localisation
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Note
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {artisans.map((artisan) => (
              <ArtisanRow key={artisan.id} artisan={artisan} />
            ))}
            {artisans.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-sm text-slate-500">
                  Aucun artisan enregistré.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
