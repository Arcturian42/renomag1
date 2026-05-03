import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getArtisans, getArtisanBySlug } from '@/lib/data/db'
import {
  Star,
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  CheckCircle,
  Calendar,
  Award,
  Users,
  Crown,
  ArrowLeft,
  MessageSquare,
} from 'lucide-react'
import { formatDate } from '@/lib/utils'
import LocalBusinessJsonLd from '@/components/seo/LocalBusinessJsonLd'
import ArtisanMessageButton from '@/components/directory/ArtisanMessageButton'

type Props = { params: { slug: string } }

export async function generateStaticParams() {
  const artisans = await getArtisans()
  return artisans.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const artisan = await getArtisanBySlug(params.slug)
  if (!artisan) return { title: 'Artisan non trouvé' }
  return {
    title: `${artisan.company} — Artisan RGE à ${artisan.city}`,
    description: artisan.description.slice(0, 160),
  }
}

export default async function ArtisanProfilePage({ params }: Props) {
  const artisan = await getArtisanBySlug(params.slug)
  if (!artisan) notFound()

  return (
    <div className="bg-slate-50 min-h-screen">
      <LocalBusinessJsonLd artisan={artisan} />
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="hover:text-slate-700">Accueil</Link>
            <span>/</span>
            <Link href="/annuaire" className="hover:text-slate-700">Annuaire</Link>
            <span>/</span>
            <span className="text-slate-900 font-medium">{artisan.company}</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/annuaire"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à l'annuaire
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile header */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-start gap-5">
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0">
                  <Image
                    src={artisan.avatar}
                    alt={artisan.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-2xl font-bold text-slate-900">{artisan.company}</h1>
                    {artisan.premium && (
                      <span className="badge-accent">
                        <Crown className="w-3 h-3" />
                        Premium
                      </span>
                    )}
                    {artisan.verified && (
                      <span className="badge-rge">
                        <CheckCircle className="w-3 h-3" />
                        Vérifié
                      </span>
                    )}
                  </div>
                  <p className="text-slate-500 mt-0.5">{artisan.name}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-sm text-slate-500">{artisan.address}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(artisan.rating)
                              ? 'fill-accent-400 text-accent-400'
                              : 'text-slate-300'
                          }`}
                        />
                      ))}
                      <span className="text-sm font-semibold text-slate-900 ml-1">
                        {artisan.rating}
                      </span>
                    </div>
                    <span className="text-sm text-slate-500">
                      ({artisan.reviewCount} avis)
                    </span>
                    <span
                      className={`flex items-center gap-1 text-sm font-medium ${
                        artisan.available ? 'text-eco-600' : 'text-slate-400'
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full inline-block ${
                          artisan.available ? 'bg-eco-500' : 'bg-slate-300'
                        }`}
                      />
                      {artisan.available ? 'Disponible' : 'Occupé'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Certifications */}
              <div className="mt-5 flex flex-wrap gap-2">
                {artisan.certifications.map((cert) => (
                  <span key={cert} className="badge-rge text-sm px-3 py-1">
                    <Award className="w-3 h-3" />
                    {cert}
                  </span>
                ))}
              </div>

              {/* Specialties */}
              <div className="mt-3 flex flex-wrap gap-2">
                {artisan.specialties.map((spec) => (
                  <span key={spec} className="badge-primary">
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="font-semibold text-slate-900 mb-4">À propos</h2>
              <p className="text-sm text-slate-600 leading-relaxed">{artisan.description}</p>
              <div className="grid grid-cols-3 gap-4 mt-6 pt-5 border-t border-slate-100">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-800">
                    {artisan.projectCount}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">Chantiers réalisés</div>
                </div>
                <div className="text-center border-x border-slate-100">
                  <div className="text-2xl font-bold text-primary-800">
                    {artisan.yearsExperience} ans
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">D'expérience</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-800">
                    {artisan.reviewCount}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">Avis clients</div>
                </div>
              </div>
            </div>

            {/* Gallery */}
            {artisan.gallery.length > 0 && (
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="font-semibold text-slate-900 mb-4">Galerie de réalisations</h2>
                <div className="grid grid-cols-3 gap-3">
                  {artisan.gallery.map((img, i) => (
                    <div
                      key={i}
                      className="relative h-32 rounded-lg overflow-hidden bg-slate-100"
                    >
                      <Image
                        src={img}
                        alt={`Réalisation ${i + 1}`}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 33vw, 200px"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            {artisan.reviews.length > 0 && (
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-semibold text-slate-900">
                    Avis clients ({artisan.reviewCount})
                  </h2>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(artisan.rating)
                              ? 'fill-accent-400 text-accent-400'
                              : 'text-slate-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-semibold">{artisan.rating}/5</span>
                  </div>
                </div>
                <div className="space-y-5">
                  {artisan.reviews.map((review) => (
                    <div key={review.id} className="border-b border-slate-100 pb-5 last:border-0 last:pb-0">
                      <div className="flex items-start gap-3">
                        <Image
                          src={review.avatar}
                          alt={review.author}
                          width={36}
                          height={36}
                          className="rounded-full flex-shrink-0"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-slate-900">{review.author}</p>
                            <span className="text-xs text-slate-400">
                              {formatDate(review.date)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <div className="flex">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < review.rating
                                      ? 'fill-accent-400 text-accent-400'
                                      : 'text-slate-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-slate-400">{review.project}</span>
                          </div>
                          <p className="mt-2 text-sm text-slate-600">{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Contact card */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 sticky top-24">
              <h2 className="font-semibold text-slate-900 mb-5">Contacter {artisan.company}</h2>
              <div className="space-y-3 mb-5">
                <a
                  href={`tel:${artisan.phone}`}
                  className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <Phone className="w-4 h-4 text-primary-600" />
                  <span className="text-sm font-medium text-slate-900">{artisan.phone}</span>
                </a>
                <a
                  href={`mailto:${artisan.email}`}
                  className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <Mail className="w-4 h-4 text-primary-600" />
                  <span className="text-sm font-medium text-slate-900 truncate">
                    {artisan.email}
                  </span>
                </a>
                {artisan.website && (
                  <a
                    href={artisan.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <Globe className="w-4 h-4 text-primary-600" />
                    <span className="text-sm font-medium text-primary-700">Site web</span>
                  </a>
                )}
                {(artisan as any).googleBusinessUrl && (
                  <a
                    href={(artisan as any).googleBusinessUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg bg-eco-50 hover:bg-eco-100 transition-colors"
                  >
                    <MapPin className="w-4 h-4 text-eco-600" />
                    <span className="text-sm font-medium text-eco-700">Google Business Profile</span>
                  </a>
                )}
              </div>

              <Link href="/devis" className="btn-accent w-full text-center mb-3">
                Demander un devis gratuit
              </Link>
              <ArtisanMessageButton redirectUrl={`/annuaire/${params.slug}`} />

              <div className="mt-4 flex items-center gap-2 text-xs text-slate-400 justify-center">
                <Clock className="w-3 h-3" />
                <span>Répond généralement en {artisan.responseTime}</span>
              </div>
            </div>

            {/* Info card */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">Informations</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    Depuis
                  </span>
                  <span className="font-medium text-slate-900">{artisan.since}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    Chantiers
                  </span>
                  <span className="font-medium text-slate-900">{artisan.projectCount}+</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">SIRET</span>
                  <span className="font-medium text-slate-900 text-xs">{artisan.siret}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Zone</span>
                  <span className="font-medium text-slate-900">{artisan.region}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
