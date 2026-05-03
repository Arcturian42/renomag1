export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { Role } from '@prisma/client'
import Link from 'next/link'
import {
  FileText,
  Plus,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  Send,
  Edit,
} from 'lucide-react'

function getStatusBadge(status: string) {
  switch (status) {
    case 'DRAFT':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-slate-100 text-slate-700">
          <Edit className="w-3 h-3" />
          Brouillon
        </span>
      )
    case 'SENT':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
          <Send className="w-3 h-3" />
          Envoyé
        </span>
      )
    case 'ACCEPTED':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-eco-100 text-eco-700">
          <CheckCircle className="w-3 h-3" />
          Accepté
        </span>
      )
    case 'REJECTED':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-700">
          <XCircle className="w-3 h-3" />
          Refusé
        </span>
      )
    case 'EXPIRED':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-amber-100 text-amber-700">
          <AlertCircle className="w-3 h-3" />
          Expiré
        </span>
      )
    default:
      return null
  }
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
  }).format(amount)
}

export default async function DevisPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/connexion')

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: { artisan: true },
  })

  if (!dbUser || dbUser.role !== Role.ARTISAN) {
    redirect('/espace-proprietaire')
  }

  if (!dbUser.artisan) {
    redirect('/espace-pro')
  }

  const artisanId = dbUser.artisan.id

  const [quotes, leads] = await Promise.all([
    prisma.quote.findMany({
      where: { artisanId },
      include: {
        lead: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.lead.findMany({
      where: { artisanId, status: { in: ['NEW', 'CONTACTED', 'QUALIFIED'] } },
      orderBy: { createdAt: 'desc' },
    }),
  ])

  const totalSent = quotes.filter((q) => q.status !== 'DRAFT').length
  const totalAccepted = quotes.filter((q) => q.status === 'ACCEPTED').length
  const acceptanceRate = totalSent > 0 ? Math.round((totalAccepted / totalSent) * 100) : 0
  const totalDraft = quotes.filter((q) => q.status === 'DRAFT').length

  const stats = [
    {
      label: 'Devis envoyés',
      value: totalSent,
      icon: <Send className="w-4 h-4" />,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      label: 'Acceptés',
      value: totalAccepted,
      icon: <CheckCircle className="w-4 h-4" />,
      color: 'text-eco-600 bg-eco-50',
    },
    {
      label: 'Taux de conversion',
      value: `${acceptanceRate}%`,
      icon: <TrendingUp className="w-4 h-4" />,
      color: 'text-primary-600 bg-primary-50',
    },
    {
      label: 'Brouillons',
      value: totalDraft,
      icon: <Edit className="w-4 h-4" />,
      color: 'text-slate-600 bg-slate-50',
    },
  ]

  return (
    <div className="p-6 lg:p-8 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gestion des devis</h1>
          <p className="text-slate-500 mt-1">
            Créez et suivez vos devis pour vos leads
          </p>
        </div>
        <Link href="/espace-pro/devis/nouveau" className="btn-primary">
          <Plus className="w-4 h-4" />
          Nouveau devis
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-4">
            <div className={`inline-flex items-center justify-center w-8 h-8 rounded-lg ${stat.color} mb-3`}>
              {stat.icon}
            </div>
            <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quotes list */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="border-b border-slate-200 p-5">
          <h2 className="font-semibold text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary-600" />
            Tous les devis ({quotes.length})
          </h2>
        </div>

        {quotes.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-medium text-slate-900 mb-1">Aucun devis</h3>
            <p className="text-sm text-slate-500 mb-4">
              Créez votre premier devis pour un lead
            </p>
            <Link href="/espace-pro/devis/nouveau" className="btn-primary">
              <Plus className="w-4 h-4" />
              Créer un devis
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {quotes.map((quote) => {
              const isExpired = new Date(quote.validityDate) < new Date() && quote.status === 'SENT'
              const lead = quote.lead
              const clientName = lead ? `${lead.firstName} ${lead.lastName}` : 'Lead supprimé'
              const projectType = lead?.projectType || 'N/A'

              return (
                <div
                  key={quote.id}
                  className="p-5 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-slate-900">
                          {clientName}
                        </h3>
                        {getStatusBadge(isExpired ? 'EXPIRED' : quote.status)}
                      </div>
                      <p className="text-sm text-slate-600 mb-2 line-clamp-2">
                        {quote.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span>Projet: {projectType}</span>
                        <span>•</span>
                        <span>Créé le {new Date(quote.createdAt).toLocaleDateString('fr-FR')}</span>
                        <span>•</span>
                        <span>
                          Valide jusqu'au {new Date(quote.validityDate).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <p className="text-xl font-bold text-slate-900 mb-1">
                        {formatCurrency(quote.amount)}
                      </p>
                      {quote.status === 'DRAFT' ? (
                        <Link
                          href={`/espace-pro/devis/${quote.id}/edit`}
                          className="btn-secondary text-xs py-1.5 px-3"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          Modifier
                        </Link>
                      ) : (
                        <Link
                          href={`/espace-pro/devis/${quote.id}`}
                          className="btn-secondary text-xs py-1.5 px-3"
                        >
                          Voir détails
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Available leads */}
      {leads.length > 0 && (
        <div className="mt-6 bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary-600" />
            Leads en attente de devis ({leads.length})
          </h2>
          <div className="space-y-3">
            {leads.slice(0, 5).map((lead) => (
              <div
                key={lead.id}
                className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {lead.firstName} {lead.lastName}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {lead.projectType} • {lead.city || lead.zipCode}
                  </p>
                </div>
                <Link
                  href={`/espace-pro/devis/nouveau?leadId=${lead.id}`}
                  className="btn-primary text-xs py-1.5 px-3"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Créer devis
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
