import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ClipboardList, Users, TrendingDown, FileCheck, ArrowRight, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default async function EspaceProprietaireDashboard() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/connexion');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const { data: userLeads } = await supabase
    .from('leads')
    .select('*')
    .eq('email', user.email ?? '')
    .order('created_at', { ascending: false });

  const leads = userLeads ?? [];
  const latestLead = leads[0] ?? null;

  const firstName = profile?.first_name ?? user.email?.split('@')[0] ?? 'Utilisateur';

  const statusSteps = [
    {
      status: latestLead ? 'done' : 'pending',
      title: 'Demande de devis envoyée',
      date: latestLead ? new Date(latestLead.created_at).toLocaleDateString('fr-FR') : 'À faire',
      detail: latestLead?.project_type ?? 'Aucune demande pour l\'instant',
    },
    {
      status: latestLead?.status === 'CONTACTED' || latestLead?.status === 'QUALIFIED' || latestLead?.status === 'CONVERTED' ? 'done' : latestLead ? 'current' : 'pending',
      title: 'Artisans sélectionnés',
      date: latestLead ? 'En cours' : 'À venir',
      detail: 'RENOMAG sélectionne les meilleurs artisans RGE pour votre projet',
    },
    {
      status: latestLead?.status === 'QUALIFIED' || latestLead?.status === 'CONVERTED' ? 'done' : latestLead?.status === 'CONTACTED' ? 'current' : 'pending',
      title: 'Devis en cours de réception',
      date: latestLead?.status === 'CONTACTED' ? 'En cours' : 'À venir',
      detail: 'Comparaison des devis reçus',
    },
    {
      status: latestLead?.status === 'CONVERTED' ? 'done' : 'pending',
      title: 'Choix de l\'artisan',
      date: 'À faire',
      detail: 'Comparer et choisir votre artisan',
    },
    {
      status: 'pending' as const,
      title: 'Dépôt du dossier MaPrimeRénov\'',
      date: 'À venir',
      detail: 'Avant le début des travaux',
    },
    {
      status: 'pending' as const,
      title: 'Réalisation des travaux',
      date: 'À venir',
      detail: 'Durée estimée selon devis',
    },
  ];

  const projectStats = [
    { label: 'Demandes envoyées', value: leads.length, icon: <ClipboardList className="w-4 h-4" />, color: 'text-primary-600 bg-primary-50' },
    { label: 'En cours de traitement', value: leads.filter((l) => l.status === 'NEW' || l.status === 'CONTACTED').length, icon: <Users className="w-4 h-4" />, color: 'text-eco-600 bg-eco-50' },
    { label: 'Aides potentielles', value: latestLead ? '2 800€+' : '—', icon: <TrendingDown className="w-4 h-4" />, color: 'text-accent-600 bg-accent-50' },
    { label: 'Projets convertis', value: leads.filter((l) => l.status === 'CONVERTED').length, icon: <FileCheck className="w-4 h-4" />, color: 'text-purple-600 bg-purple-50' },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Bonjour, {firstName} 👋</h1>
        <p className="text-slate-500 mt-1">
          {latestLead
            ? `Votre projet de rénovation est en cours — statut : ${latestLead.status}`
            : 'Commencez par déposer une demande de devis gratuite.'}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {projectStats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-4">
            <div className={`inline-flex items-center justify-center w-8 h-8 rounded-lg ${stat.color} mb-3`}>{stat.icon}</div>
            <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {leads.length === 0 ? (
        <div className="bg-primary-50 border border-primary-200 rounded-xl p-8 text-center mb-6">
          <h2 className="text-lg font-semibold text-primary-900 mb-2">Démarrez votre projet de rénovation</h2>
          <p className="text-sm text-primary-700 mb-4">Obtenez des devis gratuits d&apos;artisans RGE certifiés près de chez vous.</p>
          <Link href="/devis" className="inline-flex items-center gap-2 bg-primary-600 text-white rounded-lg px-6 py-2.5 text-sm font-semibold hover:bg-primary-700">
            Demander un devis gratuit
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-slate-900">Suivi de mon projet</h2>
              <Link href="/espace-proprietaire/mon-projet" className="text-xs text-primary-600 hover:text-primary-800 flex items-center gap-1">
                Détails <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-4">
              {statusSteps.map((item, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                      item.status === 'done' ? 'bg-eco-500' : item.status === 'current' ? 'bg-primary-600 ring-4 ring-primary-100' : 'bg-slate-200'
                    }`}>
                      {item.status === 'done' ? <CheckCircle className="w-3 h-3 text-white" /> : item.status === 'current' ? <Clock className="w-3 h-3 text-white" /> : <div className="w-2 h-2 rounded-full bg-slate-400" />}
                    </div>
                    {idx < statusSteps.length - 1 && (
                      <div className={`w-px flex-1 mt-1 ${item.status === 'done' ? 'bg-eco-300' : 'bg-slate-200'}`} style={{ minHeight: '12px' }} />
                    )}
                  </div>
                  <div className="pb-4">
                    <p className={`text-sm font-medium ${item.status === 'pending' ? 'text-slate-400' : 'text-slate-900'}`}>{item.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{item.date}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="font-semibold text-slate-900 mb-4">Mes demandes</h2>
              <div className="space-y-3">
                {leads.slice(0, 3).map((lead) => (
                  <div key={lead.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{lead.project_type}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{new Date(lead.created_at).toLocaleDateString('fr-FR')}</p>
                    </div>
                    <span className={`text-xs rounded-full px-2 py-0.5 font-medium ${
                      lead.status === 'NEW' ? 'bg-primary-100 text-primary-700' :
                      lead.status === 'CONTACTED' ? 'bg-amber-100 text-amber-700' :
                      lead.status === 'CONVERTED' ? 'bg-eco-100 text-eco-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {lead.status === 'NEW' ? 'Nouveau' : lead.status === 'CONTACTED' ? 'En cours' : lead.status === 'CONVERTED' ? 'Converti' : lead.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-800">Action requise</p>
                <p className="text-xs text-amber-700 mt-0.5">Déposez votre dossier MaPrimeRénov&apos; avant de commencer les travaux.</p>
                <Link href="/aides" className="text-xs font-medium text-amber-700 hover:text-amber-900 mt-1.5 inline-flex items-center gap-1">
                  En savoir plus <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Actions rapides</h3>
              <div className="space-y-2">
                {[
                  { label: 'Nouvelle demande de devis', href: '/devis', icon: '📋' },
                  { label: 'Simuler mes aides', href: '/aides', icon: '🧮' },
                  { label: 'Contacter un artisan', href: '/espace-proprietaire/messages', icon: '💬' },
                ].map((action) => (
                  <Link key={action.label} href={action.href} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition-colors">
                    <span>{action.icon}</span>
                    <span className="text-sm text-slate-700">{action.label}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 ml-auto" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
