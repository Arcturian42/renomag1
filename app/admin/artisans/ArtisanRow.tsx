'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Crown, CheckCircle, AlertCircle, Check, X } from 'lucide-react'
import { verifyArtisan, unverifyArtisan } from '@/app/actions/admin'
import { toast } from 'sonner'

type ArtisanRowProps = {
  artisan: {
    id: string
    name: string
    slug: string
    avatar: string | null
    premium: boolean
    verified: boolean
    city: string
    department: string
    phone: string | null
    rating: number
    reviewCount: number
    user: {
      email: string | null
    } | null
  }
}

export function ArtisanRow({ artisan }: ArtisanRowProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleVerificationToggle = async () => {
    setIsLoading(true)
    try {
      let result
      if (artisan.verified) {
        result = await unverifyArtisan(artisan.id)
        if (result.success) {
          toast.success('Artisan non vérifié')
        } else {
          toast.error(result.error || 'Une erreur est survenue')
        }
      } else {
        result = await verifyArtisan(artisan.id)
        if (result.success) {
          toast.success('Artisan vérifié')
        } else {
          toast.error(result.error || 'Une erreur est survenue')
        }
      }
    } catch (error) {
      toast.error('Une erreur est survenue')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
            <Image
              src={artisan.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(artisan.name)}&background=1e40af&color=fff&size=200`}
              alt={artisan.name}
              fill
              className="object-cover"
              sizes="48px"
            />
          </div>
          <div>
            <p className="font-medium text-slate-900 flex items-center gap-1">
              {artisan.name}
              {artisan.premium && <Crown className="w-3 h-3 text-accent-500" />}
            </p>
            <p className="text-xs text-slate-400">{artisan.user?.email || ''}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-4 text-slate-600">
        <p>{artisan.city}</p>
        <p className="text-xs text-slate-400">{artisan.department}</p>
      </td>
      <td className="px-4 py-4 text-slate-600">
        <p className="text-xs">{artisan.phone || '—'}</p>
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-1">
          <span className="text-sm font-semibold text-slate-900">
            {artisan.rating.toFixed(1)}
          </span>
          <span className="text-amber-400">⭐</span>
        </div>
        <p className="text-xs text-slate-400">{artisan.reviewCount} avis</p>
      </td>
      <td className="px-4 py-4">
        {artisan.verified ? (
          <span className="flex items-center gap-1 text-xs text-eco-700 bg-eco-50 rounded-full px-2 py-0.5 w-fit">
            <CheckCircle className="w-3 h-3" />
            Vérifié
          </span>
        ) : (
          <span className="flex items-center gap-1 text-xs text-amber-700 bg-amber-50 rounded-full px-2 py-0.5 w-fit">
            <AlertCircle className="w-3 h-3" />
            En attente
          </span>
        )}
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-2">
          <Link
            href={`/annuaire/${artisan.slug}`}
            className="text-xs text-primary-600 hover:text-primary-800 font-medium"
          >
            Voir
          </Link>
          <button
            onClick={handleVerificationToggle}
            disabled={isLoading}
            className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              artisan.verified
                ? 'bg-red-50 text-red-700 hover:bg-red-100'
                : 'bg-eco-50 text-eco-700 hover:bg-eco-100'
            }`}
          >
            {artisan.verified ? (
              <>
                <X className="w-3 h-3" />
                Retirer
              </>
            ) : (
              <>
                <Check className="w-3 h-3" />
                Vérifier
              </>
            )}
          </button>
        </div>
      </td>
    </tr>
  )
}
