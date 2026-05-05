'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Camera, Save } from 'lucide-react'
import Image from 'next/image'
import { updateArtisanProfile } from '@/app/actions/artisan'

interface ProfileFormProps {
  artisan: any
  userEmail: string
}

export default function ProfileForm({ artisan, userEmail }: ProfileFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const initials = artisan?.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || 'AR'

  // Check for success/error parameters on mount
  useEffect(() => {
    if (searchParams.get('success') === '1') {
      setSuccess('✅ Profil enregistré avec succès !')
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000)
      // Remove success param from URL
      router.replace('/espace-pro/profil', { scroll: false })
    }
    if (searchParams.get('error') === '1') {
      setError('❌ Erreur lors de l\'enregistrement. Veuillez réessayer.')
      // Remove error param from URL
      router.replace('/espace-pro/profil', { scroll: false })
    }
  }, [searchParams, router])

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      await updateArtisanProfile(formData)
      // Success will be handled by the redirect and useEffect
    } catch (e: any) {
      console.error('Profile update error:', e)
      setError('Erreur lors de l\'enregistrement. Veuillez réessayer.')
      setLoading(false)
    }
  }

  return (
    <>
      {/* Success Message */}
      {success && (
        <div className="fixed top-4 right-4 z-50 bg-eco-50 border border-eco-200 text-eco-800 px-4 py-3 rounded-lg shadow-lg animate-slide-in-right">
          {success}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <form action={handleSubmit} className="space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Mon profil</h1>
            <p className="text-slate-500 mt-1">Gérez les informations de votre fiche artisan</p>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>

        {/* Profile score */}
        <div className="bg-primary-50 border border-primary-200 rounded-xl p-4 mb-6 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary-800 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold">{artisan?.description ? 90 : 60}</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-primary-900">Score de profil : {artisan?.description ? 90 : 60}/100</p>
            <p className="text-xs text-primary-700 mt-0.5">
              Complétez votre description pour améliorer votre visibilité.
            </p>
          </div>
        </div>

        {/* Avatar & company */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-5">
          <h2 className="font-semibold text-slate-900 mb-5">Identité de l&apos;entreprise</h2>
          <div className="flex items-start gap-5">
            <div className="relative">
              <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-100">
                <Image
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=1e40af&color=fff&size=200`}
                  alt="Avatar"
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
              <button type="button" className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary-600 border-2 border-white flex items-center justify-center hover:bg-primary-700 transition-colors">
                <Camera className="w-3 h-3 text-white" />
              </button>
            </div>
            <div className="flex-1 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label" htmlFor="name">Nom de l&apos;entreprise</label>
                  <input
                    id="name" name="name" type="text"
                    defaultValue={artisan?.name || ''}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label" htmlFor="email">Email professionnel</label>
                  <input
                    id="email" name="email" type="email"
                    defaultValue={artisan?.email || userEmail || ''}
                    className="input-field"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact info */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-5">
          <h2 className="font-semibold text-slate-900 mb-5">Coordonnées</h2>
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label" htmlFor="phone">Téléphone</label>
                <input id="phone" name="phone" type="tel" defaultValue={artisan?.phone || ''} className="input-field" />
              </div>
              <div>
                <label className="label" htmlFor="website">Site web</label>
                <input id="website" name="website" type="url" defaultValue={artisan?.website || ''} className="input-field" />
              </div>
            </div>
            <div>
              <label className="label" htmlFor="googleBusinessUrl">Google Business Profile URL</label>
              <input
                id="googleBusinessUrl"
                name="googleBusinessUrl"
                type="url"
                defaultValue={artisan?.googleBusinessUrl || ''}
                className="input-field"
                placeholder="https://g.page/votre-entreprise"
              />
              <p className="text-xs text-slate-400 mt-1.5">
                Ajoutez le lien vers votre fiche Google My Business pour améliorer votre visibilité.
              </p>
            </div>
            <div>
              <label className="label" htmlFor="address">Adresse</label>
              <input id="address" name="address" type="text" defaultValue={artisan?.address || ''} className="input-field" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label" htmlFor="city">Ville</label>
                <input id="city" name="city" type="text" defaultValue={artisan?.city || ''} className="input-field" />
              </div>
              <div>
                <label className="label" htmlFor="zipCode">Code postal</label>
                <input id="zipCode" name="zipCode" type="text" defaultValue={artisan?.zipCode || ''} className="input-field" />
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-5">
          <h2 className="font-semibold text-slate-900 mb-5">Description</h2>
          <div>
            <label className="label" htmlFor="description">Présentation de votre entreprise</label>
            <textarea
              id="description" name="description" rows={5}
              defaultValue={artisan?.description || ''}
              className="input-field resize-none"
            />
            <p className="text-xs text-slate-400 mt-1.5">
              Une bonne description améliore votre positionnement dans l&apos;annuaire.
            </p>
          </div>
        </div>

        {/* Zone d'intervention */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Zone d&apos;intervention</h2>
          <div className="space-y-3">
            <div>
              <label className="label" htmlFor="departments">Départements couverts</label>
              <input
                id="departments" name="departments" type="text"
                defaultValue={artisan?.department || ''}
                placeholder="Ex: 75, 92, 93..."
                className="input-field"
              />
            </div>
          </div>
        </div>
      </form>
    </>
  )
}
