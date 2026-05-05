'use client'

import { useState } from 'react'
import { MapPin, Flame, Snowflake, ShoppingCart } from 'lucide-react'
import { purchaseLead } from '@/app/actions/leads'

interface Lead {
  id: string
  firstName: string
  lastName: string
  city: string | null
  zipCode: string
  department: string
  projectType: string
  price: number
  temperature: 'HOT' | 'COLD'
  createdAt: Date
}

interface AvailableLeadsSectionProps {
  leads: Lead[]
  artisanId: string
}

export default function AvailableLeadsSection({ leads: initialLeads, artisanId }: AvailableLeadsSectionProps) {
  const [leads, setLeads] = useState(initialLeads)
  const [purchaseLoading, setPurchaseLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handlePurchase = async (leadId: string) => {
    console.log('[Dashboard] Starting purchase for lead:', leadId)
    setPurchaseLoading(leadId)
    setError(null)
    setSuccess(null)

    try {
      const result = await purchaseLead(artisanId, leadId)
      console.log('[Dashboard] Purchase result:', result)

      if (result.success) {
        // Remove purchased lead from list
        setLeads(prev => prev.filter(l => l.id !== leadId))
        setSuccess('Lead acheté avec succès ! Consultez vos leads dans l\'onglet "Mes leads".')

        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000)
      } else {
        setError(result.error || 'Erreur lors de l\'achat du lead')
      }
    } catch (e: any) {
      console.error('[Dashboard] Error purchasing lead:', e)
      setError('Une erreur inattendue est survenue')
    } finally {
      setPurchaseLoading(null)
    }
  }

  return (
    <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-semibold text-slate-900">Leads disponibles</h2>
        <a
          href="/espace-pro/leads"
          className="text-xs text-primary-600 hover:text-primary-800 font-medium"
        >
          Voir tous →
        </a>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 rounded-lg bg-eco-50 border border-eco-200 text-sm text-eco-700">
          {success}
        </div>
      )}

      <div className="space-y-3">
        {leads.length === 0 && (
          <div className="text-center py-8">
            <p className="text-sm text-slate-500 mb-2">Aucun lead disponible pour le moment.</p>
            <p className="text-xs text-slate-400">
              Les leads correspondant à vos spécialités et département apparaîtront ici.
            </p>
          </div>
        )}

        {leads.map((lead) => {
          const isHot = lead.temperature === 'HOT'
          const price = lead.price / 100
          const isPurchasing = purchaseLoading === lead.id

          return (
            <div
              key={lead.id}
              className="border border-slate-200 rounded-lg p-4 hover:border-primary-300 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-slate-900">
                      {lead.firstName} {lead.lastName}
                    </h3>
                    {isHot ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold bg-accent-100 text-accent-700 rounded-full px-2 py-0.5">
                        <Flame className="w-3 h-3" />
                        CHAUD
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium bg-slate-100 text-slate-600 rounded-full px-2 py-0.5">
                        <Snowflake className="w-3 h-3" />
                        FROID
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-500 mb-2">
                    <MapPin className="w-3 h-3" />
                    {lead.city || lead.zipCode} ({lead.department})
                  </div>
                  <p className="text-sm text-slate-700 mb-3">{lead.projectType}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-primary-700">{price}€</p>
                </div>
              </div>

              <button
                onClick={() => handlePurchase(lead.id)}
                disabled={isPurchasing}
                className="w-full btn-primary flex items-center justify-center gap-2 text-sm py-2"
              >
                {isPurchasing ? (
                  <>Traitement...</>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    Acheter ce lead
                  </>
                )}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
