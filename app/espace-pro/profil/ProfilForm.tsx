'use client'

import { useState } from 'react'
import { Save, CheckCircle, Plus, X, Loader2 } from 'lucide-react'
import { saveProfile } from './actions'

type Props = {
  userId: string
  profile: { first_name: string | null; last_name: string | null; phone: string | null }
  artisan: {
    id: string; name: string; siret: string; description: string | null
    address: string; city: string; zip_code: string; department: string
    phone: string | null; website: string | null
  } | null
  allSpecialties: { id: string; name: string; slug: string }[]
  allCertifications: { id: string; name: string; code: string }[]
  selectedSpecialtyIds: string[]
  selectedCertificationIds: string[]
}

export default function ProfilForm({
  userId, profile, artisan,
  allSpecialties, allCertifications,
  selectedSpecialtyIds, selectedCertificationIds,
}: Props) {
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [specs, setSpecs] = useState<string[]>(selectedSpecialtyIds)
  const [certs, setCerts] = useState<string[]>(selectedCertificationIds)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSaved(false)

    const fd = new FormData(e.currentTarget)
    fd.set('specialtyIds', JSON.stringify(specs))
    fd.set('certificationIds', JSON.stringify(certs))

    const result = await saveProfile(fd)
    if (result?.error) {
      setError(result.error)
    } else {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
    setSaving(false)
  }

  function toggleSpec(id: string) {
    setSpecs((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id])
  }

  function toggleCert(id: string) {
    setCerts((prev) => prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id])
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 lg:p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Mon profil</h1>
          <p className="text-slate-500 mt-1">Gérez les informations de votre fiche artisan</p>
        </div>
        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Enregistrement...' : saved ? 'Sauvegardé ✓' : 'Enregistrer'}
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">{error}</div>
      )}

      {!artisan && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
          Complétez toutes les informations ci-dessous pour créer votre fiche dans l'annuaire et commencer à recevoir des leads.
        </div>
      )}

      {/* Identité */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-5">
        <h2 className="font-semibold text-slate-900 mb-5">Identité de l&apos;entreprise</h2>
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Prénom du dirigeant</label>
              <input name="firstName" type="text" defaultValue={profile.first_name ?? ''} className="input-field" required />
            </div>
            <div>
              <label className="label">Nom du dirigeant</label>
              <input name="lastName" type="text" defaultValue={profile.last_name ?? ''} className="input-field" required />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Nom de l&apos;entreprise</label>
              <input name="companyName" type="text" defaultValue={artisan?.name ?? ''} className="input-field" required />
            </div>
            <div>
              <label className="label">SIRET</label>
              <input name="siret" type="text" defaultValue={artisan?.siret ?? ''} className="input-field" required />
            </div>
          </div>
        </div>
      </div>

      {/* Coordonnées */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-5">
        <h2 className="font-semibold text-slate-900 mb-5">Coordonnées</h2>
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Téléphone</label>
              <input name="phone" type="tel" defaultValue={artisan?.phone ?? profile.phone ?? ''} className="input-field" />
            </div>
            <div>
              <label className="label">Site web</label>
              <input name="website" type="url" defaultValue={artisan?.website ?? ''} placeholder="https://..." className="input-field" />
            </div>
          </div>
          <div>
            <label className="label">Adresse</label>
            <input name="address" type="text" defaultValue={artisan?.address ?? ''} className="input-field" required />
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="label">Code postal</label>
              <input name="zipCode" type="text" defaultValue={artisan?.zip_code ?? ''} className="input-field" required />
            </div>
            <div>
              <label className="label">Ville</label>
              <input name="city" type="text" defaultValue={artisan?.city ?? ''} className="input-field" required />
            </div>
            <div>
              <label className="label">Département</label>
              <input name="department" type="text" defaultValue={artisan?.department ?? ''} placeholder="Ex: 75" className="input-field" required />
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-5">
        <h2 className="font-semibold text-slate-900 mb-5">Description</h2>
        <textarea
          name="description"
          rows={5}
          defaultValue={artisan?.description ?? ''}
          placeholder="Présentez votre entreprise, vos spécialités et votre expérience..."
          className="input-field resize-none"
        />
        <p className="text-xs text-slate-400 mt-1.5">
          Une bonne description améliore votre positionnement dans l&apos;annuaire.
        </p>
      </div>

      {/* Spécialités */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-5">
        <h2 className="font-semibold text-slate-900 mb-4">Spécialités</h2>
        <div className="flex flex-wrap gap-2">
          {allSpecialties.map((s) => {
            const active = specs.includes(s.id)
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => toggleSpec(s.id)}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium border transition-colors ${
                  active
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-primary-400'
                }`}
              >
                {active ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                {s.name}
              </button>
            )
          })}
        </div>
      </div>

      {/* Certifications */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-5">
        <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-eco-600" />
          Certifications RGE
        </h2>
        <div className="flex flex-wrap gap-2">
          {allCertifications.map((c) => {
            const active = certs.includes(c.id)
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => toggleCert(c.id)}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium border transition-colors ${
                  active
                    ? 'bg-eco-600 text-white border-eco-600'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-eco-400'
                }`}
              >
                {active ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                {c.name}
              </button>
            )
          })}
        </div>
      </div>
    </form>
  )
}
