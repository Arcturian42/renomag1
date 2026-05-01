export const dynamic = 'force-dynamic'

import Image from 'next/image'
import { redirect } from 'next/navigation'
import { Camera, Save, CheckCircle, Award } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { updateArtisanProfileForm } from '@/app/actions/data'

async function handleProfileUpdate(formData: FormData) {
  'use server'
  await updateArtisanProfileForm(formData)
}

export default async function ProfilPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/connexion')
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: { profile: true, artisan: { include: { specialties: true, certifications: true } } },
  })

  if (!dbUser || dbUser.role !== 'ARTISAN') {
    redirect('/espace-proprietaire')
  }

  const artisan = dbUser.artisan
  const profile = dbUser.profile

  const scoreFields = [
    !!artisan?.name,
    !!artisan?.description && artisan.description.length > 50,
    !!artisan?.phone,
    !!artisan?.website,
    (artisan?.specialties?.length ?? 0) > 0,
  ]
  const profileScore = Math.round((scoreFields.filter(Boolean).length / scoreFields.length) * 100)

  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Mon profil</h1>
          <p className="text-slate-500 mt-1">Gérez les informations de votre fiche artisan</p>
        </div>
      </div>

      {/* Profile score */}
      <div className="bg-primary-50 border border-primary-200 rounded-xl p-4 mb-6 flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-primary-800 flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold">{profileScore}</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-primary-900">Score de profil : {profileScore}/100</p>
          <p className="text-xs text-primary-700 mt-0.5">
            Complétez votre galerie photos et votre description pour améliorer votre visibilité.
          </p>
        </div>
      </div>

      <form action={updateArtisanProfileForm} className="space-y-5">
        <input type="hidden" name="userId" value={user.id} />

        {/* Avatar & company */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-900 mb-5">Identité de l&apos;entreprise</h2>
          <div className="flex items-start gap-5">
            <div className="relative">
              <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-100">
                <Image
                  src={artisan?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(artisan?.name || 'Artisan')}&background=1e40af&color=fff&size=200`}
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
                  <label className="label" htmlFor="companyName">Nom de l&apos;entreprise</label>
                  <input
                    id="companyName" name="companyName" type="text"
                    defaultValue={artisan?.name || ''}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label" htmlFor="firstName">Prénom du dirigeant</label>
                  <input id="firstName" name="firstName" type="text" defaultValue={profile?.firstName || ''} className="input-field" />
                </div>
                <div>
                  <label className="label" htmlFor="lastName">Nom du dirigeant</label>
                  <input id="lastName" name="lastName" type="text" defaultValue={profile?.lastName || ''} className="input-field" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact info */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-900 mb-5">Coordonnées</h2>
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label" htmlFor="phone">Téléphone</label>
                <input id="phone" name="phone" type="tel" defaultValue={artisan?.phone || ''} className="input-field" />
              </div>
              <div>
                <label className="label" htmlFor="email">Email professionnel</label>
                <input id="email" name="email" type="email" defaultValue={artisan?.email || dbUser.email || ''} className="input-field" readOnly />
              </div>
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
            <div>
              <label className="label" htmlFor="website">Site web</label>
              <input id="website" name="website" type="url" defaultValue={artisan?.website || ''} className="input-field" />
            </div>
            <div>
              <label className="label" htmlFor="siret">SIRET</label>
              <input id="siret" name="siret" type="text" defaultValue={artisan?.siret || ''} className="input-field" />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
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

        {/* Specialties (read-only for now) */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Spécialités</h2>
          <div className="flex flex-wrap gap-2 mb-3">
            {artisan?.specialties?.map((spec) => (
              <span key={spec.id} className="badge-primary text-sm px-3 py-1 flex items-center gap-1">
                {spec.name}
              </span>
            ))}
            {(!artisan?.specialties || artisan.specialties.length === 0) && (
              <p className="text-sm text-slate-400">Aucune spécialité renseignée.</p>
            )}
          </div>
          <p className="text-xs text-slate-400">Contactez l&apos;administration pour modifier vos spécialités.</p>
        </div>

        {/* Certifications (read-only for now) */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Award className="w-4 h-4 text-eco-600" />
            Certifications RGE
          </h2>
          <div className="space-y-3">
            {artisan?.certifications?.map((cert) => (
              <div key={cert.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-eco-500" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{cert.name}</p>
                    <p className="text-xs text-slate-400">Code : {cert.code}</p>
                  </div>
                </div>
              </div>
            ))}
            {(!artisan?.certifications || artisan.certifications.length === 0) && (
              <p className="text-sm text-slate-400">Aucune certification renseignée.</p>
            )}
          </div>
        </div>

        {/* Zone d'intervention */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Zone d&apos;intervention</h2>
          <div className="space-y-3">
            <div>
              <label className="label" htmlFor="department">Département</label>
              <input id="department" name="department" type="text" defaultValue={artisan?.department || ''} className="input-field" readOnly />
            </div>
            <div>
              <label className="label" htmlFor="region">Région</label>
              <input id="region" name="region" type="text" defaultValue={artisan?.region || ''} className="input-field" />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" className="btn-primary px-5 py-2.5 flex items-center gap-2">
            <Save className="w-4 h-4" />
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  )
}
