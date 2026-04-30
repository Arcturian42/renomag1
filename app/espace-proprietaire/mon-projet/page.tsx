import { MapPin, Home, Calendar, Wrench, Euro } from 'lucide-react'
import Link from 'next/link'

export default function MonProjetPage() {
  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Mon projet</h1>
        <p className="text-slate-500 mt-1">Détails de votre demande de rénovation</p>
      </div>

      {/* Project summary */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-5">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-slate-900">Résumé du projet</h2>
          <button className="text-xs text-primary-600 hover:text-primary-800 font-medium">
            Modifier
          </button>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
              <Wrench className="w-4 h-4 text-primary-700" />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Travaux</p>
              <p className="text-sm font-medium text-slate-900 mt-0.5">Isolation des combles</p>
              <p className="text-sm font-medium text-slate-900">Pompe à chaleur air/eau</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-eco-100 flex items-center justify-center flex-shrink-0">
              <Home className="w-4 h-4 text-eco-700" />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Logement</p>
              <p className="text-sm font-medium text-slate-900 mt-0.5">Maison individuelle</p>
              <p className="text-sm text-slate-500">Construite entre 1975-1990</p>
              <p className="text-sm text-slate-500">120m²</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-4 h-4 text-purple-700" />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Localisation</p>
              <p className="text-sm font-medium text-slate-900 mt-0.5">75002 Paris</p>
              <p className="text-sm text-slate-500">Île-de-France</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent-100 flex items-center justify-center flex-shrink-0">
              <Euro className="w-4 h-4 text-accent-700" />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Budget estimé</p>
              <p className="text-sm font-medium text-slate-900 mt-0.5">10 000€ – 20 000€</p>
              <p className="text-sm text-slate-500">Ménage intermédiaire</p>
            </div>
          </div>
        </div>
      </div>

      {/* Subsidy estimate */}
      <div className="bg-eco-50 border border-eco-200 rounded-xl p-6 mb-5">
        <h2 className="font-semibold text-eco-900 mb-4">Estimation de vos aides</h2>
        <div className="space-y-3">
          {[
            { name: "MaPrimeRénov'", amount: '2 000€', color: 'bg-blue-500' },
            { name: 'CEE', amount: '800€', color: 'bg-green-500' },
            { name: 'TVA 5,5%', amount: '~1 100€', color: 'bg-purple-500' },
          ].map((aid) => (
            <div key={aid.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${aid.color}`} />
                <span className="text-sm text-eco-800">{aid.name}</span>
              </div>
              <span className="text-sm font-bold text-eco-700">{aid.amount}</span>
            </div>
          ))}
          <div className="pt-3 border-t border-eco-200 flex items-center justify-between">
            <span className="text-sm font-bold text-eco-900">Total estimé</span>
            <span className="text-lg font-bold text-eco-700">≈ 3 900€</span>
          </div>
        </div>
        <p className="text-xs text-eco-600 mt-3">
          Estimation indicative. Le montant exact sera calculé par votre artisan.
        </p>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary-600" />
          Calendrier prévisionnel
        </h2>
        <div className="space-y-3 text-sm">
          {[
            { phase: 'Réception de tous les devis', date: 'Avant le 20 avril 2024', status: 'current' },
            { phase: 'Choix de l\'artisan', date: '20-25 avril 2024', status: 'pending' },
            { phase: 'Dépôt dossier MaPrimeRénov\'', date: 'Avant début des travaux', status: 'pending' },
            { phase: 'Réalisation des travaux', date: 'Mai-Juin 2024', status: 'pending' },
            { phase: 'Réception des aides', date: '2-3 mois après travaux', status: 'pending' },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                item.status === 'current' ? 'bg-primary-500' : 'bg-slate-300'
              }`} />
              <p className={item.status === 'current' ? 'text-slate-900 font-medium' : 'text-slate-500'}>
                {item.phase}
              </p>
              <p className="ml-auto text-xs text-slate-400 whitespace-nowrap">{item.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
