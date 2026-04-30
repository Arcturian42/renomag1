import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { TrendingUp, Users, BarChart3 } from 'lucide-react';

export default async function AdminLeadsPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/connexion');

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'ADMIN') redirect('/');

  const { data: leads } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });

  const all = leads ?? [];
  const byStatus = (s: string) => all.filter((l) => l.status === s).length;
  const byDept = all.reduce((acc: Record<string, number>, l) => {
    acc[l.department] = (acc[l.department] ?? 0) + 1;
    return acc;
  }, {});

  const topDepts = Object.entries(byDept)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([dept, count]) => ({ dept, count, conversion: byStatus('CONVERTED') > 0 ? Math.round((byStatus('CONVERTED') / count) * 100) : 0 }));

  const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
    NEW: { label: 'Nouveau', color: 'bg-primary-100 text-primary-700' },
    CONTACTED: { label: 'Contacté', color: 'bg-amber-100 text-amber-700' },
    QUALIFIED: { label: 'Qualifié', color: 'bg-purple-100 text-purple-700' },
    CONVERTED: { label: 'Converti', color: 'bg-eco-100 text-eco-700' },
    REJECTED: { label: 'Rejeté', color: 'bg-red-100 text-red-700' },
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Leads</h1>
        <p className="text-slate-500 mt-1">Vue globale des leads et conversions</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total', value: all.length, icon: <Users className="w-4 h-4" />, color: 'text-primary-600 bg-primary-50' },
          { label: 'Nouveaux', value: byStatus('NEW'), icon: <TrendingUp className="w-4 h-4" />, color: 'text-eco-600 bg-eco-50' },
          { label: 'Convertis', value: byStatus('CONVERTED'), icon: <BarChart3 className="w-4 h-4" />, color: 'text-accent-600 bg-accent-50' },
          {
            label: 'Taux conversion',
            value: all.length > 0 ? `${Math.round((byStatus('CONVERTED') / all.length) * 100)}%` : '0%',
            icon: <BarChart3 className="w-4 h-4" />,
            color: 'text-purple-600 bg-purple-50',
          },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-5">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${stat.color} mb-3`}>{stat.icon}</div>
            <div className="text-2xl font-bold text-slate-900">{typeof stat.value === 'number' ? stat.value.toLocaleString('fr-FR') : stat.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Leads par département */}
      {topDepts.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="font-semibold text-slate-900">Leads par département</h2>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Département</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Leads</th>
              </tr>
            </thead>
            <tbody>
              {topDepts.map((row) => (
                <tr key={row.dept} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900">Dép. {row.dept}</td>
                  <td className="px-4 py-4 text-slate-600">{row.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Liste des leads */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="font-semibold text-slate-900">Tous les leads ({all.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Contact</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Projet</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Dept.</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Budget</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Score</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Statut</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody>
              {all.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-8 text-center text-slate-400">Aucun lead pour l&apos;instant.</td></tr>
              ) : (
                all.map((lead) => {
                  const s = STATUS_CONFIG[lead.status] ?? STATUS_CONFIG.NEW;
                  return (
                    <tr key={lead.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-5 py-4">
                        <p className="font-medium text-slate-900">{lead.first_name} {lead.last_name}</p>
                        <p className="text-xs text-slate-400">{lead.email}</p>
                      </td>
                      <td className="px-4 py-4 text-slate-600 max-w-xs truncate">{lead.project_type}</td>
                      <td className="px-4 py-4 text-slate-600">{lead.department}</td>
                      <td className="px-4 py-4 font-medium text-slate-900">{lead.budget ?? '—'}</td>
                      <td className="px-4 py-4">
                        <span className="text-primary-700 font-semibold">{lead.score ?? '—'}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`text-xs rounded-full px-2 py-0.5 font-medium ${s.color}`}>{s.label}</span>
                      </td>
                      <td className="px-4 py-4 text-slate-400 text-xs">
                        {new Date(lead.created_at).toLocaleDateString('fr-FR')}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
