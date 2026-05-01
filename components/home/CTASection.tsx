import Link from 'next/link'
import { ArrowRight, Building2 } from 'lucide-react'

export default function CTASection() {
  return (
    <section className="py-20 gradient-hero relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-white opacity-40" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10">
          {/* Particulier CTA */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-8">
            <div className="text-4xl mb-4">🏠</div>
            <h3 className="text-2xl font-bold text-white mb-3">Vous êtes particulier ?</h3>
            <p className="text-white/70 mb-6 leading-relaxed">
              Obtenez vos devis gratuits en 24h et profitez de jusqu'à 70% d'aides pour financer
              votre rénovation énergétique.
            </p>
            <ul className="space-y-2 mb-7">
              {[
                '✓ Devis gratuit sans engagement',
                '✓ 3 artisans RGE sélectionnés',
                "✓ Aide au montage MaPrimeRénov'",
                '✓ Suivi de projet en ligne',
              ].map((item) => (
                <li key={item} className="text-sm text-white/80">
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/devis"
              className="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white font-semibold rounded-xl px-6 py-3 text-sm transition-colors"
            >
              Obtenir mes devis gratuits
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Pro CTA */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-8">
            <div className="text-4xl mb-4">
              <Building2 className="w-10 h-10 text-accent-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Vous êtes artisan RGE ?</h3>
            <p className="text-white/70 mb-6 leading-relaxed">
              Rejoignez notre réseau et recevez des leads qualifiés directement dans votre
              zone d'intervention. Développez votre activité.
            </p>
            <ul className="space-y-2 mb-7">
              {[
                '✓ Leads qualifiés et géolocalisés',
                '✓ Profil professionnel optimisé SEO',
                '✓ Gestion simplifiée des devis',
                '✓ Support dédié',
              ].map((item) => (
                <li key={item} className="text-sm text-white/80">
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/tarifs"
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-900 font-semibold rounded-xl px-6 py-3 text-sm transition-colors"
            >
              Voir nos offres professionnelles
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
