import type { Metadata } from 'next'
import Link from 'next/link'
import { AIDS, WORK_TYPES } from '@/lib/data/subsidies'
import { formatPrice } from '@/lib/utils'
import { CheckCircle, ArrowRight, Calculator, Info } from 'lucide-react'

export const metadata: Metadata = {
  title: "Aides à la rénovation énergétique 2024 — MaPrimeRénov', CEE, Éco-PTZ",
  description:
    "Découvrez toutes les aides disponibles pour financer vos travaux de rénovation énergétique : MaPrimeRénov', CEE, Éco-PTZ, TVA réduite. Simulez votre financement.",
}

const INCOME_BRACKETS = [
  {
    profile: 'Ménages très modestes',
    color: 'bg-blue-600',
    textColor: 'text-blue-700',
    bgLight: 'bg-blue-50',
    borderColor: 'border-blue-200',
    solo: '20 489€',
    couple: '29 148€',
    rate: 'Jusqu\'à 70%',
  },
  {
    profile: 'Ménages modestes',
    color: 'bg-yellow-500',
    textColor: 'text-yellow-700',
    bgLight: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    solo: '25 069€',
    couple: '36 816€',
    rate: 'Jusqu\'à 50%',
  },
  {
    profile: 'Ménages intermédiaires',
    color: 'bg-purple-500',
    textColor: 'text-purple-700',
    bgLight: 'bg-purple-50',
    borderColor: 'border-purple-200',
    solo: '38 353€',
    couple: '56 130€',
    rate: 'Jusqu\'à 40%',
  },
  {
    profile: 'Ménages supérieurs',
    color: 'bg-rose-500',
    textColor: 'text-rose-700',
    bgLight: 'bg-rose-50',
    borderColor: 'border-rose-200',
    solo: 'Supérieur',
    couple: 'Supérieur',
    rate: 'Jusqu\'à 30%',
  },
]

export default function AidesPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-eco-800 to-primary-900 text-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="badge-rge mb-4 w-fit">Aides 2024</div>
            <h1 className="text-4xl font-bold">
              Financez jusqu'à{' '}
              <span className="text-accent-400">70% de vos travaux</span>
            </h1>
            <p className="mt-4 text-white/70 text-lg leading-relaxed">
              Découvrez toutes les aides disponibles pour votre rénovation énergétique et
              calculez votre financement en quelques minutes.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/devis" className="btn-accent px-6 py-3">
                <Calculator className="w-4 h-4" />
                Simuler mes aides
              </Link>
              <Link href="/annuaire" className="btn-secondary bg-white/10 text-white border-white/20 hover:bg-white/20 px-6 py-3">
                Trouver un artisan RGE
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Main aids grid */}
        <div className="mb-14">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Les principales aides disponibles</h2>
          <p className="text-slate-500 mb-8">Ces aides sont cumulables entre elles pour maximiser votre financement.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {AIDS.map((aid) => (
              <div
                key={aid.id}
                id={aid.id}
                className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{aid.logo}</span>
                  <div>
                    <h3 className="font-bold text-slate-900">{aid.name}</h3>
                    <span className="text-xs font-semibold text-primary-600">{aid.shortName}</span>
                  </div>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  {aid.description}
                </p>
                <div className="bg-eco-50 border border-eco-200 rounded-lg p-3 mb-4">
                  <p className="text-sm font-semibold text-eco-800">{aid.maxAmount}</p>
                </div>
                <div className="space-y-1.5">
                  {aid.eligibility.map((e) => (
                    <div key={e} className="flex items-center gap-2 text-xs text-slate-600">
                      <CheckCircle className="w-3 h-3 text-eco-500 flex-shrink-0" />
                      {e}
                    </div>
                  ))}
                </div>
                <a
                  href={aid.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex items-center gap-1 text-xs text-primary-600 hover:text-primary-800 transition-colors"
                >
                  En savoir plus
                  <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Income brackets */}
        <div className="mb-14 bg-slate-50 rounded-2xl p-8">
          <div className="flex items-start gap-3 mb-6">
            <Info className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Montants MaPrimeRénov' selon vos revenus
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Le montant de votre aide dépend de votre revenu fiscal de référence (RFR).
              </p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {INCOME_BRACKETS.map((bracket) => (
              <div
                key={bracket.profile}
                className={`rounded-xl border ${bracket.borderColor} ${bracket.bgLight} p-4`}
              >
                <div className={`w-3 h-3 rounded-full ${bracket.color} mb-3`} />
                <h3 className={`font-semibold text-sm ${bracket.textColor} mb-2`}>
                  {bracket.profile}
                </h3>
                <p className="text-xs text-slate-600 mb-1">
                  Seul : &lt; {bracket.solo}
                </p>
                <p className="text-xs text-slate-600 mb-3">
                  Couple : &lt; {bracket.couple}
                </p>
                <p className={`text-lg font-bold ${bracket.textColor}`}>{bracket.rate}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Work types with aids */}
        <div className="mb-14">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Aides par type de travaux
          </h2>
          <p className="text-slate-500 mb-8">
            Découvrez les aides disponibles pour chaque type de rénovation.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Travaux</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Budget moyen</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Économie facture</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Aides disponibles</th>
                  <th className="py-3 px-4" />
                </tr>
              </thead>
              <tbody>
                {WORK_TYPES.map((work) => (
                  <tr key={work.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{work.icon}</span>
                        <div>
                          <p className="font-medium text-slate-900">{work.name}</p>
                          <p className="text-xs text-slate-400">{work.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-600">
                      {formatPrice(work.avgCost[0])} – {formatPrice(work.avgCost[1])}
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-eco-600 font-semibold">{work.avgSaving}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-1">
                        {work.aids.map((aid) => (
                          <span key={aid} className="badge-primary text-xs">
                            {aid.toUpperCase()}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Link
                        href="/devis"
                        className="text-xs font-medium text-primary-600 hover:text-primary-800 whitespace-nowrap"
                      >
                        Simuler →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-primary-800 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-3">Calculez vos aides personnalisées</h2>
          <p className="text-primary-200 mb-6 max-w-xl mx-auto">
            Notre simulateur prend en compte vos revenus, vos travaux et votre situation pour
            calculer précisément le montant de vos aides.
          </p>
          <Link href="/devis" className="btn-accent px-8 py-3">
            <Calculator className="w-4 h-4" />
            Simuler mes aides gratuitement
          </Link>
        </div>
      </div>
    </div>
  )
}
