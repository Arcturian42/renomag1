export const dynamic = 'force-dynamic'

import Image from 'next/image'
import Link from 'next/link'
import { getAllArtisanCompanies, updateArtisanStatus } from '@/app/actions/data'
import { Search, ShieldCheck, AlertCircle, Crown } from 'lucide-react'

export default async function AdminArtisansPage() {
  const artisans = await getAllArtisanCompanies()

  const total = artisans.length
  const verifiedCount = artisans.filter((a) => a.verified).length
  const premiumCount = artisans.filter((a) => a.premium).length
  const pendingCount = artisans.filter((a) => !a.verified).length

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Artisans</h1>
          <p className="text-slate-500 mt-1">{total} artisans dans la base</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Chercher un artisan..."
            className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          />
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total', value: total, color: 'text-slate-900' },
          { label: 'Vérifiés', value: verifiedCount, color: 'text-eco-600' },
          { label: 'Premium', value: premiumCount, color: 'text-accent-600' },
          { label: 'En attente', value: pendingCount, color: 'text-amber-600' },
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
            {artisans.map((artisan) => (
              <tr
                key={artisan.id}
                className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                      <Image
                        src={artisan.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(artisan.name)}&background=1e40af&color=fff&size=200`}
                        alt={artisan.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 flex items-center gap-1">
                        {artisan.name}
                        {artisan.premium && <Crown className="w-3 h-3 text-accent-500" />}
                      </p>
                      <p className="text-xs text-slate-400">{artisan.user?.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-slate-600">
                  <p>{artisan.city}</p>
                  <p className="text-xs text-slate-400">{artisan.region || artisan.department}</p>
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-1">
                    {artisan.certifications.slice(0, 2).map((cert) => (
                      <span key={cert.id} className="badge-rge text-xs">
                        {cert.name}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-semibold text-slate-900">
                      {artisan.rating || '—'}
                    </span>
                    <span className="text-amber-400">⭐</span>
                  </div>
                  <p className="text-xs text-slate-400">{artisan.reviewCount} avis</p>
                </td>
                <td className="px-4 py-4">
                  {artisan.verified ? (
                    <span className="flex items-center gap-1 text-xs text-eco-700 bg-eco-50 rounded-full px-2 py-0.5 w-fit">
                      <ShieldCheck className="w-3 h-3" />
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
                  </div>
                </td>
              </tr>
            ))}
            {artisans.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-sm text-slate-500">
                  Aucun artisan trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
