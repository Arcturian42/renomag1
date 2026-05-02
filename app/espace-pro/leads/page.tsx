'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, Phone, Mail, MapPin, Euro, Clock, ShoppingCart } from 'lucide-react'
import { getArtisanLeads, getMatchedLeadsForArtisan, purchaseLead, updateLeadStatus } from '@/app/actions/leads'
import { createClient } from '@/lib/supabase/client'

type LeadStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'CONVERTED' | 'REJECTED'

const STATUS_CONFIG: Record<LeadStatus, { label: string; color: string; dot: string }> = {
  NEW: { label: 'Nouveau', color: 'bg-primary-100 text-primary-700', dot: 'bg-primary-500' },
  CONTACTED: { label: 'Contacté', color: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
  QUALIFIED: { label: 'Qualifié', color: 'bg-purple-100 text-purple-700', dot: 'bg-purple-500' },
  CONVERTED: { label: 'Converti', color: 'bg-eco-100 text-eco-700', dot: 'bg-eco-500' },
  REJECTED: { label: 'Rejeté', color: 'bg-red-100 text-red-700', dot: 'bg-red-400' },
}

export default function LeadsPage() {
  const [activeTab, setActiveTab] = useState<'available' | 'mine'>('available')
  const [availableLeads, setAvailableLeads] = useState<any[]>([])
  const [myLeads, setMyLeads] = useState<any[]>([])
  const [selectedLead, setSelectedLead] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [purchaseLoading, setPurchaseLoading] = useState<string | null>(null)
  const [statusLoading, setStatusLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchLeads() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: dbUser } = await supabase
        .from('ArtisanCompany')
        .select('id')
        .eq('userId', user.id)
        .single()

      if (!dbUser?.id) {
        setLoading(false)
        return
      }

      try {
        const [matched, owned] = await Promise.all([
          getMatchedLeadsForArtisan(dbUser.id),
          getArtisanLeads(dbUser.id),
        ])
        setAvailableLeads(matched)
        setMyLeads(owned)
        if (activeTab === 'available' && matched.length > 0) {
          setSelectedLead(matched[0])
        } else if (activeTab === 'mine' && owned.length > 0) {
          setSelectedLead(owned[0])
        }
      } catch (e: any) {
        setError(e.message)
      }
      setLoading(false)
    }

    fetchLeads()
  }, [activeTab])

  const handlePurchase = async (leadId: string) => {
    setPurchaseLoading(leadId)
    setError(null)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: dbUser } = await supabase
        .from('ArtisanCompany')
        .select('id')
        .eq('userId', user.id)
        .single()

      if (!dbUser?.id) return

      const result = await purchaseLead(dbUser.id, leadId)
      if (result.success) {
        // Refresh
        const [matched, owned] = await Promise.all([
          getMatchedLeadsForArtisan(dbUser.id),
          getArtisanLeads(dbUser.id),
        ])
        setAvailableLeads(matched)
        setMyLeads(owned)
        if (owned.length > 0) setSelectedLead(owned[0])
        setActiveTab('mine')
      } else {
        setError(result.error || 'Erreur lors de l\'achat')
      }
    } catch (e: any) {
      setError(e.message)
    }
    setPurchaseLoading(null)
  }

  const currentList = activeTab === 'available' ? availableLeads : myLeads

  if (loading) {
    return (
      <div className="p-6 lg:p-8 h-full flex items-center justify-center">
        <p className="text-slate-500">Chargement des leads...</p>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Leads</h1>
          <p className="text-slate-500 mt-0.5">
            {availableLeads.length} disponibles · {myLeads.length} achetés
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Chercher..."
              className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400"
            />
          </div>
          <button className="flex items-center gap-1.5 px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            Filtres
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-5">
        <button
          onClick={() => { setActiveTab('available'); setSelectedLead(availableLeads[0] || null) }}
          className={`px-4 py-2 rounded-full text-xs font-medium transition-colors ${
            activeTab === 'available'
              ? 'bg-primary-800 text-white'
              : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
          }`}
        >
          Disponibles ({availableLeads.length})
        </button>
        <button
          onClick={() => { setActiveTab('mine'); setSelectedLead(myLeads[0] || null) }}
          className={`px-4 py-2 rounded-full text-xs font-medium transition-colors ${
            activeTab === 'mine'
              ? 'bg-primary-800 text-white'
              : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
          }`}
        >
          Mes leads ({myLeads.length})
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Split view */}
      <div className="flex gap-5 flex-1 overflow-hidden">
        {/* List */}
        <div className="w-80 flex-shrink-0 space-y-2 overflow-y-auto">
          {currentList.length === 0 && (
            <p className="text-sm text-slate-500 p-4">
              {activeTab === 'available'
                ? 'Aucun lead disponible pour le moment. Vérifiez vos spécialités et département.'
                : 'Vous n\'avez acheté aucun lead pour le moment.'}
            </p>
          )}
          {currentList.map((lead: any) => {
            const statusKey = lead.status as LeadStatus
            const statusConf = STATUS_CONFIG[statusKey]
            const isHot = lead.temperature === 'HOT'
            return (
              <div
                key={lead.id}
                onClick={() => setSelectedLead(lead)}
                className={`bg-white rounded-xl border p-4 cursor-pointer transition-all ${
                  selectedLead?.id === lead.id
                    ? 'border-primary-400 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {lead.firstName} {lead.lastName}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                      <MapPin className="w-2.5 h-2.5" />
                      {lead.city || lead.zipCode}
                    </div>
                  </div>
                  <span className={`text-xs rounded-full px-2 py-0.5 font-medium ${statusConf.color}`}>
                    {statusConf.label}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mb-2 line-clamp-1">{lead.projectType}</p>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-medium text-slate-700">{lead.budget || '—'}</span>
                  <div className="flex items-center gap-1">
                    {isHot && <span className="text-accent-600 font-bold">🔥 CHAUD</span>}
                    <Clock className="w-2.5 h-2.5" />
                    {new Date(lead.createdAt).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Detail */}
        {selectedLead && (
          <div className="flex-1 bg-white rounded-xl border border-slate-200 p-6 overflow-y-auto">
            <div className="flex items-start justify-between mb-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {selectedLead.firstName} {selectedLead.lastName}
                </h2>
                <p className="text-sm text-slate-500 mt-0.5">{selectedLead.projectType}</p>
              </div>
              <div className="flex items-center gap-2">
                {selectedLead.temperature === 'HOT' && (
                  <span className="text-xs font-bold bg-accent-100 text-accent-700 rounded-full px-2 py-0.5">
                    🔥 LEAD CHAUD — 70€
                  </span>
                )}
                {selectedLead.temperature === 'COLD' && (
                  <span className="text-xs font-bold bg-slate-100 text-slate-600 rounded-full px-2 py-0.5">
                    LEAD FROID — 20€
                  </span>
                )}
              </div>
            </div>

            {/* Contact info */}
            {activeTab === 'mine' ? (
              <div className="grid sm:grid-cols-2 gap-3 mb-6">
                <a href={`tel:${selectedLead.phone}`} className="flex items-center gap-2 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                  <Phone className="w-4 h-4 text-primary-600" />
                  <span className="text-sm font-medium text-slate-900">{selectedLead.phone}</span>
                </a>
                <a href={`mailto:${selectedLead.email}`} className="flex items-center gap-2 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                  <Mail className="w-4 h-4 text-primary-600" />
                  <span className="text-sm font-medium text-slate-900 truncate">{selectedLead.email}</span>
                </a>
              </div>
            ) : (
              <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-sm text-slate-600">
                  Contact masqué — achetez ce lead pour débloquer le téléphone et l&apos;email.
                </p>
              </div>
            )}

            {/* Project details */}
            <div className="space-y-4 mb-6">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Projet</p>
                <p className="text-sm text-slate-900">{selectedLead.projectType}</p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider mb-1">Localisation</p>
                  <p className="text-sm text-slate-900">{selectedLead.city || selectedLead.zipCode}</p>
                  <p className="text-xs text-slate-500">{selectedLead.department}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider mb-1">Budget</p>
                  <p className="text-sm font-bold text-slate-900">{selectedLead.budget || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider mb-1">Score</p>
                  <p className="text-sm font-bold text-primary-600">{selectedLead.score ?? '—'}/100</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              {activeTab === 'available' && (
                <button
                  onClick={() => handlePurchase(selectedLead.id)}
                  disabled={purchaseLoading === selectedLead.id}
                  className="btn-primary flex items-center gap-2"
                >
                  {purchaseLoading === selectedLead.id ? (
                    <>Traitement...</>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      Acheter — {selectedLead.price / 100}€
                    </>
                  )}
                </button>
              )}
              {activeTab === 'mine' && (
                <>
                  <select
                    className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                    value={selectedLead.status}
                    disabled={statusLoading === selectedLead.id}
                    onChange={async (e) => {
                      const newStatus = e.target.value as LeadStatus
                      setStatusLoading(selectedLead.id)
                      try {
                        await updateLeadStatus(selectedLead.id, newStatus)
                        setMyLeads(prev => prev.map(l => l.id === selectedLead.id ? { ...l, status: newStatus } : l))
                        setSelectedLead({ ...selectedLead, status: newStatus })
                      } catch (e: any) {
                        setError(e.message)
                      }
                      setStatusLoading(null)
                    }}
                  >
                    {Object.entries(STATUS_CONFIG).map(([key, conf]) => (
                      <option key={key} value={key}>{conf.label}</option>
                    ))}
                  </select>
                  <button className="btn-primary">
                    <Euro className="w-4 h-4" />
                    Envoyer un devis
                  </button>
                  <button className="btn-secondary">
                    <Phone className="w-4 h-4" />
                    Appeler
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
