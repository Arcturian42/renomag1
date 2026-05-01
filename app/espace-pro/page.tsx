import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ArrowUp, ArrowDown, TrendingUp, Users, Euro, Star } from 'lucide-react';

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  NEW: { label: 'Nouveau', color: 'bg-primary-100 text-primary-700' },
  CONTACTED: { label: 'Contacté', color: 'bg-amber-100 text-amber-700' },
  QUALIFIED: { label: 'Qualifié', color: 'bg-purple-100 text-purple-700' },
  CONVERTED: { label: 'Gagné', color: 'bg-eco-100 text-eco-700' },
  REJECTED: { label: 'Rejeté', color: 'bg-red-100 text-red-700' },
};

export default async function EspaceProDashboard() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/connexion');

  const { data: artisan } = await supabase
    .from('artisan_companies')
    .select('id, name')
    .eq('user_id', user.id)
    .single();

  const recentLeads = artisan
    ? (await supabase
        .from('leads')
        .select('*')
        .eq('artisan_id', artisan.id)
        .order('created_at', { ascending: false })
        .limit(5)).data ?? []
    : [];

  const allLeads = artisan
    ? (await supabase
        .from('leads')
        .select('id, status, budget, created_at')
        .eq('artisan_id', artisan.id)).data ?? []
    : [];

  const newCount = allLeads.filter((l) => l.status === 'NEW').length;
  const convertedCount = allLeads.filter((l) => l.status === 'CONVERTED').length;
  const conversionRate = allLeads.length > 0
    ? Math.round((convertedCount / allLeads.length) * 100)
    : 0;

  const { data: reviews } = artisan
    ? await supabase
        .from('reviews')
        .select('rating')
        .eq('artisan_id', artisan.id)
    : { data: [] };

  const avgRating =
    reviews && reviews.length > 0
      ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
      : 'N/A';

  const stats = [
    {
      label: 'Leads ce mois',
      value: String(allLeads.length),
      change: `${newCount} nouveaux`,
      trend: 'up' as const,
      icon: <Users className="w-4 h-4" />,
      color: 'text-primary-600 bg-primary-50',
    },
    {
      label: 'Leads nouveaux',
      value: String(newCount),
      change: 'non traités',
      trend: 'up' as const,
      icon: <Euro className="w-4 h-4" />,
      color: 'text-eco-600 bg-eco-50',
    },
    {
      label: 'Taux de conversion',
      value: `${conversionRate}%`,
      change: `${convertedCount} convertis`,
      trend: 'up' as const,
      icon: <TrendingUp className="w-4 h-4" />,
      color: 'text-accent-600 bg-accent-50',
    },
    {
      label: 'Note moyenne',
      value: String(avgRating),
      change: `${reviews?.length ?? 0} avis`,
      trend: 'up' as const,
      icon: <Star className="w-4 h-4" />,
      color: 'text-purple-600 bg-purple-50',
    },
  ];

  return (
    <div className="p-6 lg:p-8">
      {!artisan && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <span className="text-amber-500 text-lg">⚠️</span>
          <div>
            <p className="text-sm font-semibold text-amber-800">Complétez votre profil professionnel</p>
            <p className="text-sm text-amber-700 mt-0.5">
              Ajoutez les informations de votre entreprise pour recevoir des leads et apparaître dans l'annuaire.{' '}
              <a href="/espace-pro/profil" className="underline font-medium">Compléter maintenant →</a>
            </p>
          </div>
        </div>
      )}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Tableau de bord</h1>
        <p className="text-slate-500 mt-1">
          {artisan?.name ?? 'Mon entreprise'} —{' '}
          {new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${stat.color}`}>
                {stat.icon}
              </div>
              <span className="flex items-center gap-0.5 text-xs font-medium text-eco-600">
                <ArrowUp className="w-3 h-3" />
                {stat.change}
              </span>
            </div>
            <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-slate-900">Derniers leads</h2>
            <a href="/espace-pro/leads" className="text-xs text-primary-600 hover:text-primary-800 font-medium">
              Voir tous →
            </a>
          </div>
          {recentLeads.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">Aucun lead pour l&apos;instant.</p>
          ) : (
            <div className="space-y-3">
              {recentLeads.map((lead) => {
                const statusConf = STATUS_CONFIG[lead.status] ?? STATUS_CONFIG.NEW;
                return (
                  <div key={lead.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-xs font-bold text-primary-700 flex-shrink-0">
                      {lead.first_name?.[0]}{lead.last_name?.[0]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {lead.first_name} {lead.last_name}
                      </p>
                      <p className="text-xs text-slate-500 truncate">{lead.project_type}</p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <p className="text-sm font-semibold text-slate-900">{lead.budget ?? '—'}</p>
                      <span className={`inline-block text-xs rounded-full px-2 py-0.5 font-medium mt-0.5 ${statusConf.color}`}>
                        {statusConf.label}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 flex-shrink-0">
                      {new Date(lead.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Résumé</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Total leads</span>
                <span className="font-medium">{allLeads.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Nouveaux</span>
                <span className="font-medium text-primary-600">{newCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Convertis</span>
                <span className="font-medium text-eco-600">{convertedCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Conversion</span>
                <span className="font-medium">{conversionRate}%</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Actions rapides</h3>
            {[
              { label: 'Voir les nouveaux leads', href: '/espace-pro/leads', badge: String(newCount) },
              { label: 'Mettre à jour mon profil', href: '/espace-pro/profil' },
            ].map((action) => (
              <a
                key={action.label}
                href={action.href}
                className="flex items-center justify-between py-2 text-sm text-slate-700 hover:text-primary-700 transition-colors border-b border-slate-100 last:border-0"
              >
                <span>{action.label}</span>
                {action.badge && action.badge !== '0' && (
                  <span className="text-xs font-bold bg-accent-500 text-white rounded-full px-1.5 py-0.5">
                    {action.badge}
                  </span>
                )}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
