export const dynamic = 'force-dynamic'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { Star, CheckCircle, Phone, MessageSquare, ArrowRight } from 'lucide-react'

export default async function ArtisansMatchesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/connexion')
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: { profile: true },
  })

  if (!dbUser || dbUser.role === 'ARTISAN') {
    redirect('/espace-pro')
  }

  // Fetch real artisans from database
  const artisans = await prisma.artisanCompany.findMany({
    include: {
      certifications: true,
      specialties: true,
      reviews: true,
      subscription: true,
      leads: true,
    },
    take: 10,
  })

  // Map to the format expected by the UI
  const matched = artisans.map((artisan) => {
    const avgRating = artisan.reviews.length > 0
      ? artisan.reviews.reduce((s, r) => s + r.rating, 0) / artisan.reviews.length
      : 0

    return {
      id: artisan.id,
      slug: `${artisan.name.toLowerCase().replace(/\s+/g, '-')}-${artisan.id.slice(0, 6)}`,
      name: artisan.name,
      company: artisan.name,
      avatar: artisan.logoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(artisan.name)}&background=1e40af&color=fff&size=200`,
      city: artisan.city,
      department: `${artisan.department}`,
      region: 'France',
      address: artisan.address,
      phone: artisan.phone || '01 23 45 67 89',
      email: `contact@${artisan.name.toLowerCase().replace(/\s+/g, '-')}.fr`,
      website: artisan.website || undefined,
      description: artisan.description || '',
      specialties: artisan.specialties.map((s) => s.name),
      certifications: artisan.certifications.map((c) => c.name) as any,
      rating: Number(avgRating.toFixed(1)) || 4.5,
      reviewCount: artisan.reviews.length,
      projectCount: artisan.leads.length,
      yearsExperience: 10,
      responseTime: '< 2h',
      verified: true,
      premium: artisan.subscription?.plan?.toLowerCase().includes('premium') || false,
      available: true,
      siret: artisan.siret,
      since: new Date(artisan.createdAt).getFullYear(),
      gallery: [] as string[],
      reviews: artisan.reviews.map((r) => ({
        id: r.id,
        author: 'Client',
        avatar: '',
        rating: r.rating,
        date: new Date(r.createdAt).toLocaleDateString('fr-FR'),
        comment: r.comment || '',
        project: '',
      })),
    }
  })

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Artisans matchés</h1>
        <p className="text-slate-500 mt-1">
          {matched.length} artisan{matched.length > 1 ? 's' : ''} RGE sélectionné{matched.length > 1 ? 's' : ''} pour votre projet
        </p>
      </div>

      {/* Comparison notice */}
      <div className="bg-primary-50 border border-primary-200 rounded-xl p-4 mb-6 flex items-center gap-3">
        <CheckCircle className="w-4 h-4 text-primary-600 flex-shrink-0" />
        <p className="text-sm text-primary-800">
          Conseil : comparez les devis sur le prix total <strong>après aides</strong>, pas
          seulement le montant HT.
        </p>
      </div>

      <div className="space-y-5">
        {matched.length === 0 && (
          <p className="text-sm text-slate-500">Aucun artisan trouvé pour le moment.</p>
        )}
        {matched.map((artisan, idx) => (
          <div
            key={artisan.id}
            className={`bg-white rounded-xl border-2 p-6 ${
              idx === 0 ? 'border-primary-400' : 'border-slate-200'
            }`}
          >
            {idx === 0 && (
              <div className="inline-flex items-center gap-1.5 bg-primary-100 text-primary-800 text-xs font-semibold rounded-full px-3 py-1 mb-4">
                ⭐ Recommandé par RENOMAG
              </div>
            )}
            <div className="flex items-start gap-4">
              <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                <Image src={artisan.avatar} alt={artisan.name} fill className="object-cover" sizes="48px" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-bold text-slate-900">{artisan.company}</h2>
                    <p className="text-sm text-slate-500">{artisan.city}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < Math.floor(artisan.rating)
                                ? 'fill-accent-400 text-accent-400'
                                : 'text-slate-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-slate-500">
                        {artisan.rating} ({artisan.reviewCount} avis)
                      </span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    {idx < 2 ? (
                      <>
                        <p className="text-xl font-bold text-slate-900">
                          {idx === 0 ? '12 400€' : '11 800€'}
                        </p>
                        <p className="text-xs text-eco-600 font-medium">
                          -{idx === 0 ? '4 800€' : '4 600€'} aides
                        </p>
                        <p className="text-sm font-bold text-primary-700 mt-0.5">
                          Net: {idx === 0 ? '7 600€' : '7 200€'}
                        </p>
                      </>
                    ) : (
                      <span className="text-sm text-amber-600 font-medium">Devis en attente</span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {artisan.certifications.map((cert: string) => (
                    <span key={cert} className="badge-rge">
                      <CheckCircle className="w-2.5 h-2.5" />
                      {cert}
                    </span>
                  ))}
                  {artisan.specialties.slice(0, 2).map((spec: string) => (
                    <span key={spec} className="badge-gray">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3 pt-4 border-t border-slate-100">
              <a
                href={`tel:${artisan.phone}`}
                className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900"
              >
                <Phone className="w-3.5 h-3.5" />
                {artisan.phone}
              </a>
              <div className="flex items-center gap-2 ml-auto">
                <button className="btn-secondary text-xs py-1.5 px-3 rounded-lg">
                  <MessageSquare className="w-3.5 h-3.5" />
                  Message
                </button>
                <Link
                  href={`/annuaire/${artisan.slug}`}
                  className="btn-primary text-xs py-1.5 px-3 rounded-lg"
                >
                  Voir profil
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
