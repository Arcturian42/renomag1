export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import Image from 'next/image'
import { Camera, Plus, Save, CheckCircle, Award } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { Role } from '@prisma/client'
import { updateArtisanProfile } from '@/app/actions/artisan'
import CertificationUpload from '@/components/upload/CertificationUpload'

export default async function ProfilPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/connexion')

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: { artisan: true },
  })

  if (!dbUser || dbUser.role !== Role.ARTISAN) {
    redirect('/espace-proprietaire')
  }

  const artisan = dbUser.artisan
  const initials = artisan?.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || 'AR'

  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <form action={updateArtisanProfile} className="space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Mon profil</h1>
            <p className="text-slate-500 mt-1">Gérez les informations de votre fiche artisan</p>
          </div>
          <button type="submit" className="btn-primary">
            <Save className="w-4 h-4" />
            Enregistrer
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
                    defaultValue={artisan?.email || dbUser.email || ''}
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

      {/* Certifications upload */}
      {artisan && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Certifications et documents</h2>
          <p className="text-sm text-slate-500 mb-4">
            Téléchargez vos certifications RGE, assurances et autres documents justificatifs
          </p>
          <CertificationUpload
            artisanId={artisan.id}
            existingFiles={(artisan.certificationDocs as any) || []}
          />
        </div>
      )}
    </div>
  )
}
