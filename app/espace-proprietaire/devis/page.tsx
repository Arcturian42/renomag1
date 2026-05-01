export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { getQuotesByLead } from '@/app/actions/quotes'
import { updateQuoteStatus } from '@/app/actions/quotes'
import { FileText, Calendar, Euro, CheckCircle, XCircle } from 'lucide-react'

const QUOTE_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  DRAFT: { label: 'Brouillon', color: 'bg-slate-100 text-slate-700' },
  SENT: { label: 'Reçu', color: 'bg-primary-100 text-primary-700' },
  ACCEPTED: { label: 'Accepté', color: 'bg-eco-100 text-eco-700' },
  REJECTED: { label: 'Refusé', color: 'bg-red-100 text-red-700' },
  EXPIRED: { label: 'Expiré', color: 'bg-amber-100 text-amber-700' },
}

export default async function ProprietaireDevisPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/connexion')

  const leads = await prisma.lead.findMany({
    where: { email: user.email! },
    orderBy: { createdAt: 'desc' },
  })

  const allQuotes: any[] = []
  for (const lead of leads) {
    const result = await getQuotesByLead(lead.id)
    if (result.success && result.data) {
      allQuotes.push(...(result.data as any[]).map((q) => ({ ...q, lead })))
    }
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Mes devis</h1>
        <p className="text-slate-500 mt-1">
          {allQuotes.length} devis reçu{allQuotes.length > 1 ? 's' : ''}
        </p>
      </div>

      {allQuotes.length === 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
          <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-slate-900">Aucun devis</h3>
          <p className="text-slate-500 mt-1">
            Vous recevrez ici les devis des artisans intéressés par votre projet.
          </p>
        </div>
      )}

      <div className="grid gap-4">
        {allQuotes.map((quote) => {
          const status = QUOTE_STATUS_LABELS[quote.status] || { label: quote.status, color: 'bg-slate-100 text-slate-700' }
          const isSent = quote.status === 'SENT'
          return (
            <div
              key={quote.id}
              className="bg-white rounded-xl border border-slate-200 p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-semibold text-slate-900">
                      {quote.artisan?.name}
                    </h3>
                    <span className={`text-xs rounded-full px-2 py-0.5 font-medium ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(quote.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                    <span className="flex items-center gap-1">
                      <Euro className="w-3 h-3" />
                      {quote.totalHT?.toFixed(2)}€ HT / {quote.totalTTC?.toFixed(2)}€ TTC
                    </span>
                    <span className="text-slate-400">
                      Valide {quote.validityDays} jours
                    </span>
                  </div>

                  {quote.lineItems && quote.lineItems.length > 0 && (
                    <div className="border border-slate-100 rounded-lg overflow-hidden mb-4">
                      <table className="w-full text-sm">
                        <thead className="bg-slate-50 text-xs text-slate-500">
                          <tr>
                            <th className="text-left px-3 py-2">Désignation</th>
                            <th className="text-right px-3 py-2">Qté</th>
                            <th className="text-right px-3 py-2">P.U. HT</th>
                            <th className="text-right px-3 py-2">Total HT</th>
                          </tr>
                        </thead>
                        <tbody>
                          {quote.lineItems.map((item: any) => (
                            <tr key={item.id} className="border-t border-slate-50">
                              <td className="px-3 py-2 text-slate-700">{item.designation}</td>
                              <td className="px-3 py-2 text-right text-slate-600">{item.quantity}</td>
                              <td className="px-3 py-2 text-right text-slate-600">{item.unitPrice.toFixed(2)}€</td>
                              <td className="px-3 py-2 text-right font-medium text-slate-900">{item.total.toFixed(2)}€</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {quote.notes && (
                    <p className="text-sm text-slate-600 mb-3">{quote.notes}</p>
                  )}
                </div>
              </div>

              {isSent && (
                <div className="flex gap-3 mt-3 pt-3 border-t border-slate-100">
                  <form
                    action={async () => {
                      'use server'
                      await updateQuoteStatus(quote.id, 'ACCEPTED')
                    }}
                  >
                    <button
                      type="submit"
                      className="btn-primary text-sm px-4 py-2 flex items-center gap-1.5"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Accepter
                    </button>
                  </form>
                  <form
                    action={async () => {
                      'use server'
                      await updateQuoteStatus(quote.id, 'REJECTED')
                    }}
                  >
                    <button
                      type="submit"
                      className="btn-secondary text-sm px-4 py-2 flex items-center gap-1.5"
                    >
                      <XCircle className="w-4 h-4" />
                      Refuser
                    </button>
                  </form>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
