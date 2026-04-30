'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, Phone, Mail, MapPin, Euro, Clock } from 'lucide-react'
import { getArtisanLeads } from '@/app/actions/data'
import { createClient } from '@/lib/supabase/client'

type LeadStatus = 'new' | 'contacted' | 'devis_sent' | 'won' | 'lost'

const STATUS_CONFIG: Record<LeadStatus, { label: string; color: string; dot: string }> = {
  new: { label: 'Nouveau', color: 'bg-primary-100 text-primary-700', dot: 'bg-primary-500' },
  contacted: { label: 'Contacté', color: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
  devis_sent: { label: 'Devis envoyé', color: 'bg-purple-100 text-purple-700', dot: 'bg-purple-500' },
  won: { label: 'Gagné', color: 'bg-eco-100 text-eco-700', dot: 'bg-eco-500' },
  lost: { label: 'Perdu', color: 'bg-red-100 text-red-700', dot: 'bg-red-400' },
}

export default function LeadsPage() {
  const [activeFilter, setActiveFilter] = useState<'all' | LeadStatus>('all')
  const [leads, setLeads] = useState<any[]>([])
  const [selectedLead, setSelectedLead] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchLeads() {
      const supabase = await createClient()
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

      const artisanLeads = await getArtisanLeads(dbUser.id)
      setLeads(artisanLeads)
      if (artisanLeads.length > 0) {
        setSelectedLead(artisanLeads[0])
      }
      setLoading(false)
    }

    fetchLeads()
  }, [])

  const filtered = activeFilter === 'all'
    ? leads
    : leads.filter((l) => l.status === activeFilter)

  const counts = {
    all: leads.length,
    new: leads.filter((l) => l.status === 'new').length,
    contacted: leads.filter((l) => l.status === 'contacted').length,
    devis_sent: leads.filter((l) => l.status === 'devis_sent').length,
    won: leads.filter((l) => l.status === 'won').length,
    lost: leads.filter((l) => l.status === 'lost').length,
  }

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
          <p className="text-slate-500 mt-0.5">{leads.length} leads ce mois</p>
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

      {/* Status tabs */}
      <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1">
        {([
          { key: 'all', label: 'Tous' },
          { key: 'new', label: 'Nouveaux' },
          { key: 'contacted', label: 'Contactés' },
          { key: 'devis_sent', label: 'Devis envoyés' },
          { key: 'won', label: 'Gagnés' },
          { key: 'lost', label: 'Perdus' },
        ] as { key: 'all' | LeadStatus; label: string }[]).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveFilter(tab.key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              activeFilter === tab.key
                ? 'bg-primary-800 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            {tab.label}
            <span
              className={`text-xs rounded-full px-1.5 ${
                activeFilter === tab.key ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
              }`}
            >
              {counts[tab.key]}
            </span>
          </button>
        ))}
      </div>

      {/* Split view */}
      <div className="flex gap-5 flex-1 overflow-hidden">
        {/* List */}
        <div className="w-80 flex-shrink-0 space-y-2 overflow-y-auto">
          {filtered.length === 0 && (
            <p className="text-sm text-slate-500 p-4">Aucun lead dans cette catégorie.</p>
          )}
          {filtered.map((lead) => {
            const statusConf = STATUS_CONFIG[lead.status as LeadStatus]
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
                      {lead.city}
                    </div>
                  </div>
                  <span className={`text-xs rounded-full px-2 py-0.5 font-medium ${statusConf.color}`}>
                    {statusConf.label}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mb-2 line-clamp-1">{lead.project}</p>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-medium text-slate-700">{lead.budget}</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    {new Date(lead.date).toLocaleDateString('fr-FR', {
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
                <p className="text-sm text-slate-500 mt-0.5">{selectedLead.property}</p>
              </div>
              <span
                className={`text-sm rounded-full px-3 py-1 font-medium ${
                  STATUS_CONFIG[selectedLead.status as LeadStatus].color
                }`}
              >
                {STATUS_CONFIG[selectedLead.status as LeadStatus].label}
              </span>
            </div>

            {/* Contact info */}
            <div className="grid sm:grid-cols-2 gap-3 mb-6">
              <a
                href={`tel:${selectedLead.phone}`}
                className="flex items-center gap-2 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <Phone className="w-4 h-4 text-primary-600" />
                <span className="text-sm font-medium text-slate-900">{selectedLead.phone}</span>
              </a>
              <a
                href={`mailto:${selectedLead.email}`}
                className="flex items-center gap-2 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <Mail className="w-4 h-4 text-primary-600" />
                <span className="text-sm font-medium text-slate-900 truncate">
                  {selectedLead.email}
                </span>
              </a>
            </div>

            {/* Project details */}
            <div className="space-y-4 mb-6">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Projet
                </p>
                <p className="text-sm text-slate-900">{selectedLead.project}</p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider mb-1">
                    Localisation
                  </p>
                  <p className="text-sm text-slate-900">{selectedLead.city}</p>
                  <p className="text-xs text-slate-500">{selectedLead.zipCode}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider mb-1">
                    Budget
                  </p>
                  <p className="text-sm font-bold text-slate-900">{selectedLead.budget}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider mb-1">
                    Aides estimées
                  </p>
                  <p className="text-sm font-bold text-eco-600">{selectedLead.estimatedSubsidy}</p>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="mb-6">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Notes
              </p>
              <textarea
                defaultValue={selectedLead.notes}
                rows={3}
                placeholder="Ajoutez une note..."
                className="input-field resize-none text-sm"
              />
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <select
                className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                defaultValue={selectedLead.status}
              >
                {Object.entries(STATUS_CONFIG).map(([key, conf]) => (
                  <option key={key} value={key}>
                    {conf.label}
                  </option>
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
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
