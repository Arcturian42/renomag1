import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import Image from 'next/image'
import { Camera, Plus, Save, CheckCircle, Award } from 'lucide-react'
import { updateArtisanProfileForm } from '@/app/actions/data'

export default async function ProfilPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/connexion')
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: { artisan: { include: { certifications: true, specialties: true } }, profile: true },
  })

  if (!dbUser || dbUser.role !== 'ARTISAN') {
    redirect('/espace-proprietaire')
  }

  const artisan = dbUser.artisan

  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Mon profil</h1>
          <p className="text-slate-500 mt-1">Gérez les informations de votre fiche artisan</p>
        </div>
      </div>

      <form action={updateArtisanProfileForm}>
        <input type="hidden" name="userId" value={user.id} />
        <input type="hidden" name="role" value="ARTISAN" />

        {/* Profile score */}
        <div className="bg-primary-50 border border-primary-200 rounded-xl p-4 mb-6 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary-800 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold">{artisan ? '75' : '30'}</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-primary-900">Score de profil : {artisan ? '75' : '30'}/100</p>
            <p className="text-xs text-primary-700 mt-0.5">
              Complétez votre fiche pour améliorer votre visibilité.
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
                  src={artisan?.logoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(artisan?.name || 'Artisan')}&background=1e40af&color=fff&size=200`}
                  alt="Avatar"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <button type="button" className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary-600 border-2 border-white flex items-center justify-center hover:bg-primary-700 transition-colors">
                <Camera className="w-3 h-3 text-white" />
              </button>
            </div>
            <div className="flex-1 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Nom de l&apos;entreprise</label>
                  <input
                    type="text"
                    name="companyName"
                    defaultValue={artisan?.name || ''}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label">SIRET</label>
                  <input type="text" name="siret" defaultValue={artisan?.siret || ''} className="input-field" />
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
                <label className="label">Téléphone</label>
                <input type="tel" name="phone" defaultValue={artisan?.phone || ''} className="input-field" />
              </div>
              <div>
                <label className="label">Email professionnel</label>
                <input
                  type="email"
                  defaultValue={dbUser.email}
                  readOnly
                  className="input-field bg-slate-50"
                />
              </div>
            </div>
            <div>
              <label className="label">Adresse</label>
              <input
                type="text"
                name="address"
                defaultValue={artisan?.address || ''}
                className="input-field"
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Ville</label>
                <input type="text" name="city" defaultValue={artisan?.city || ''} className="input-field" />
              </div>
              <div>
                <label className="label">Code postal</label>
                <input type="text" name="zipCode" defaultValue={artisan?.zipCode || ''} className="input-field" />
              </div>
            </div>
            <div>
              <label className="label">Site web</label>
              <input
                type="url"
                name="website"
                defaultValue={artisan?.website || ''}
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-5">
          <h2 className="font-semibold text-slate-900 mb-5">Description</h2>
          <div>
            <label className="label">Présentation de votre entreprise</label>
            <textarea
              name="description"
              rows={5}
              defaultValue={artisan?.description || ''}
              className="input-field resize-none"
            />
            <p className="text-xs text-slate-400 mt-1.5">
              Une bonne description améliore votre positionnement dans l&apos;annuaire.
            </p>
          </div>
        </div>

        {/* Specialties */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-5">
          <h2 className="font-semibold text-slate-900 mb-4">Spécialités</h2>
          <div className="flex flex-wrap gap-2 mb-3">
            {artisan?.specialties.map((spec) => (
              <span key={spec.id} className="badge-primary text-sm px-3 py-1 flex items-center gap-1">
                {spec.name}
                <button type="button" className="text-primary-400 hover:text-primary-700 ml-1">×</button>
              </span>
            )) || (
              <span className="text-sm text-slate-500">Aucune spécialité renseignée.</span>
            )}
            <button type="button" className="flex items-center gap-1 badge-gray text-sm px-3 py-1 hover:bg-slate-200 transition-colors">
              <Plus className="w-3 h-3" />
              Ajouter
            </button>
          </div>
        </div>

        {/* Certifications */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-5">
          <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Award className="w-4 h-4 text-eco-600" />
            Certifications RGE
          </h2>
          <div className="space-y-3">
            {artisan?.certifications.map((c) => (
              <div key={c.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-eco-500" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{c.name}</p>
                    <p className="text-xs text-slate-400">Code : {c.code}</p>
                  </div>
                </div>
              </div>
            )) || (
              <p className="text-sm text-slate-500">Aucune certification enregistrée.</p>
            )}
            <button type="button" className="flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-800 transition-colors mt-2">
              <Plus className="w-4 h-4" />
              Ajouter une certification
            </button>
          </div>
        </div>

        {/* Zone d'intervention */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
          <h2 className="font-semibold text-slate-900 mb-4">Zone d&apos;intervention</h2>
          <div className="space-y-3">
            <div>
              <label className="label">Départements couverts</label>
              <input
                type="text"
                defaultValue={artisan?.department || ''}
                placeholder="Ex: 75, 92, 93..."
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Rayon maximum (km)</label>
              <select className="input-field" defaultValue="50">
                <option value="25">25 km</option>
                <option value="50">50 km</option>
                <option value="100">100 km</option>
                <option value="150">150 km</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" className="btn-primary">
            <Save className="w-4 h-4" />
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  )
}
