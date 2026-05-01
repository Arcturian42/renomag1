import { Star, Quote } from 'lucide-react'

const TESTIMONIALS = [
  {
    name: 'Sophie Martin',
    location: 'Paris (75)',
    avatar: 'SM',
    color: 'bg-primary-600',
    rating: 5,
    project: 'Isolation + PAC',
    savings: '4 200€',
    comment:
      'Grâce à RENOMAG, j\'ai trouvé mon artisan RGE en quelques minutes. Il m\'a aidé à obtenir 4 200€ de MaPrimeRénov\'. Ma facture de chauffage a baissé de 45% ! Je recommande à 100%.',
  },
  {
    name: 'Pierre Leblanc',
    location: 'Lyon (69)',
    avatar: 'PL',
    color: 'bg-eco-600',
    rating: 5,
    project: 'Panneaux solaires',
    savings: '6 800€',
    comment:
      'Excellent service. J\'ai reçu 3 devis en 24h, tous de qualité. Le processus pour les aides était simplifié et j\'ai économisé près de 7 000€ sur mon installation solaire.',
  },
  {
    name: 'Marie Dubois',
    location: 'Marseille (13)',
    avatar: 'MD',
    color: 'bg-accent-600',
    rating: 5,
    project: 'Isolation murs + fenêtres',
    savings: '3 100€',
    comment:
      'Je ne savais pas par où commencer pour ma rénovation. RENOMAG m\'a guidée à chaque étape et j\'ai finalement obtenu 3 100€ d\'aides. Mon DPE est passé de E à C !',
  },
  {
    name: 'François Dupont',
    location: 'Bordeaux (33)',
    avatar: 'FD',
    color: 'bg-purple-600',
    rating: 5,
    project: 'Chaudière biomasse',
    savings: '5 500€',
    comment:
      'Service professionnel de bout en bout. L\'artisan recommandé était vraiment expert dans son domaine. Les aides ont été versées rapidement. Très satisfait.',
  },
]

export default function Testimonials() {
  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="badge-accent mx-auto w-fit mb-3">Témoignages</div>
          <h2 className="section-title">Ils ont rénové avec RENOMAG</h2>
          <p className="section-subtitle">
            Des milliers de particuliers ont amélioré leur logement et réduit leurs factures
            grâce à notre plateforme.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="bg-slate-50 rounded-xl border border-slate-200 p-5 relative"
            >
              <Quote className="absolute top-4 right-4 w-5 h-5 text-slate-200" />
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center text-sm font-bold text-white flex-shrink-0`}
                >
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                  <p className="text-xs text-slate-400">{t.location}</p>
                </div>
              </div>
              <div className="flex mb-3">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-accent-400 text-accent-400" />
                ))}
              </div>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">"{t.comment}"</p>
              <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                <span className="text-xs text-slate-400">{t.project}</span>
                <span className="text-sm font-bold text-eco-600">-{t.savings}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Aggregate rating */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
          <div className="flex items-center gap-3">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-5 h-5 fill-accent-400 text-accent-400" />
              ))}
            </div>
            <div>
              <span className="text-2xl font-bold text-slate-900">4.8</span>
              <span className="text-slate-500 text-sm">/5</span>
            </div>
          </div>
          <div className="text-sm text-slate-500">
            Basé sur <strong className="text-slate-900">1 247 avis vérifiés</strong>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-eco-500 inline-block" />
            Avis certifiés Trustpilot
          </div>
        </div>
      </div>
    </section>
  )
}
