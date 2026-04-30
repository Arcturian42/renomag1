'use client'

import { getUsers } from '@/lib/dashboard-data'
import DataTable from '@/components/dashboard/DataTable'
import Link from 'next/link'
import { BadgeCheck, BadgeX, Eye } from 'lucide-react'

export default function UtilisateursPage() {
  const users = getUsers()

  const columns = [
    {
      key: 'name',
      header: 'Nom',
      sortable: true,
      render: (u: any) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center text-xs font-bold text-primary-700">
            {u.profile?.firstName?.[0] || 'U'}
          </div>
          <div>
            <p className="font-medium text-slate-900">
              {u.profile?.firstName || ''} {u.profile?.lastName || ''}
            </p>
            <p className="text-xs text-slate-400">{u.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Rôle',
      sortable: true,
      render: (u: any) => (
        <span
          className={`text-xs rounded-full px-2 py-0.5 font-medium ${
            u.role === 'ADMIN'
              ? 'bg-purple-100 text-purple-700'
              : u.role === 'ARTISAN'
              ? 'bg-accent-100 text-accent-700'
              : 'bg-blue-100 text-blue-700'
          }`}
        >
          {u.role === 'ADMIN' && 'Administrateur'}
          {u.role === 'ARTISAN' && 'Artisan'}
          {u.role === 'USER' && 'Utilisateur'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Inscription',
      sortable: true,
      render: (u: any) => (
        <span className="text-slate-600">
          {new Date(u.createdAt).toLocaleDateString('fr-FR')}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Statut',
      sortable: true,
      render: (u: any) => (
        <span className="inline-flex items-center gap-1 text-xs">
          {u.status === 'active' ? (
            <>
              <BadgeCheck className="w-3.5 h-3.5 text-eco-500" />
              <span className="text-eco-700">Actif</span>
            </>
          ) : (
            <>
              <BadgeX className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-500">Inactif</span>
            </>
          )}
        </span>
      ),
    },
    {
      key: 'source',
      header: 'Source',
      sortable: true,
      render: (u: any) => (
        <span className="text-slate-600 text-xs bg-slate-100 rounded-full px-2 py-0.5">
          {u.source}
        </span>
      ),
    },
    {
      key: 'city',
      header: 'Ville',
      sortable: true,
      render: (u: any) => <span className="text-slate-600">{u.profile?.city || '—'}</span>,
    },
    {
      key: 'actions',
      header: '',
      render: (u: any) => (
        <Link
          href={`/dashboard-prive/utilisateurs/${u.id}`}
          className="text-primary-600 hover:text-primary-800"
        >
          <Eye className="w-4 h-4" />
        </Link>
      ),
    },
  ]

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Utilisateurs</h1>
          <p className="text-slate-500 text-sm mt-1">
            {users.length} utilisateurs inscrits
          </p>
        </div>
      </div>

      <DataTable data={users} columns={columns} />
    </div>
  )
}
