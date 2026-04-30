import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { ARTISANS, SPECIALTIES, REGIONS } from '@/lib/data/artisans';
import ArtisanCard from '@/components/directory/ArtisanCard';
import { Search, SlidersHorizontal, Filter, MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Annuaire des artisans RGE — Trouvez un professionnel certifié',
  description: 'Consultez notre annuaire de 2 400+ artisans RGE certifiés en France. Filtrez par spécialité, région et certifications. Devis gratuit sous 24h.',
};

export default async function AnnuairePage() {
  const supabase = await createClient();

  const { data: dbArtisans } = await supabase
    .from('artisan_companies')
    .select(`
      id, name, city, zip_code, department, description, phone, website, logo_url, is_featured,
      artisan_specialties ( specialties ( name, slug ) ),
      artisan_certifications ( certifications ( name, code ) ),
      reviews ( rating )
    `)
    .order('is_featured', { ascending: false })
    .limit(50);

  const { data: specialties } = await supabase.from('specialties').select('name, slug');

  const hasDbArtisans = dbArtisans && dbArtisans.length > 0;
  const totalCount = hasDbArtisans ? dbArtisans.length : ARTISANS.length;

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="max-w-2xl">
            <div className="badge-primary mb-3">{totalCount}+ artisans</div>
            <h1 className="text-3xl font-bold text-slate-900">Annuaire des artisans RGE</h1>
            <p className="mt-2 text-slate-500">Trouvez les meilleurs professionnels certifiés dans votre région</p>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3 max-w-3xl">
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Ville, département ou code postal..." className="input-field pl-10" />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select className="input-field pl-10 pr-8 appearance-none cursor-pointer">
                <option value="">Toutes spécialités</option>
                {(specialties ?? []).map((s) => (
                  <option key={s.slug} value={s.slug}>{s.name}</option>
                ))}
              </select>
            </div>
            <button className="btn-primary px-6 whitespace-nowrap">
              <Search className="w-4 h-4" />
              Rechercher
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-xl border border-slate-200 p-5 sticky top-24">
              <div className="flex items-center gap-2 mb-5">
                <Filter className="w-4 h-4 text-slate-600" />
                <h2 className="font-semibold text-slate-900">Filtres</h2>
              </div>
              <div className="mb-6">
                <h3 className="text-sm font-medium text-slate-700 mb-3">Région</h3>
                <div className="space-y-2">
                  {REGIONS.map((region) => (
                    <label key={region} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                      <span className="text-sm text-slate-600">{region}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="mb-6">
                <h3 className="text-sm font-medium text-slate-700 mb-3">Spécialités</h3>
                <div className="space-y-2">
                  {(specialties ?? SPECIALTIES.map((s) => ({ name: s, slug: s }))).slice(0, 6).map((spec) => (
                    <label key={typeof spec === 'string' ? spec : spec.slug} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                      <span className="text-sm text-slate-600">{typeof spec === 'string' ? spec : spec.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-700 mb-3">Note minimale</h3>
                {[4.5, 4.0, 3.5].map((rating) => (
                  <label key={rating} className="flex items-center gap-2 mb-2 cursor-pointer">
                    <input type="radio" name="rating" className="border-slate-300 text-primary-600 focus:ring-primary-500" />
                    <span className="text-sm text-slate-600">{rating}+ ⭐</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-slate-500">
                <strong className="text-slate-900">{totalCount} artisans</strong> trouvés
              </p>
              <div className="flex items-center gap-3">
                <button className="lg:hidden flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900">
                  <SlidersHorizontal className="w-4 h-4" />
                  Filtres
                </button>
                <select className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20">
                  <option>Mieux notés</option>
                  <option>Plus d&apos;avis</option>
                  <option>Plus récents</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {hasDbArtisans ? (
                dbArtisans.map((a) => {
                  const reviews: { rating: number }[] = a.reviews ?? [];
                  const avgRating = reviews.length > 0
                    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
                    : 4.5;
                  const specs = (a.artisan_specialties as { specialties: { name: string; slug: string }[] }[] | null)
                    ?.flatMap((as) => as.specialties?.map((s) => s.name) ?? []).filter(Boolean) ?? [];
                  const certs = (a.artisan_certifications as { certifications: { code: string; name: string }[] }[] | null)
                    ?.flatMap((ac) => ac.certifications?.map((c) => c.code) ?? []).filter(Boolean) ?? [];

                  const artisanForCard = {
                    id: a.id,
                    slug: a.id,
                    name: a.name,
                    company: a.name,
                    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(a.name)}&background=1e40af&color=fff&size=200`,
                    city: a.city,
                    department: `Dép. ${a.department}`,
                    region: '',
                    address: `${a.zip_code} ${a.city}`,
                    phone: a.phone ?? '',
                    email: '',
                    description: a.description ?? '',
                    specialties: specs,
                    certifications: certs as ('RGE' | 'QualiPAC' | 'QualiSol' | 'Qualibois' | 'QualiPV' | 'Eco Artisan')[],
                    rating: Math.round(avgRating * 10) / 10,
                    reviewCount: reviews.length,
                    projectCount: 0,
                    yearsExperience: 5,
                    responseTime: '< 2h',
                    verified: true,
                    premium: a.is_featured,
                    available: true,
                    siret: '',
                    since: 2018,
                    gallery: [],
                    reviews: [],
                  };
                  return <ArtisanCard key={a.id} artisan={artisanForCard} />;
                })
              ) : (
                ARTISANS.map((artisan) => <ArtisanCard key={artisan.id} artisan={artisan} />)
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
