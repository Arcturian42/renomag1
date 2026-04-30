import Link from 'next/link'
import { Search, ClipboardList, Wrench, Banknote } from 'lucide-react'

const STEPS = [
  {
    number: '01',
    icon: <ClipboardList className="w-6 h-6" />,
    title: 'Décrivez votre projet',
    description:
      'Remplissez notre formulaire simple en 2 minutes. Type de travaux, logement, revenus — nous précalculons vos aides.',
    color: 'bg-primary-100 text-primary-700',
  },
  {
    number: '02',
    icon: <Search className="w-6 h-6" />,
    title: 'Nous trouvons les meilleurs artisans',
    description:
      'Notre algorithme sélectionne les 3 artisans RGE les plus adaptés à votre projet dans votre zone géographique.',
    color: 'bg-eco-100 text-eco-700',
  },
  {
    number: '03',
    icon: <Wrench className="w-6 h-6" />,
    title: 'Choisissez et réalisez les travaux',
    description:
      'Comparez les devis gratuits, choisissez votre artisan, et réalisez vos travaux en toute sérénité.',
    color: 'bg-accent-100 text-accent-700',
  },
  {
    number: '04',
    icon: <Banknote className="w-6 h-6" />,
    title: 'Percevez vos aides',
    description:
      'Votre artisan vous accompagne dans le montage du dossier MaPrimeRénov\' et CEE. Vous recevez vos aides directement.',
    color: 'bg-purple-100 text-purple-700',
  },
]

export default function HowItWorks() {
  return (
    <section className="py-20 bg-white" id="comment-ca-marche">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="badge-primary mx-auto w-fit mb-3">Simple et rapide</div>
          <h2 className="section-title">Comment ça marche ?</h2>
          <p className="section-subtitle">
            De la demande de devis à la perception de vos aides, on vous accompagne à chaque
            étape.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-primary-200 via-eco-200 to-accent-200" />

          {STEPS.map((step, idx) => (
            <div key={idx} className="relative flex flex-col items-center text-center">
              <div
                className={`relative z-10 flex items-center justify-center w-14 h-14 rounded-2xl ${step.color} mb-5 shadow-sm`}
              >
                {step.icon}
                <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 rounded-full bg-slate-900 text-white text-xs font-bold">
                  {idx + 1}
                </span>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">{step.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 text-center">
          <Link href="/devis" className="btn-primary px-8 py-3">
            Démarrer mon projet gratuitement
          </Link>
          <p className="mt-3 text-xs text-slate-400">
            Gratuit pour les particuliers · Devis sous 24h · Sans engagement
          </p>
        </div>
      </div>
    </section>
  )
}
