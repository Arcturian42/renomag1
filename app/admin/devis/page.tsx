export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { FileText, CheckCircle, XCircle, Clock, Send, Edit, AlertCircle, TrendingUp } from 'lucide-react'

function getStatusBadge(status: string) {
  switch (status) {
    case 'DRAFT':
      return <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-slate-100 text-slate-700"><Edit className="w-3 h-3" />Brouillon</span>
    case 'SENT':
      return <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-700"><Send className="w-3 h-3" />Envoyé</span>
    case 'ACCEPTED':
      return <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-eco-100 text-eco-700"><CheckCircle className="w-3 h-3" />Accepté</span>
    case 'REJECTED':
      return <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-700"><XCircle className="w-3 h-3" />Refusé</span>
    case 'EXPIRED':
      return <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-amber-100 text-amber-700"><AlertCircle className="w-3 h-3" />Expiré</span>
    default:
      return null
  }
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(amount)
}

export default async function AdminDevisPage() {
  const quotes = await prisma.quote.findMany({
    include: {
      artisan: true,
      lead: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  const totalQuotes = quotes.length
  const totalSent = quotes.filter(q => q.status !== 'DRAFT').length
  const totalAccepted = quotes.filter(q => q.status === 'ACCEPTED').length
  const totalRejected = quotes.filter(q => q.status === 'REJECTED').length
  const conversionRate = totalSent > 0 ? Math.round((totalAccepted / totalSent) * 100) : 0
  const totalValue = quotes.filter(q => q.status === 'ACCEPTED').reduce((sum, q) => sum + q.amount, 0)

  const stats = [
    { label: 'Total devis', value: totalQuotes, icon: <FileText className="w-4 h-4" />, color: 'text-slate-600 bg-slate-50' },
    { label: 'Envoyés', value: totalSent, icon: <Send className="w-4 h-4" />, color: 'text-blue-600 bg-blue-50' },
    { label: 'Acceptés', value: totalAccepted, icon: <CheckCircle className="w-4 h-4" />, color: 'text-eco-600 bg-eco-50' },
    { label: 'Taux conversion', value: `${conversionRate}%`, icon: <TrendingUp className="w-4 h-4" />, color: 'text-primary-600 bg-primary-50' },
  ]

  return (
    <div className="p-6 lg:p-8 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Gestion des devis</h1>
        <p className="text-slate-500 mt-1">Tous les devis de la plateforme</p>
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

      {/* Value Card */}
      <div className="bg-gradient-to-br from-eco-500 to-eco-600 rounded-xl p-6 mb-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-eco-100 text-sm font-medium mb-1">Valeur totale des devis acceptés</p>
            <p className="text-3xl font-bold">{formatCurrency(totalValue)}</p>
          </div>
          <TrendingUp className="w-12 h-12 text-eco-200" />
        </div>
      </div>

      {/* Quotes List */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="border-b border-slate-200 p-5">
          <h2 className="font-semibold text-slate-900">Tous les devis ({totalQuotes})</h2>
        </div>

        {quotes.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-500">Aucun devis trouvé</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Artisan</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Client</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Montant</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Statut</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Validité</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Créé le</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {quotes.map((quote) => {
                  const isExpired = new Date(quote.validityDate) < new Date() && quote.status === 'SENT'
                  return (
                    <tr key={quote.id} className="hover:bg-slate-50">
                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-slate-900">{quote.artisan.name}</p>
                        <p className="text-xs text-slate-500">{quote.artisan.city}</p>
                      </td>
                      <td className="px-5 py-4">
                        {quote.lead ? (
                          <>
                            <p className="text-sm font-medium text-slate-900">{quote.lead.firstName} {quote.lead.lastName}</p>
                            <p className="text-xs text-slate-500">{quote.lead.projectType}</p>
                          </>
                        ) : (
                          <span className="text-xs text-slate-400">Lead supprimé</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm font-bold text-slate-900">{formatCurrency(quote.amount)}</p>
                      </td>
                      <td className="px-5 py-4">
                        {getStatusBadge(isExpired ? 'EXPIRED' : quote.status)}
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-xs text-slate-600">{new Date(quote.validityDate).toLocaleDateString('fr-FR')}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-xs text-slate-600">{new Date(quote.createdAt).toLocaleDateString('fr-FR')}</p>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
