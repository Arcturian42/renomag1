import Image from 'next/image'
import Link from 'next/link'
import { ARTISANS } from '@/lib/data/artisans'
import { Search, Filter, CheckCircle, Crown, AlertCircle, Plus } from 'lucide-react'

export default function AdminArtisansPage() {
  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Artisans</h1>
          <p className="text-slate-500 mt-1">{ARTISANS.length} artisans dans la base</p>
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
          { label: 'Total', value: '2 418', color: 'text-slate-900' },
          { label: 'Vérifiés', value: '2 104', color: 'text-eco-600' },
          { label: 'Premium', value: '347', color: 'text-accent-600' },
          { label: 'En attente', value: '12', color: 'text-amber-600' },
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
                Certifications
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
            {ARTISANS.map((artisan) => (
              <tr
                key={artisan.id}
                className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                      <Image
                        src={artisan.avatar}
                        alt={artisan.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 flex items-center gap-1">
                        {artisan.company}
                        {artisan.premium && <Crown className="w-3 h-3 text-accent-500" />}
                      </p>
                      <p className="text-xs text-slate-400">{artisan.name}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-slate-600">
                  <p>{artisan.city}</p>
                  <p className="text-xs text-slate-400">{artisan.region}</p>
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-1">
                    {artisan.certifications.slice(0, 2).map((cert) => (
                      <span key={cert} className="badge-rge text-xs">
                        {cert}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-semibold text-slate-900">
                      {artisan.rating}
                    </span>
                    <span className="text-amber-400">⭐</span>
                  </div>
                  <p className="text-xs text-slate-400">{artisan.reviewCount} avis</p>
                </td>
                <td className="px-4 py-4">
                  {artisan.verified ? (
                    <span className="flex items-center gap-1 text-xs text-eco-700 bg-eco-50 rounded-full px-2 py-0.5 w-fit">
                      <CheckCircle className="w-3 h-3" />
                      Vérifié
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-amber-700 bg-amber-50 rounded-full px-2 py-0.5 w-fit">
                      <AlertCircle className="w-3 h-3" />
                      En attente
                    </span>
                  )}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/annuaire/${artisan.slug}`}
                      className="text-xs text-primary-600 hover:text-primary-800 font-medium"
                    >
                      Voir
                    </Link>
                    <button className="text-xs text-slate-400 hover:text-slate-700 font-medium">
                      Modifier
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
