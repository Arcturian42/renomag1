import Link from 'next/link'
import { WORK_TYPES } from '@/lib/data/subsidies'
import { formatPrice } from '@/lib/utils'
import { ArrowRight } from 'lucide-react'

export default function WorkTypes() {
  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="badge-primary mx-auto w-fit mb-3">Types de travaux</div>
          <h2 className="section-title">Quels travaux souhaitez-vous réaliser ?</h2>
          <p className="section-subtitle">
            Sélectionnez votre type de travaux pour découvrir les aides disponibles et trouver
            les artisans spécialisés.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {WORK_TYPES.map((work) => (
            <Link
              key={work.id}
              href={`/annuaire?specialite=${work.id}`}
              className="group bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md hover:border-primary-200 transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">{work.icon}</span>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">{work.name}</h3>
              <p className="text-xs text-slate-500 mb-3 leading-relaxed">{work.description}</p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  Budget : {formatPrice(work.avgCost[0])} – {formatPrice(work.avgCost[1])}
                </span>
                <span className="font-semibold text-eco-600">
                  -{work.avgSaving} facture
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-1">
                {work.aids.slice(0, 3).map((aid) => (
                  <span key={aid} className="badge-gray text-xs">
                    {aid.toUpperCase()}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
