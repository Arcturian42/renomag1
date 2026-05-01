export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { getQuotesByArtisan } from '@/app/actions/quotes'
import { FileText, Calendar, ArrowRight, Euro } from 'lucide-react'
import Link from 'next/link'

const QUOTE_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  DRAFT: { label: 'Brouillon', color: 'bg-slate-100 text-slate-700' },
  SENT: { label: 'Envoyé', color: 'bg-primary-100 text-primary-700' },
  ACCEPTED: { label: 'Accepté', color: 'bg-eco-100 text-eco-700' },
  REJECTED: { label: 'Refusé', color: 'bg-red-100 text-red-700' },
  EXPIRED: { label: 'Expiré', color: 'bg-amber-100 text-amber-700' },
}

export default async function DevisPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/connexion')

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: { artisan: true },
  })

  if (!dbUser || dbUser.role !== 'ARTISAN' || !dbUser.artisan) {
    redirect('/espace-proprietaire')
  }

  const result = await getQuotesByArtisan(dbUser.artisan.id)
  const quotes = result.success ? (result.data as any[]) : []

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Mes devis</h1>
        <p className="text-slate-500 mt-1">
          {quotes.length} devis créé{quotes.length > 1 ? 's' : ''}
        </p>
      </div>

      {quotes.length === 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
          <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-slate-900">Aucun devis</h3>
          <p className="text-slate-500 mt-1 max-w-md mx-auto">
            Créez un devis depuis la page Leads pour répondre à une demande.
          </p>
          <Link
            href="/espace-pro/leads"
            className="inline-block mt-4 text-sm font-medium text-primary-600 hover:text-primary-800"
          >
            Voir mes leads →
          </Link>
        </div>
      )}

      <div className="grid gap-4">
        {quotes.map((quote) => {
          const status = QUOTE_STATUS_LABELS[quote.status] || { label: quote.status, color: 'bg-slate-100 text-slate-700' }
          return (
            <div
              key={quote.id}
              className="bg-white rounded-xl border border-slate-200 p-5 hover:border-primary-300 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-semibold text-slate-900">
                      Devis pour {quote.lead?.firstName} {quote.lead?.lastName}
                    </h3>
                    <span className={`text-xs rounded-full px-2 py-0.5 font-medium ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mb-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(quote.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                    <span className="flex items-center gap-1">
                      <Euro className="w-3 h-3" />
                      {quote.totalTTC?.toFixed(2)}€ TTC
                    </span>
                    <span className="text-slate-400">
                      {quote.lineItems?.length || 0} ligne{quote.lineItems?.length > 1 ? 's' : ''}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">
                    {quote.lead?.projectType}
                  </p>
                </div>
                <Link
                  href={`/espace-pro/devis/${quote.id}`}
                  className="flex-shrink-0 text-sm font-medium text-primary-600 hover:text-primary-800 flex items-center gap-1"
                >
                  Détails
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
