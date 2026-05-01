import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ARTISANS } from '@/lib/data/artisans'
import { Star, CheckCircle, Phone, ArrowRight } from 'lucide-react'

export default async function ArtisansMatchesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/connexion')

  // Fetch leads for this user to find matched artisans
  const { data: userLeads } = await supabase
    .from('leads')
    .select('artisan_id, project_type, status')
    .eq('email', user.email ?? '')
    .not('artisan_id', 'is', null)
    .limit(5)

  const artisanIds = Array.from(new Set((userLeads ?? []).map((l) => l.artisan_id).filter(Boolean)))

  let matchedArtisans: {
    id: string; name: string; city: string; phone: string | null; website: string | null;
    description: string | null; is_featured: boolean;
    artisan_specialties: { specialties: { name: string } }[];
    artisan_certifications: { certifications: { name: string } }[];
    reviews: { rating: number }[];
  }[] = []

  if (artisanIds.length > 0) {
    const { data } = await supabase
      .from('artisan_companies')
      .select(`
        id, name, city, phone, website, description, is_featured,
        artisan_specialties ( specialties ( name ) ),
        artisan_certifications ( certifications ( name ) ),
        reviews ( rating )
      `)
      .in('id', artisanIds)

    matchedArtisans = (data ?? []) as unknown as typeof matchedArtisans
  }

  // If no matched artisans from DB, try featured artisans
  if (matchedArtisans.length === 0) {
    const { data } = await supabase
      .from('artisan_companies')
      .select(`
        id, name, city, phone, website, description, is_featured,
        artisan_specialties ( specialties ( name ) ),
        artisan_certifications ( certifications ( name ) ),
        reviews ( rating )
      `)
      .eq('is_featured', true)
      .limit(3)

    matchedArtisans = (data ?? []) as unknown as typeof matchedArtisans
  }

  // Final fallback: use mock data
  const usesMock = matchedArtisans.length === 0
  const displayArtisans = usesMock ? ARTISANS.slice(0, 3) : matchedArtisans

  const projectDesc = userLeads?.[0]?.project_type ?? 'rénovation énergétique'

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Artisans matchés</h1>
        <p className="text-slate-500 mt-1">
          {matchedArtisans.length > 0
            ? `${matchedArtisans.length} artisan${matchedArtisans.length > 1 ? 's' : ''} RGE sélectionné${matchedArtisans.length > 1 ? 's' : ''} pour votre projet`
            : 'Artisans RGE recommandés pour votre projet de ' + projectDesc}
        </p>
      </div>

      <div className="bg-primary-50 border border-primary-200 rounded-xl p-4 mb-6 flex items-center gap-3">
        <CheckCircle className="w-4 h-4 text-primary-600 flex-shrink-0" />
        <p className="text-sm text-primary-800">
          Conseil : comparez les devis sur le prix total <strong>après aides</strong>, pas
          seulement le montant HT.
        </p>
      </div>

      {usesMock && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-sm text-amber-800">
          Aucun artisan n&apos;a encore été assigné à vos demandes.{' '}
          <Link href="/devis" className="underline font-medium">Créer une demande de devis →</Link>
        </div>
      )}

      <div className="space-y-5">
        {displayArtisans.map((artisan, idx) => {
          if (usesMock) {
            const a = artisan as typeof ARTISANS[0]
            return (
              <ArtisanCard
                key={a.id}
                id={a.id}
                slug={a.slug}
                name={a.company}
                city={a.city}
                phone={a.phone}
                rating={a.rating}
                reviewCount={a.reviewCount}
                certifications={a.certifications}
                specialties={a.specialties.slice(0, 2)}
                avatar={a.avatar}
                isTop={idx === 0}
              />
            )
          }

          const a = artisan as typeof matchedArtisans[0]
          const reviews = a.reviews ?? []
          const avgRating = reviews.length > 0
            ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10
            : 0
          const specs = (a.artisan_specialties as unknown as { specialties: { name: string } }[])
            ?.flatMap((as) => (as.specialties ? [as.specialties.name] : [])).slice(0, 2) ?? []
          const certs = (a.artisan_certifications as unknown as { certifications: { name: string } }[])
            ?.flatMap((ac) => (ac.certifications ? [ac.certifications.name] : [])) ?? []

          return (
            <ArtisanCard
              key={a.id}
              id={a.id}
              slug={a.id}
              name={a.name}
              city={a.city}
              phone={a.phone ?? ''}
              rating={avgRating}
              reviewCount={reviews.length}
              certifications={certs as string[]}
              specialties={specs}
              avatar={`https://ui-avatars.com/api/?name=${encodeURIComponent(a.name)}&background=1e40af&color=fff&size=200`}
              isTop={idx === 0}
            />
          )
        })}
      </div>
    </div>
  )
}

function ArtisanCard({
  id, slug, name, city, phone, rating, reviewCount,
  certifications, specialties, avatar, isTop,
}: {
  id: string; slug: string; name: string; city: string; phone: string;
  rating: number; reviewCount: number; certifications: string[];
  specialties: string[]; avatar: string; isTop: boolean
}) {
  return (
    <div className={`bg-white rounded-xl border-2 p-6 ${isTop ? 'border-primary-400' : 'border-slate-200'}`}>
      {isTop && (
        <div className="inline-flex items-center gap-1.5 bg-primary-100 text-primary-800 text-xs font-semibold rounded-full px-3 py-1 mb-4">
          ⭐ Recommandé par RENOMAG
        </div>
      )}
      <div className="flex items-start gap-4">
        <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
          <Image src={avatar} alt={name} fill className="object-cover" unoptimized />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-bold text-slate-900">{name}</h2>
              <p className="text-sm text-slate-500">{city}</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(rating) ? 'fill-accent-400 text-accent-400' : 'text-slate-300'}`} />
                  ))}
                </div>
                <span className="text-xs text-slate-500">
                  {rating > 0 ? `${rating} (${reviewCount} avis)` : 'Pas encore d\'avis'}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {certifications.map((cert) => (
              <span key={cert} className="badge-rge">
                <CheckCircle className="w-2.5 h-2.5" />{cert}
              </span>
            ))}
            {specialties.map((spec) => (
              <span key={spec} className="badge-gray">{spec}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-3 pt-4 border-t border-slate-100">
        {phone && (
          <a href={`tel:${phone}`} className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900">
            <Phone className="w-3.5 h-3.5" />{phone}
          </a>
        )}
        <div className="flex items-center gap-2 ml-auto">
          <Link href={`/annuaire/${slug}`} className="btn-primary text-xs py-1.5 px-3 rounded-lg">
            Voir profil <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
