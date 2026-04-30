import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Search, CheckCircle, Crown, AlertCircle, Plus } from 'lucide-react';

export default async function AdminArtisansPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/connexion');

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'ADMIN') redirect('/');

  const { data: artisans } = await supabase
    .from('artisan_companies')
    .select(`
      *,
      artisan_certifications ( certifications ( name, code ) ),
      artisan_specialties ( specialties ( name ) ),
      subscriptions ( plan, status ),
      reviews ( rating )
    `)
    .order('created_at', { ascending: false });

  const all = artisans ?? [];
  const premium = all.filter((a) => a.subscriptions?.plan !== 'FREE' && a.subscriptions?.plan).length;
  const featured = all.filter((a) => a.is_featured).length;

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Artisans</h1>
          <p className="text-slate-500 mt-1">{all.length} artisans dans la base</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Chercher un artisan..."
              className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>
          <button className="flex items-center gap-1.5 px-3 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
            <Plus className="w-3.5 h-3.5" />
            Ajouter
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total', value: all.length, color: 'text-slate-900' },
          { label: 'Mis en avant', value: featured, color: 'text-eco-600' },
          { label: 'Premium', value: premium, color: 'text-accent-600' },
          { label: 'Sans abonnement', value: all.length - premium, color: 'text-amber-600' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-4 text-center">
            <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {all.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-slate-400 mb-2">Aucun artisan dans la base.</p>
            <p className="text-xs text-slate-400">Créez des comptes dans Supabase Auth, puis ajoutez-les via le formulaire.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Artisan</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Localisation</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Certifications</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Note</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Plan</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Statut</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {all.map((artisan) => {
                const certs = artisan.artisan_certifications?.map((ac: { certifications: { code: string } }) => ac.certifications?.code).filter(Boolean) ?? [];
                const reviews: { rating: number }[] = artisan.reviews ?? [];
                const avgRating = reviews.length > 0
                  ? (reviews.reduce((s: number, r: { rating: number }) => s + r.rating, 0) / reviews.length).toFixed(1)
                  : null;
                const plan = artisan.subscriptions?.plan ?? 'FREE';
                const isPremium = plan !== 'FREE';

                return (
                  <tr key={artisan.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-primary-100 flex items-center justify-center text-xs font-bold text-primary-700 flex-shrink-0">
                          {artisan.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 flex items-center gap-1">
                            {artisan.name}
                            {isPremium && <Crown className="w-3 h-3 text-accent-500" />}
                          </p>
                          <p className="text-xs text-slate-400">{artisan.siret}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-slate-600">
                      <p>{artisan.city}</p>
                      <p className="text-xs text-slate-400">Dép. {artisan.department}</p>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-1">
                        {certs.slice(0, 2).map((cert: string) => (
                          <span key={cert} className="text-xs bg-eco-50 text-eco-700 rounded px-1.5 py-0.5 font-medium">{cert}</span>
                        ))}
                        {certs.length === 0 && <span className="text-xs text-slate-400">—</span>}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {avgRating ? (
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-semibold text-slate-900">{avgRating}</span>
                          <span className="text-amber-400">⭐</span>
                          <span className="text-xs text-slate-400">({reviews.length})</span>
                        </div>
                      ) : <span className="text-slate-400 text-xs">—</span>}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`text-xs rounded-full px-2 py-0.5 font-medium ${isPremium ? 'bg-accent-100 text-accent-700' : 'bg-slate-100 text-slate-600'}`}>
                        {plan}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      {artisan.is_featured ? (
                        <span className="flex items-center gap-1 text-xs text-eco-700 bg-eco-50 rounded-full px-2 py-0.5 w-fit">
                          <CheckCircle className="w-3 h-3" />
                          Mis en avant
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-amber-700 bg-amber-50 rounded-full px-2 py-0.5 w-fit">
                          <AlertCircle className="w-3 h-3" />
                          Standard
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <button className="text-xs text-primary-600 hover:text-primary-800 font-medium">Voir</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
