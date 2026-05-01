import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ARTISANS } from '@/lib/data/artisans'
import { formatDate } from '@/lib/utils'
import {
  Star, MapPin, Phone, Mail, Globe, Clock, CheckCircle,
  Calendar, Award, Users, Crown, ArrowLeft, MessageSquare,
} from 'lucide-react'

type Props = { params: { slug: string } }

export async function generateStaticParams() {
  return ARTISANS.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('artisan_companies')
    .select('name, description, city')
    .eq('id', params.slug)
    .single()

  if (data) {
    return {
      title: `${data.name} — Artisan RGE à ${data.city}`,
      description: (data.description ?? '').slice(0, 160),
    }
  }

  const artisan = ARTISANS.find((a) => a.slug === params.slug)
  if (!artisan) return { title: 'Artisan non trouvé' }
  return {
    title: `${artisan.company} — Artisan RGE à ${artisan.city}`,
    description: artisan.description.slice(0, 160),
  }
}

export default async function ArtisanProfilePage({ params }: Props) {
  const supabase = await createClient()

  // Try Supabase first (slug = artisan UUID id)
  const { data: dbArtisan } = await supabase
    .from('artisan_companies')
    .select(`
      id, name, description, city, zip_code, department, phone, website, logo_url, is_featured, siret, created_at,
      artisan_specialties ( specialties ( name, slug ) ),
      artisan_certifications ( certifications ( name, code ) ),
      reviews ( id, rating, comment, created_at )
    `)
    .eq('id', params.slug)
    .single()

  if (dbArtisan) {
    const specs = (dbArtisan.artisan_specialties as unknown as { specialties: { name: string; slug: string }[] }[] | null)
      ?.flatMap((as) => as.specialties?.map((s) => s.name) ?? []).filter(Boolean) ?? []
    const certs = (dbArtisan.artisan_certifications as unknown as { certifications: { name: string; code: string }[] }[] | null)
      ?.flatMap((ac) => ac.certifications?.map((c) => c.name) ?? []).filter(Boolean) ?? []
    const reviews = (dbArtisan.reviews as { id: string; rating: number; comment: string | null; created_at: string }[] | null) ?? []
    const avgRating = reviews.length > 0
      ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10
      : 0

    return (
      <ArtisanLayout
        name={dbArtisan.name}
        company={dbArtisan.name}
        avatar={`https://ui-avatars.com/api/?name=${encodeURIComponent(dbArtisan.name)}&background=1e40af&color=fff&size=200`}
        address={`${dbArtisan.zip_code} ${dbArtisan.city}`}
        phone={dbArtisan.phone ?? ''}
        email=""
        website={dbArtisan.website ?? ''}
        description={dbArtisan.description ?? ''}
        specialties={specs}
        certifications={certs}
        rating={avgRating}
        reviewCount={reviews.length}
        premium={dbArtisan.is_featured}
        siret={dbArtisan.siret}
        since={new Date(dbArtisan.created_at).getFullYear()}
        reviews={reviews.map((r) => ({
          id: r.id,
          rating: r.rating,
          comment: r.comment ?? '',
          date: r.created_at,
          author: 'Client vérifié',
          avatar: 'https://ui-avatars.com/api/?name=C&background=e2e8f0&color=64748b&size=36',
          project: '',
        }))}
      />
    )
  }

  // Fallback to mock data
  const artisan = ARTISANS.find((a) => a.slug === params.slug)
  if (!artisan) notFound()

  return (
    <ArtisanLayout
      name={artisan.name}
      company={artisan.company}
      avatar={artisan.avatar}
      address={artisan.address}
      phone={artisan.phone}
      email={artisan.email}
      website={artisan.website ?? ''}
      description={artisan.description}
      specialties={artisan.specialties}
      certifications={artisan.certifications}
      rating={artisan.rating}
      reviewCount={artisan.reviewCount}
      premium={artisan.premium}
      siret={artisan.siret}
      since={artisan.since}
      reviews={artisan.reviews.map((r) => ({
        id: String(r.id),
        rating: r.rating,
        comment: r.comment,
        date: r.date,
        author: r.author,
        avatar: r.avatar,
        project: r.project,
      }))}
    />
  )
}

type Review = { id: string; rating: number; comment: string; date: string; author: string; avatar: string; project: string }

