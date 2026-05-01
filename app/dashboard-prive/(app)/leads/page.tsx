'use client'

import { useState, useMemo, useEffect } from 'react'
import { getLeads } from '@/lib/dashboard-data'
import DataTable from '@/components/dashboard/DataTable'
import ExportButton from '@/components/dashboard/ExportButton'
import { Filter, X } from 'lucide-react'

const STATUS_OPTIONS = [
  { value: 'ALL', label: 'Tous' },
  { value: 'NEW', label: 'Nouveau' },
  { value: 'CONTACTED', label: 'Contacté' },
  { value: 'QUALIFIED', label: 'Qualifié' },
  { value: 'CONVERTED', label: 'Converti' },
  { value: 'REJECTED', label: 'Rejeté' },
]

const SOURCE_OPTIONS = [
  'Tous',
  'Formulaire devis',
  'Landing page PAC',
  'Landing page Isolation',
  'Facebook Ads',
  'Google Ads',
  'Partenaire',
  'Appel entrant',
]

const CAMPAIGN_OPTIONS = [
  'Toutes',
  'Campagne Hiver 2024',
  'Campagne PAC 2024',
  'Promo Isolation',
  'Google Search - Rénovation',
  'Facebook Lead Gen',
  'Newsletter Janvier',
  'SEO Organique',
]

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const data = await getLeads()
        if (!cancelled) setLeads(data)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [sourceFilter, setSourceFilter] = useState('Tous')
  const [campaignFilter, setCampaignFilter] = useState('Toutes')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const filteredLeads = useMemo(() => {
    let result = [...leads]
    if (statusFilter !== 'ALL') {
      result = result.filter((l) => l.status === statusFilter)
    }
    if (sourceFilter !== 'Tous') {
      result = result.filter((l) => l.source === sourceFilter)
    }
    if (campaignFilter !== 'Toutes') {
      result = result.filter((l) => l.campaign === campaignFilter)
    }
    if (dateFrom) {
      result = result.filter((l) => new Date(l.createdAt) >= new Date(dateFrom))
    }
    if (dateTo) {
      result = result.filter((l) => new Date(l.createdAt) <= new Date(dateTo + 'T23:59:59'))
    }
    return result
  }, [leads, statusFilter, sourceFilter, campaignFilter, dateFrom, dateTo])

  const columns = [
    {
      key: 'firstName',
      header: 'Contact',
      sortable: true,
      render: (l: any) => (
        <div>
          <p className="font-medium text-slate-900">
            {l.firstName} {l.lastName}
          </p>
          <p className="text-xs text-slate-400">{l.email}</p>
        </div>
      ),
    },
    {
      key: 'phone',
      header: 'Téléphone',
      sortable: true,
      render: (l: any) => <span className="text-slate-600 text-sm">{l.phone}</span>,
    },
    {
      key: 'source',
      header: 'Source',
      sortable: true,
      render: (l: any) => (
        <span className="text-xs bg-slate-100 rounded-full px-2 py-0.5 text-slate-600">{l.source}</span>
      ),
    },
    {
      key: 'campaign',
      header: 'Campagne',
      sortable: true,
      render: (l: any) => (
        <span className="text-xs bg-primary-50 rounded-full px-2 py-0.5 text-primary-700">{l.campaign}</span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Date',
      sortable: true,
      render: (l: any) => (
        <span className="text-slate-600 text-sm">
          {new Date(l.createdAt).toLocaleDateString('fr-FR')}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Statut',
      sortable: true,
      render: (l: any) => (
        <span
          className={`text-xs rounded-full px-2 py-0.5 font-medium ${
            l.status === 'NEW'
              ? 'bg-blue-100 text-blue-700'
              : l.status === 'CONTACTED'
              ? 'bg-amber-100 text-amber-700'
              : l.status === 'QUALIFIED'
              ? 'bg-eco-100 text-eco-700'
              : l.status === 'CONVERTED'
              ? 'bg-primary-100 text-primary-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {l.status === 'NEW' && 'Nouveau'}
          {l.status === 'CONTACTED' && 'Contacté'}
          {l.status === 'QUALIFIED' && 'Qualifié'}
          {l.status === 'CONVERTED' && 'Converti'}
          {l.status === 'REJECTED' && 'Rejeté'}
        </span>
      ),
    },
    {
      key: 'score',
      header: 'Score',
      sortable: true,
      render: (l: any) => (
        <div className="flex items-center gap-2">
          <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                (l.score || 0) > 70 ? 'bg-eco-500' : (l.score || 0) > 40 ? 'bg-accent-500' : 'bg-red-500'
              }`}
              style={{ width: `${l.score || 0}%` }}
            />
          </div>
          <span className="text-xs text-slate-500 font-medium">{l.score || 0}</span>
        </div>
      ),
    },
  ]

  const exportColumns = [
    { key: 'firstName', header: 'Prénom' },
    { key: 'lastName', header: 'Nom' },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Téléphone' },
    { key: 'source', header: 'Source' },
    { key: 'campaign', header: 'Campagne' },
    { key: 'status', header: 'Statut' },
    { key: 'score', header: 'Score' },
    { key: 'city', header: 'Ville' },
    { key: 'department', header: 'Département' },
    { key: 'projectType', header: 'Type de projet' },
    { key: 'budget', header: 'Budget' },
    { key: 'createdAt', header: 'Date de création' },
  ]

  function resetFilters() {
    setStatusFilter('ALL')
    setSourceFilter('Tous')
    setCampaignFilter('Toutes')
    setDateFrom('')
    setDateTo('')
  }

  const hasActiveFilters =
    statusFilter !== 'ALL' || sourceFilter !== 'Tous' || campaignFilter !== 'Toutes' || dateFrom || dateTo

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">Leads</h1>
          <p className="text-slate-500 mt-1">Gérez et suivez tous vos leads</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset transition-all ${
              showFilters || hasActiveFilters
                ? 'bg-primary-50 text-primary-700 ring-primary-200'
                : 'bg-white text-slate-700 ring-slate-300 hover:bg-slate-50'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filtres
            {hasActiveFilters && (
              <span className="ml-1 w-2 h-2 rounded-full bg-primary-500" />
            )}
          </button>
          <ExportButton data={filteredLeads} columns={exportColumns} filename="leads-export.csv" />
        </div>
      </div>

      {showFilters && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">Filtres avancés</h3>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-medium"
              >
                <X className="w-3.5 h-3.5" />
                Réinitialiser
              </button>
            )}
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label htmlFor="filter-status" className="block text-xs font-medium text-slate-500 mb-1.5">Statut</label>
              <select
                id="filter-status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="filter-source" className="block text-xs font-medium text-slate-500 mb-1.5">Source</label>
              <select
                id="filter-source"
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              >
                {SOURCE_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="filter-campaign" className="block text-xs font-medium text-slate-500 mb-1.5">Campagne</label>
              <select
                id="filter-campaign"
                value={campaignFilter}
                onChange={(e) => setCampaignFilter(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              >
                {CAMPAIGN_OPTIONS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="filter-date-from" className="block text-xs font-medium text-slate-500 mb-1.5">Date début</label>
              <input
                id="filter-date-from"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
            <div>
              <label htmlFor="filter-date-to" className="block text-xs font-medium text-slate-500 mb-1.5">Date fin</label>
              <input
                id="filter-date-to"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm text-center text-slate-400">
          Chargement des leads...
        </div>
      ) : (
        <DataTable
          data={filteredLeads}
          columns={columns as any}
          searchKeys={['firstName', 'lastName', 'email', 'phone', 'city', 'projectType']}
          itemsPerPage={20}
        />
      )}
    </div>
  )
}
