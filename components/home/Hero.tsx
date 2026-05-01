import Link from 'next/link'
import { ArrowRight, ShieldCheck, Star, Users } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-brand-navy">
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-hero opacity-90" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptMC0zMHY2aDZ2LTZoLTZ6TTYgNHY2aDZWNEg2em0wIDMwdjZoNnYtNkg2eiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-28 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-1.5 text-sm text-white/90 mb-6">
              <span className="text-accent-400 text-base">✦</span>
              <span>La référence de la rénovation énergétique en France</span>
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
              Rénovez mieux,{' '}
              <span className="text-accent-400">payez moins</span>
            </h1>

            <p className="mt-6 text-lg text-white/70 leading-relaxed max-w-lg">
              Trouvez les meilleurs artisans RGE certifiés près de chez vous et profitez
              jusqu'à <strong className="text-white">70% d'aides</strong> avec MaPrimeRénov'
              et les CEE. Devis gratuit sous 24h.
            </p>

            {/* Quick search */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Votre ville ou code postal..."
                className="flex-1 rounded-xl bg-white/10 border border-white/20 px-5 py-3.5 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-accent-400/50 focus:border-accent-400 text-sm backdrop-blur-sm"
              />
              <Link
                href="/annuaire"
                className="btn-accent px-6 py-3.5 rounded-xl text-sm font-semibold whitespace-nowrap"
              >
                Trouver un artisan
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Social proof */}
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1.5">
                  {['JD', 'ML', 'PB', 'AM'].map((init, i) => (
                    <div
                      key={i}
                      className="w-7 h-7 rounded-full border-2 border-white/30 flex items-center justify-center text-xs font-bold text-white"
                      style={{
                        background: ['#2563eb', '#16a34a', '#f59e0b', '#0d9488'][i],
                      }}
                    >
                      {init}
                    </div>
                  ))}
                </div>
                <span className="text-sm text-white/70">
                  <strong className="text-white">+2 400</strong> artisans vérifiés
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-4 h-4 fill-accent-400 text-accent-400" />
                  ))}
                </div>
                <span className="text-sm text-white/70">
                  <strong className="text-white">4.8/5</strong> (1 200 avis)
                </span>
              </div>
            </div>
          </div>

          {/* Right content — trust card */}
          <div className="hidden lg:flex flex-col gap-4">
            {/* Subsidy card */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
              <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                <span className="text-2xl">💶</span> Estimez vos aides
              </h3>
              <div className="space-y-3">
                {[
                  { label: "MaPrimeRénov'", amount: 'Jusqu\'à 5 000€', color: 'bg-primary-500' },
                  { label: 'CEE', amount: 'Jusqu\'à 3 000€', color: 'bg-eco-500' },
                  { label: 'Éco-PTZ', amount: 'Jusqu\'à 50 000€', color: 'bg-accent-500' },
                  { label: 'TVA 5,5%', amount: '14,5% économisé', color: 'bg-purple-500' },
                ].map((aid) => (
                  <div key={aid.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${aid.color}`} />
                      <span className="text-sm text-white/80">{aid.label}</span>
                    </div>
                    <span className="text-sm font-semibold text-accent-300">{aid.amount}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/devis"
                className="mt-5 block text-center rounded-lg bg-accent-500 hover:bg-accent-600 text-white text-sm font-semibold py-2.5 transition-colors"
              >
                Calculer mes aides →
              </Link>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: <ShieldCheck className="w-5 h-5" />, label: 'Artisans\nvérifiés' },
                { icon: <Star className="w-5 h-5" />, label: 'Devis\ngratuits' },
                { icon: <Users className="w-5 h-5" />, label: '50 000+\nparticuliers' },
              ].map((badge) => (
                <div
                  key={badge.label}
                  className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-4 text-center"
                >
                  <div className="text-accent-400 flex justify-center mb-2">{badge.icon}</div>
                  <p className="text-xs text-white/80 leading-tight whitespace-pre-line">
                    {badge.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
