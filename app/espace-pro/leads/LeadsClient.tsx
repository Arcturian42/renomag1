'use client';

import { useState } from 'react';
import { Search, Phone, Mail, MapPin, Clock } from 'lucide-react';

type Lead = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  zip_code: string;
  department: string;
  project_type: string;
  description?: string;
  budget?: string;
  status: string;
  score?: number;
  created_at: string;
};

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  NEW: { label: 'Nouveau', color: 'bg-primary-100 text-primary-700' },
  CONTACTED: { label: 'Contacté', color: 'bg-amber-100 text-amber-700' },
  QUALIFIED: { label: 'Qualifié', color: 'bg-purple-100 text-purple-700' },
  CONVERTED: { label: 'Gagné', color: 'bg-eco-100 text-eco-700' },
  REJECTED: { label: 'Rejeté', color: 'bg-red-100 text-red-700' },
};

export default function LeadsClient({ leads }: { leads: Lead[] }) {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(leads[0] ?? null);
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [localLeads, setLocalLeads] = useState<Lead[]>(leads);

  const filtered = localLeads.filter((l) => {
    const matchesFilter = activeFilter === 'all' || l.status === activeFilter;
    const matchesSearch =
      !search ||
      `${l.first_name} ${l.last_name} ${l.project_type} ${l.zip_code}`
        .toLowerCase()
        .includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const counts = {
    all: localLeads.length,
    NEW: localLeads.filter((l) => l.status === 'NEW').length,
    CONTACTED: localLeads.filter((l) => l.status === 'CONTACTED').length,
    QUALIFIED: localLeads.filter((l) => l.status === 'QUALIFIED').length,
    CONVERTED: localLeads.filter((l) => l.status === 'CONVERTED').length,
    REJECTED: localLeads.filter((l) => l.status === 'REJECTED').length,
  };

  const updateStatus = async (leadId: string, newStatus: string) => {
    setUpdatingId(leadId);
    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setLocalLeads((prev) =>
          prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
        );
        if (selectedLead?.id === leadId) {
          setSelectedLead((prev) => prev ? { ...prev, status: newStatus } : null);
        }
      }
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="p-6 lg:p-8 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Leads</h1>
          <p className="text-slate-500 mt-0.5">{localLeads.length} leads au total</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Chercher..."
            className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1">
        {[
          { key: 'all', label: 'Tous' },
          { key: 'NEW', label: 'Nouveaux' },
          { key: 'CONTACTED', label: 'Contactés' },
          { key: 'QUALIFIED', label: 'Qualifiés' },
          { key: 'CONVERTED', label: 'Gagnés' },
          { key: 'REJECTED', label: 'Rejetés' },
        ].map((tab) => (
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
            <span className={`text-xs rounded-full px-1.5 ${activeFilter === tab.key ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
              {counts[tab.key as keyof typeof counts]}
            </span>
          </button>
        ))}
      </div>

      <div className="flex gap-5 flex-1 overflow-hidden">
        <div className="w-80 flex-shrink-0 space-y-2 overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">Aucun lead trouvé.</p>
          ) : (
            filtered.map((lead) => {
              const statusConf = STATUS_CONFIG[lead.status] ?? STATUS_CONFIG.NEW;
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
                        {lead.first_name} {lead.last_name}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                        <MapPin className="w-2.5 h-2.5" />
                        {lead.zip_code}
                      </div>
                    </div>
                    <span className={`text-xs rounded-full px-2 py-0.5 font-medium ${statusConf.color}`}>
                      {statusConf.label}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mb-2 line-clamp-1">{lead.project_type}</p>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-medium text-slate-700">{lead.budget ?? '—'}</span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      {new Date(lead.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {selectedLead && (
          <div className="flex-1 bg-white rounded-xl border border-slate-200 p-6 overflow-y-auto">
            <div className="flex items-start justify-between mb-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {selectedLead.first_name} {selectedLead.last_name}
                </h2>
                <p className="text-sm text-slate-500 mt-0.5">CP {selectedLead.zip_code} — Dép. {selectedLead.department}</p>
              </div>
              <span className={`text-sm rounded-full px-3 py-1 font-medium ${(STATUS_CONFIG[selectedLead.status] ?? STATUS_CONFIG.NEW).color}`}>
                {(STATUS_CONFIG[selectedLead.status] ?? STATUS_CONFIG.NEW).label}
              </span>
            </div>

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

            <div className="space-y-4 mb-6">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Projet</p>
                <p className="text-sm text-slate-900">{selectedLead.project_type}</p>
              </div>
              {selectedLead.description && (
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Description</p>
                  <p className="text-sm text-slate-700">{selectedLead.description}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider mb-1">Budget</p>
                  <p className="text-sm font-bold text-slate-900">{selectedLead.budget ?? '—'}</p>
                </div>
                {selectedLead.score !== undefined && (
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider mb-1">Score</p>
                    <p className="text-sm font-bold text-primary-700">{selectedLead.score}/100</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <select
                value={selectedLead.status}
                onChange={(e) => updateStatus(selectedLead.id, e.target.value)}
                disabled={updatingId === selectedLead.id}
                className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              >
                {Object.entries(STATUS_CONFIG).map(([key, conf]) => (
                  <option key={key} value={key}>{conf.label}</option>
                ))}
              </select>
              <a href={`tel:${selectedLead.phone}`} className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700">
                <Phone className="w-4 h-4" />
                Appeler
              </a>
              <a href={`mailto:${selectedLead.email}`} className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50">
                <Mail className="w-4 h-4" />
                Email
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
