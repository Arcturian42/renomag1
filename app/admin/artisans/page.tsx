export const dynamic = 'force-dynamic'

import Image from 'next/image'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Search, Filter, CheckCircle, Crown, AlertCircle, Plus, Check, X } from 'lucide-react'
import { verifyArtisan, unverifyArtisan } from '@/app/actions/admin'

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
                      <p className="text-xs text-slate-400">{artisan.user?.email || ''}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-slate-600">
                  <p>{artisan.city}</p>
                  <p className="text-xs text-slate-400">{artisan.department}</p>
                </td>
                <td className="px-4 py-4 text-slate-600">
                  <p className="text-xs">{artisan.phone || '—'}</p>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-semibold text-slate-900">
                      {artisan.rating.toFixed(1)}
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
                    {artisan.verified ? (
                      <form action={unverifyArtisan}>
                        <input type="hidden" name="artisanId" value={artisan.id} />
                        <button
                          type="submit"
                          className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors bg-red-50 text-red-700 hover:bg-red-100"
                        >
                          <X className="w-3 h-3" />
                          Retirer
                        </button>
                      </form>
                    ) : (
                      <form action={verifyArtisan}>
                        <input type="hidden" name="artisanId" value={artisan.id} />
                        <button
                          type="submit"
                          className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors bg-eco-50 text-eco-700 hover:bg-eco-100"
                        >
                          <Check className="w-3 h-3" />
                          Vérifier
                        </button>
                      </form>
                    )}
                  </div>
                </td>
              </tr>
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
