'use client'

import { useState, useEffect, useTransition } from 'react'
import { Search, Filter, Phone, Mail, MapPin, Euro, Clock, Send } from 'lucide-react'
import { getArtisanLeads, updateLeadStatus, updateLeadNotes } from '@/app/actions/data'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

// Frontend status types (UI labels)
type UIStatus = 'new' | 'contacted' | 'devis_sent' | 'won' | 'lost'

const STATUS_CONFIG: Record<UIStatus, { label: string; color: string; dot: string; dbValue: string }> = {
  new: { label: 'Nouveau', color: 'bg-primary-100 text-primary-700', dot: 'bg-primary-500', dbValue: 'NEW' },
  contacted: { label: 'Contacté', color: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500', dbValue: 'CONTACTED' },
  devis_sent: { label: 'Devis envoyé', color: 'bg-purple-100 text-purple-700', dot: 'bg-purple-500', dbValue: 'QUALIFIED' },
  won: { label: 'Gagné', color: 'bg-eco-100 text-eco-700', dot: 'bg-eco-500', dbValue: 'CONVERTED' },
  lost: { label: 'Perdu', color: 'bg-red-100 text-red-700', dot: 'bg-red-400', dbValue: 'REJECTED' },
}

const DB_TO_UI: Record<string, UIStatus> = {
  NEW: 'new',
  CONTACTED: 'contacted',
  QUALIFIED: 'devis_sent',
  CONVERTED: 'won',
  REJECTED: 'lost',
}

function toUIStatus(dbStatus: string): UIStatus {
  return (DB_TO_UI[dbStatus] as UIStatus) || 'new'
}

function toDBStatus(uiStatus: UIStatus): string {
  return STATUS_CONFIG[uiStatus].dbValue
}

export default function LeadsPage() {
  const [activeFilter, setActiveFilter] = useState<'all' | UIStatus>('all')
  const [leads, setLeads] = useState<any[]>([])
  const [selectedLead, setSelectedLead] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [notes, setNotes] = useState('')
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState('')

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
        setNotes(artisanLeads[0].notes || '')
      }
      setLoading(false)
    }

    fetchLeads()
  }, [])

  const filtered = activeFilter === 'all'
    ? leads
    : leads.filter((l) => toUIStatus(l.status) === activeFilter)

  const counts = {
    all: leads.length,
    new: leads.filter((l) => toUIStatus(l.status) === 'new').length,
    contacted: leads.filter((l) => toUIStatus(l.status) === 'contacted').length,
    devis_sent: leads.filter((l) => toUIStatus(l.status) === 'devis_sent').length,
    won: leads.filter((l) => toUIStatus(l.status) === 'won').length,
    lost: leads.filter((l) => toUIStatus(l.status) === 'lost').length,
  }

  function handleSelectLead(lead: any) {
    setSelectedLead(lead)
    setNotes(lead.notes || '')
    setMessage('')
  }

  function handleStatusChange(uiStatus: UIStatus) {
    if (!selectedLead) return
    const dbStatus = toDBStatus(uiStatus)
    startTransition(async () => {
      const res = await updateLeadStatus(selectedLead.id, dbStatus)
      if (res) {
        setLeads((prev) => prev.map((l) => l.id === selectedLead.id ? { ...l, status: dbStatus } : l))
        setSelectedLead({ ...selectedLead, status: dbStatus })
        setMessage('Statut mis à jour')
        setTimeout(() => setMessage(''), 2000)
      }
    })
  }

  function handleSaveNotes() {
    if (!selectedLead) return
    startTransition(async () => {
      await updateLeadNotes(selectedLead.id, notes)
      setLeads((prev) => prev.map((l) => l.id === selectedLead.id ? { ...l, notes } : l))
      setMessage('Notes sauvegardées')
      setTimeout(() => setMessage(''), 2000)
    })
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
        ] as { key: 'all' | UIStatus; label: string }[]).map((tab) => (
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
            const uiStatus = toUIStatus(lead.status)
            const statusConf = STATUS_CONFIG[uiStatus]
            return (
              <button
                key={lead.id}
                type="button"
                onClick={() => handleSelectLead(lead)}
                className={`w-full text-left bg-white rounded-xl border p-4 transition-all ${
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
                      {lead.city || lead.department}
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
                    <Clock className="w-2.5 h-2.5" />
                    {new Date(lead.createdAt).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </div>
                </div>
              </button>
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
              <span
                className={`text-sm rounded-full px-3 py-1 font-medium ${
                  STATUS_CONFIG[toUIStatus(selectedLead.status)].color
                }`}
              >
                {STATUS_CONFIG[toUIStatus(selectedLead.status)].label}
              </span>
            </div>

            {message && (
              <div className="mb-4 text-sm text-eco-700 bg-eco-50 rounded-lg px-3 py-2">{message}</div>
            )}

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
                <p className="text-sm text-slate-900">{selectedLead.projectType}</p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider mb-1">
                    Localisation
                  </p>
                  <p className="text-sm text-slate-900">{selectedLead.city || '—'}</p>
                  <p className="text-xs text-slate-500">{selectedLead.zipCode}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider mb-1">
                    Budget
                  </p>
                  <p className="text-sm font-bold text-slate-900">{selectedLead.budget || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider mb-1">
                    Score
                  </p>
                  <p className="text-sm font-bold text-eco-600">{selectedLead.score ?? '—'}/100</p>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="mb-6">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Notes
              </p>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Ajoutez une note..."
                className="input-field resize-none text-sm w-full"
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={handleSaveNotes}
                  disabled={isPending}
                  className="text-xs font-medium text-primary-700 hover:text-primary-900 disabled:opacity-50"
                >
                  {isPending ? 'Sauvegarde...' : 'Sauvegarder les notes'}
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <select
                className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                value={toUIStatus(selectedLead.status)}
                onChange={(e) => handleStatusChange(e.target.value as UIStatus)}
                disabled={isPending}
              >
                {Object.entries(STATUS_CONFIG).map(([key, conf]) => (
                  <option key={key} value={key}>
                    {conf.label}
                  </option>
                ))}
              </select>
              <Link
                href={`/espace-pro/messages?to=${selectedLead.email}`}
                className="btn-primary flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Envoyer un message
              </Link>
              <a
                href={`tel:${selectedLead.phone}`}
                className="btn-secondary flex items-center gap-2"
              >
                <Phone className="w-4 h-4" />
                Appeler
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