function ArtisanLayout({
  name, company, avatar, address, phone, email, website,
  description, specialties, certifications, rating, reviewCount,
  premium, siret, since, reviews,
}: {
  name: string; company: string; avatar: string; address: string; phone: string;
  email: string; website: string; description: string; specialties: string[];
  certifications: string[]; rating: number; reviewCount: number;
  premium: boolean; siret: string; since: number; reviews: Review[]
}) {
  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="hover:text-slate-700">Accueil</Link>
            <span>/</span>
            <Link href="/annuaire" className="hover:text-slate-700">Annuaire</Link>
            <span>/</span>
            <span className="text-slate-900 font-medium">{company}</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/annuaire" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Retour à l&apos;annuaire
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-start gap-5">
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0">
                  <Image src={avatar} alt={name} fill className="object-cover" unoptimized />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-2xl font-bold text-slate-900">{company}</h1>
                    {premium && (
                      <span className="badge-accent"><Crown className="w-3 h-3" />Premium</span>
                    )}
                    <span className="badge-rge"><CheckCircle className="w-3 h-3" />Vérifié</span>
                  </div>
                  <p className="text-slate-500 mt-0.5">{name}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-sm text-slate-500">{address}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-3">
                    {rating > 0 && (
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-accent-400 text-accent-400' : 'text-slate-300'}`} />
                        ))}
                        <span className="text-sm font-semibold text-slate-900 ml-1">{rating}</span>
                      </div>
                    )}
                    <span className="text-sm text-slate-500">({reviewCount} avis)</span>
                    <span className="flex items-center gap-1 text-sm font-medium text-eco-600">
                      <span className="w-2 h-2 rounded-full inline-block bg-eco-500" />
                      Disponible
                    </span>
                  </div>
                </div>
              </div>
              {certifications.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {certifications.map((cert) => (
                    <span key={cert} className="badge-rge text-sm px-3 py-1">
                      <Award className="w-3 h-3" />{cert}
                    </span>
                  ))}
                </div>
              )}
              {specialties.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {specialties.map((spec) => (
                    <span key={spec} className="badge-primary">{spec}</span>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="font-semibold text-slate-900 mb-4">À propos</h2>
              <p className="text-sm text-slate-600 leading-relaxed">{description || 'Aucune description disponible.'}</p>
              <div className="grid grid-cols-3 gap-4 mt-6 pt-5 border-t border-slate-100">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-800">{reviewCount}</div>
                  <div className="text-xs text-slate-500 mt-0.5">Avis clients</div>
                </div>
                <div className="text-center border-x border-slate-100">
                  <div className="text-2xl font-bold text-primary-800">{rating > 0 ? `${rating}/5` : 'N/A'}</div>
                  <div className="text-xs text-slate-500 mt-0.5">Note moyenne</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-800">{since}</div>
                  <div className="text-xs text-slate-500 mt-0.5">Membre depuis</div>
                </div>
              </div>
            </div>

            {reviews.length > 0 && (
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-semibold text-slate-900">Avis clients ({reviewCount})</h2>
                  {rating > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-accent-400 text-accent-400' : 'text-slate-300'}`} />
                        ))}
                      </div>
                      <span className="text-sm font-semibold">{rating}/5</span>
                    </div>
                  )}
                </div>
                <div className="space-y-5">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-slate-100 pb-5 last:border-0 last:pb-0">
                      <div className="flex items-start gap-3">
                        <Image src={review.avatar} alt={review.author} width={36} height={36} className="rounded-full flex-shrink-0" unoptimized />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-slate-900">{review.author}</p>
                            <span className="text-xs text-slate-400">{formatDate(review.date)}</span>
                          </div>
                          <div className="flex mt-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-accent-400 text-accent-400' : 'text-slate-300'}`} />
                            ))}
                          </div>
                          {review.comment && <p className="mt-2 text-sm text-slate-600">{review.comment}</p>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-5">
            <div className="bg-white rounded-xl border border-slate-200 p-5 sticky top-24">
              <h2 className="font-semibold text-slate-900 mb-5">Contacter {company}</h2>
              <div className="space-y-3 mb-5">
                {phone && (
                  <a href={`tel:${phone}`} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                    <Phone className="w-4 h-4 text-primary-600" />
                    <span className="text-sm font-medium text-slate-900">{phone}</span>
                  </a>
                )}
                {email && (
                  <a href={`mailto:${email}`} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                    <Mail className="w-4 h-4 text-primary-600" />
                    <span className="text-sm font-medium text-slate-900 truncate">{email}</span>
                  </a>
                )}
                {website && (
                  <a href={website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                    <Globe className="w-4 h-4 text-primary-600" />
                    <span className="text-sm font-medium text-primary-700">Site web</span>
                  </a>
                )}
              </div>
              <Link href="/devis" className="btn-accent w-full text-center mb-3">Demander un devis gratuit</Link>
              <button className="btn-secondary w-full">
                <MessageSquare className="w-4 h-4" />
                Envoyer un message
              </button>
              <div className="mt-4 flex items-center gap-2 text-xs text-slate-400 justify-center">
                <Clock className="w-3 h-3" />
                <span>Répond généralement en &lt; 2h</span>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">Informations</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />Depuis</span>
                  <span className="font-medium text-slate-900">{since}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1.5"><Users className="w-3.5 h-3.5" />Avis</span>
                  <span className="font-medium text-slate-900">{reviewCount}</span>
                </div>
                {siret && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">SIRET</span>
                    <span className="font-medium text-slate-900 text-xs">{siret}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
