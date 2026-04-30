import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ArrowUp, Users, TrendingUp, Euro, Zap, Bot } from 'lucide-react';

const AGENT_STATUS = [
  { name: 'Hermes-Scraper', status: 'active', lastRun: 'Il y a 2 min', tasks: 342 },
  { name: 'Hermes-Enrichment', status: 'active', lastRun: 'Il y a 5 min', tasks: 127 },
  { name: 'Hermes-Content', status: 'active', lastRun: 'Il y a 12 min', tasks: 89 },
  { name: 'Hermes-Outreach', status: 'paused', lastRun: 'Il y a 1h', tasks: 45 },
  { name: 'Hermes-Matching', status: 'active', lastRun: 'Il y a 1 min', tasks: 234 },
  { name: 'Hermes-Analytics', status: 'active', lastRun: 'Il y a 8 min', tasks: 67 },
];

export default async function AdminDashboard() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/connexion');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'ADMIN') redirect('/');

  const [
    { count: artisansCount },
    { count: leadsTotal },
    { count: leadsNew },
    { count: usersCount },
    { data: recentLeads },
  ] = await Promise.all([
    supabase.from('artisan_companies').select('*', { count: 'exact', head: true }),
    supabase.from('leads').select('*', { count: 'exact', head: true }),
    supabase.from('leads').select('*', { count: 'exact', head: true }).eq('status', 'NEW'),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('leads').select('first_name, last_name, project_type, status, created_at').order('created_at', { ascending: false }).limit(5),
  ]);

  const metrics = [
    { label: 'Artisans actifs', value: artisansCount ?? 0, change: 'dans la base', icon: <Users className="w-4 h-4" />, color: 'text-primary-600 bg-primary-50' },
    { label: 'Leads totaux', value: leadsTotal ?? 0, change: `${leadsNew ?? 0} nouveaux`, icon: <TrendingUp className="w-4 h-4" />, color: 'text-eco-600 bg-eco-50' },
    { label: 'Utilisateurs', value: usersCount ?? 0, change: 'inscrits', icon: <Euro className="w-4 h-4" />, color: 'text-accent-600 bg-accent-50' },
    { label: 'Leads en attente', value: leadsNew ?? 0, change: 'non traités', icon: <Zap className="w-4 h-4" />, color: 'text-purple-600 bg-purple-50' },
  ];

  const STATUS_LABELS: Record<string, string> = {
    NEW: 'Nouveau', CONTACTED: 'Contacté', QUALIFIED: 'Qualifié', CONVERTED: 'Converti', REJECTED: 'Rejeté',
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Vue d&apos;ensemble</h1>
          <p className="text-slate-500 mt-1">
            {new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })} — Admin
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-eco-50 border border-eco-200 rounded-full px-3 py-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-eco-500 animate-pulse" />
            <span className="text-xs font-medium text-eco-700">Système actif</span>
          </div>
          <div className="flex items-center gap-1.5 bg-primary-50 border border-primary-200 rounded-full px-3 py-1.5">
            <Bot className="w-3.5 h-3.5 text-primary-600" />
            <span className="text-xs font-medium text-primary-700">Hermes v2.1</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {metrics.map((m) => (
          <div key={m.label} className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${m.color}`}>
                {m.icon}
              </div>
              <span className="flex items-center gap-0.5 text-xs font-medium text-eco-600">
                <ArrowUp className="w-3 h-3" />
              </span>
            </div>
            <div className="text-2xl font-bold text-slate-900">{m.value.toLocaleString('fr-FR')}</div>
            <div className="text-xs text-slate-500 mt-0.5">{m.label}</div>
            <div className="text-xs text-eco-600 font-medium mt-0.5">{m.change}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Agents Hermes */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-slate-900 flex items-center gap-2">
              <Bot className="w-4 h-4 text-primary-600" />
              Agents Hermes
            </h2>
            <a href="/admin/agents" className="text-xs text-primary-600 hover:text-primary-800">Voir tous →</a>
          </div>
          <div className="space-y-3">
            {AGENT_STATUS.map((agent) => (
              <div key={agent.name} className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${agent.status === 'active' ? 'bg-eco-500 animate-pulse' : 'bg-amber-400'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{agent.name}</p>
                  <p className="text-xs text-slate-400">{agent.lastRun}</p>
                </div>
                <span className={`text-xs rounded-full px-2 py-0.5 font-medium ${agent.status === 'active' ? 'bg-eco-100 text-eco-700' : 'bg-amber-100 text-amber-700'}`}>
                  {agent.status === 'active' ? 'Actif' : 'Pausé'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Derniers leads */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-slate-900">Derniers leads</h2>
            <a href="/admin/leads" className="text-xs text-primary-600 hover:text-primary-800">Voir tous →</a>
          </div>
          <div className="space-y-3">
            {(recentLeads ?? []).length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-4">Aucun lead pour l&apos;instant.</p>
            ) : (
              (recentLeads ?? []).map((lead, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-xs font-bold text-primary-700 flex-shrink-0">
                    {lead.first_name?.[0]}{lead.last_name?.[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{lead.first_name} {lead.last_name}</p>
                    <p className="text-xs text-slate-400 truncate">{lead.project_type}</p>
                  </div>
                  <span className="text-xs text-slate-400">{new Date(lead.created_at).toLocaleDateString('fr-FR')}</span>
                  <span className={`text-xs rounded-full px-2 py-0.5 font-medium ${lead.status === 'NEW' ? 'bg-primary-100 text-primary-700' : 'bg-slate-100 text-slate-600'}`}>
                    {STATUS_LABELS[lead.status] ?? lead.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
