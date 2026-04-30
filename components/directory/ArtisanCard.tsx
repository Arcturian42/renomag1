import Link from 'next/link'
import Image from 'next/image'
import { Star, MapPin, Clock, CheckCircle, Crown } from 'lucide-react'
import type { Artisan } from '@/lib/data/artisans'

type Props = {
  artisan: Artisan
  variant?: 'default' | 'compact'
}

export default function ArtisanCard({ artisan, variant = 'default' }: Props) {
  if (variant === 'compact') {
    return (
      <Link
        href={`/annuaire/${artisan.slug}`}
        className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-200 hover:shadow-md hover:border-primary-200 transition-all duration-200"
      >
        <div className="relative flex-shrink-0 w-12 h-12 rounded-xl overflow-hidden">
          <Image src={artisan.avatar} alt={artisan.name} fill className="object-cover" sizes="48px" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-sm font-semibold text-slate-900 truncate">{artisan.company}</p>
            {artisan.premium && <Crown className="w-3 h-3 text-accent-500 flex-shrink-0" />}
          </div>
          <p className="text-xs text-slate-500">{artisan.city}</p>
        </div>
        <div className="ml-auto flex items-center gap-1 flex-shrink-0">
          <Star className="w-3.5 h-3.5 fill-accent-400 text-accent-400" />
          <span className="text-sm font-medium text-slate-700">{artisan.rating}</span>
        </div>
      </Link>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md hover:border-slate-300 transition-all duration-200">
      {/* Header */}
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className="relative flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden bg-slate-100">
            <Image src={artisan.avatar} alt={artisan.name} fill className="object-cover" sizes="56px" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-slate-900 truncate">{artisan.company}</h3>
              {artisan.premium && (
                <span className="badge-accent text-xs">
                  <Crown className="w-2.5 h-2.5" />
                  Premium
                </span>
              )}
              {artisan.verified && (
                <CheckCircle className="w-4 h-4 text-eco-500 flex-shrink-0" />
              )}
            </div>
            <p className="text-sm text-slate-500 mt-0.5">{artisan.name}</p>
            <div className="flex items-center gap-1 mt-1">
              <MapPin className="w-3 h-3 text-slate-400" />
              <span className="text-xs text-slate-400">{artisan.department}</span>
            </div>
          </div>
          <div className="flex-shrink-0 text-right">
            <div className="flex items-center gap-1 justify-end">
              <Star className="w-4 h-4 fill-accent-400 text-accent-400" />
              <span className="text-sm font-semibold text-slate-900">{artisan.rating}</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {artisan.reviewCount} avis
            </p>
          </div>
        </div>

        {/* Certifications */}
        <div className="flex flex-wrap gap-1.5 mt-4">
          {artisan.certifications.map((cert) => (
            <span key={cert} className="badge-rge">
              <CheckCircle className="w-2.5 h-2.5" />
              {cert}
            </span>
          ))}
        </div>

        {/* Specialties */}
        <div className="flex flex-wrap gap-1.5 mt-2">
          {artisan.specialties.map((spec) => (
            <span key={spec} className="badge-gray">
              {spec}
            </span>
          ))}
        </div>

        {/* Description */}
        <p className="mt-3 text-xs text-slate-500 line-clamp-2 leading-relaxed">
          {artisan.description}
        </p>
      </div>

      {/* Footer */}
      <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Répond en {artisan.responseTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>{artisan.projectCount} chantiers</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {artisan.available ? (
            <span className="flex items-center gap-1 text-xs text-eco-600 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-eco-500 inline-block" />
              Disponible
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 inline-block" />
              Occupé
            </span>
          )}
          <Link
            href={`/annuaire/${artisan.slug}`}
            className="btn-primary text-xs py-1.5 px-3 rounded-lg"
          >
            Voir le profil
          </Link>
        </div>
      </div>
    </div>
  )
}
