import Image from 'next/image'
import { Camera, Plus, Save, CheckCircle, Award } from 'lucide-react'

export default function ProfilPage() {
  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Mon profil</h1>
          <p className="text-slate-500 mt-1">Gérez les informations de votre fiche artisan</p>
        </div>
        <button className="btn-primary">
          <Save className="w-4 h-4" />
          Enregistrer
        </button>
      </div>

      {/* Profile score */}
      <div className="bg-primary-50 border border-primary-200 rounded-xl p-4 mb-6 flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-primary-800 flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold">82</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-primary-900">Score de profil : 82/100</p>
          <p className="text-xs text-primary-700 mt-0.5">
            Complétez votre galerie photos et votre description pour améliorer votre visibilité.
          </p>
        </div>
      </div>

      {/* Avatar & company */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-5">
        <h2 className="font-semibold text-slate-900 mb-5">Identité de l'entreprise</h2>
        <div className="flex items-start gap-5">
          <div className="relative">
            <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-100">
              <Image
                src="https://ui-avatars.com/api/?name=ThermoConfort+Paris&background=1e40af&color=fff&size=200"
                alt="Avatar"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary-600 border-2 border-white flex items-center justify-center hover:bg-primary-700 transition-colors">
              <Camera className="w-3 h-3 text-white" />
            </button>
          </div>
          <div className="flex-1 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Nom de l'entreprise</label>
                <input
                  type="text"
                  defaultValue="ThermoConfort Paris"
                  className="input-field"
                />
              </div>
              <div>
                <label className="label">Nom du dirigeant</label>
                <input type="text" defaultValue="Jean-Marc Durand" className="input-field" />
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
              <input type="tel" defaultValue="01 23 45 67 89" className="input-field" />
            </div>
            <div>
              <label className="label">Email professionnel</label>
              <input
                type="email"
                defaultValue="contact@thermoconfort-paris.fr"
                className="input-field"
              />
            </div>
          </div>
          <div>
            <label className="label">Adresse</label>
            <input
              type="text"
              defaultValue="12 rue de la Paix, 75002 Paris"
              className="input-field"
            />
          </div>
          <div>
            <label className="label">Site web</label>
            <input
              type="url"
              defaultValue="https://thermoconfort-paris.fr"
              className="input-field"
            />
          </div>
          <div>
            <label className="label">SIRET</label>
            <input
              type="text"
              defaultValue="123 456 789 00012"
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
            rows={5}
            defaultValue="Spécialiste de l'isolation thermique et des pompes à chaleur depuis 15 ans, ThermoConfort Paris accompagne les particuliers et professionnels dans leurs projets de rénovation énergétique. Certifié RGE, nous garantissons des travaux de qualité et vous aidons à maximiser vos aides MaPrimeRénov'."
            className="input-field resize-none"
          />
          <p className="text-xs text-slate-400 mt-1.5">
            Une bonne description améliore votre positionnement dans l'annuaire.
          </p>
        </div>
      </div>

      {/* Specialties */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-5">
        <h2 className="font-semibold text-slate-900 mb-4">Spécialités</h2>
        <div className="flex flex-wrap gap-2 mb-3">
          {['Isolation thermique', 'Pompe à chaleur', 'VMC Double flux'].map((spec) => (
            <span key={spec} className="badge-primary text-sm px-3 py-1 flex items-center gap-1">
              {spec}
              <button className="text-primary-400 hover:text-primary-700 ml-1">×</button>
            </span>
          ))}
          <button className="flex items-center gap-1 badge-gray text-sm px-3 py-1 hover:bg-slate-200 transition-colors">
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
          {[
            { cert: 'RGE', expiry: '31/12/2025', valid: true },
            { cert: 'QualiPAC', expiry: '30/06/2025', valid: true },
            { cert: 'Eco Artisan', expiry: '31/03/2024', valid: false },
          ].map((c) => (
            <div key={c.cert} className="flex items-center justify-between p-3 rounded-lg border border-slate-100">
              <div className="flex items-center gap-3">
                <CheckCircle
                  className={`w-4 h-4 ${c.valid ? 'text-eco-500' : 'text-red-400'}`}
                />
                <div>
                  <p className="text-sm font-semibold text-slate-900">{c.cert}</p>
                  <p className="text-xs text-slate-400">Expire : {c.expiry}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!c.valid && (
                  <span className="text-xs font-medium text-red-600 bg-red-50 rounded-full px-2 py-0.5">
                    Expiré
                  </span>
                )}
                <button className="text-xs text-primary-600 hover:text-primary-800">
                  Mettre à jour
                </button>
              </div>
            </div>
          ))}
          <button className="flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-800 transition-colors mt-2">
            <Plus className="w-4 h-4" />
            Ajouter une certification
          </button>
        </div>
      </div>

      {/* Zone d'intervention */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="font-semibold text-slate-900 mb-4">Zone d'intervention</h2>
        <div className="space-y-3">
          <div>
            <label className="label">Départements couverts</label>
            <input
              type="text"
              defaultValue="75, 77, 78, 91, 92, 93, 94, 95"
              placeholder="Ex: 75, 92, 93..."
              className="input-field"
            />
          </div>
          <div>
            <label className="label">Rayon maximum (km)</label>
            <select className="input-field">
              <option value="25">25 km</option>
              <option value="50" selected>50 km</option>
              <option value="100">100 km</option>
              <option value="150">150 km</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}
