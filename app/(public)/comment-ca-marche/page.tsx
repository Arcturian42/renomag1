import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ClipboardList,
  Search,
  Wrench,
  Banknote,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  Zap,
  BarChart3,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Comment ça marche — RENOMAG, la plateforme de rénovation énergétique',
  description:
    'Découvrez comment RENOMAG vous connecte aux meilleurs artisans RGE et vous aide à obtenir vos aides MaPrimeRénov\' et CEE.',
}

const STEPS_HOMEOWNER = [
  {
    step: 1,
    icon: <ClipboardList className="w-6 h-6" />,
    title: 'Décrivez votre projet',
    description:
      'Remplissez notre formulaire en ligne en 2 minutes. Décrivez votre logement, les travaux souhaités et vos coordonnées.',
    detail:
      'Notre algorithme analyse immédiatement votre situation pour précalculer vos droits aux aides MaPrimeRénov\' et CEE.',
    color: 'bg-primary-100 text-primary-700 border-primary-200',
  },
  {
    step: 2,
    icon: <Search className="w-6 h-6" />,
    title: 'Recevez 3 devis en 24h',
    description:
      'Notre système sélectionne automatiquement les 3 artisans RGE les plus adaptés à votre projet dans votre zone.',
    detail:
      'Les artisans sont sélectionnés selon leur expertise, leur disponibilité, leur note client et leur proximité géographique.',
    color: 'bg-eco-100 text-eco-700 border-eco-200',
  },
  {
    step: 3,
    icon: <Wrench className="w-6 h-6" />,
    title: 'Choisissez et réalisez',
    description:
      'Comparez les devis dans votre espace, échangez avec les artisans, et validez votre choix en toute sérénité.',
    detail:
      "Votre artisan vous accompagne dans le dépôt du dossier d'aides AVANT le début des travaux — condition obligatoire.",
    color: 'bg-accent-100 text-accent-700 border-accent-200',
  },
  {
    step: 4,
    icon: <Banknote className="w-6 h-6" />,
    title: 'Percevez vos aides',
    description:
      'Une fois les travaux terminés, votre artisan vous aide à finaliser le dossier. Vous recevez vos aides directement.',
    detail:
      'MaPrimeRénov\' est versée directement sur votre compte bancaire. Le CEE peut être déduit de la facture.',
    color: 'bg-purple-100 text-purple-700 border-purple-200',
  },
]

const STEPS_PRO = [
  {
    step: 1,
    title: 'Créez votre profil',
    description: 'Inscrivez-vous, renseignez vos certifications RGE et votre zone d\'intervention.',
    icon: '👤',
  },
  {
    step: 2,
    title: 'Recevez des leads qualifiés',
    description: 'Notre algorithme vous envoie des leads correspondant à votre expertise et votre zone.',
    icon: '📩',
  },
  {
    step: 3,
    title: 'Envoyez vos devis',
    description: 'Répondez aux demandes depuis votre dashboard et envoyez vos devis directement.',
    icon: '📋',
  },
  {
    step: 4,
    title: 'Développez votre activité',
    description: 'Suivez vos performances, gérez vos avis et optimisez votre visibilité.',
    icon: '📈',
  },
]

const GUARANTEES = [
  {
    icon: <ShieldCheck className="w-5 h-5" />,
    title: 'Artisans certifiés',
    description: 'Tous nos artisans sont certifiés RGE. Nous vérifions leurs certifications et assurances.',
    color: 'text-primary-600 bg-primary-50',
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: 'Réponse en 24h',
    description: 'Nous vous garantissons de recevoir au moins un devis dans les 24 heures suivant votre demande.',
    color: 'text-accent-600 bg-accent-50',
  },
  {
    icon: <BarChart3 className="w-5 h-5" />,
    title: 'Suivi en temps réel',
    description: 'Suivez l\'avancement de votre dossier depuis votre espace personnel sécurisé.',
    color: 'text-eco-600 bg-eco-50',
  },
  {
    icon: <CheckCircle className="w-5 h-5" />,
    title: 'Service gratuit',
    description: 'RENOMAG est 100% gratuit pour les particuliers. Nous sommes rémunérés par les artisans.',
    color: 'text-purple-600 bg-purple-50',
  },
]

export default function CommentCaMarchePage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-slate-900 text-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="badge-primary mx-auto w-fit mb-4">Simple & rapide</div>
          <h1 className="text-4xl font-bold">Comment ça marche ?</h1>
          <p className="mt-4 text-slate-400 max-w-xl mx-auto">
            De votre première demande à la perception de vos aides, RENOMAG vous accompagne
            à chaque étape de votre rénovation énergétique.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        {/* Homeowner journey */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-slate-900">Pour les particuliers</h2>
            <p className="text-slate-500 mt-2">4 étapes simples pour rénover et économiser</p>
          </div>

          <div className="space-y-8">
            {STEPS_HOMEOWNER.map((step, idx) => (
              <div
                key={step.step}
                className={`flex gap-6 items-start ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
              >
                <div
                  className={`hidden md:flex items-center justify-center w-16 h-16 rounded-2xl border-2 ${step.color} flex-shrink-0 relative`}
                >
                  {step.icon}
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                    {step.step}
                  </span>
                </div>
                <div
                  className={`flex-1 rounded-xl border border-slate-200 p-6 ${idx % 2 === 1 ? 'md:mr-0 md:ml-auto' : ''}`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`md:hidden flex items-center justify-center w-10 h-10 rounded-xl border-2 ${step.color}`}
                    >
                      {step.icon}
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Étape {step.step}
                      </span>
                      <h3 className="font-bold text-slate-900">{step.title}</h3>
                    </div>
                  </div>
                  <p className="text-slate-600 mb-3">{step.description}</p>
                  <p className="text-sm text-slate-400 italic">{step.detail}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link href="/devis" className="btn-primary px-8 py-3">
              Démarrer mon projet
              <ArrowRight className="w-4 h-4" />
            </Link>
            <p className="mt-2 text-xs text-slate-400">100% gratuit pour les particuliers</p>
          </div>
        </div>

        {/* Guarantees */}
        <div className="mb-20 bg-slate-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">Nos garanties</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {GUARANTEES.map((g) => (
              <div key={g.title} className="bg-white rounded-xl border border-slate-200 p-5">
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${g.color} mb-4`}>
                  {g.icon}
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{g.title}</h3>
                <p className="text-sm text-slate-500">{g.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pro journey */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <div className="badge-accent mx-auto w-fit mb-3">Artisans & Pros</div>
            <h2 className="text-2xl font-bold text-slate-900">Pour les professionnels</h2>
            <p className="text-slate-500 mt-2">Développez votre activité avec des leads qualifiés</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS_PRO.map((step) => (
              <div key={step.step} className="relative">
                {step.step < 4 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-slate-200 z-0" />
                )}
                <div className="relative z-10 bg-white rounded-xl border border-slate-200 p-6 text-center">
                  <div className="text-4xl mb-4">{step.icon}</div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Étape {step.step}
                  </span>
                  <h3 className="font-semibold text-slate-900 mt-1 mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-500">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link href="/tarifs" className="btn-primary px-8 py-3">
              Voir nos offres pros
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* FAQ */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Questions fréquentes</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                q: 'RENOMAG est-il vraiment gratuit pour les particuliers ?',
                a: 'Oui, totalement gratuit. RENOMAG est rémunéré par une commission sur les leads transmis aux artisans, uniquement lorsqu\'un devis est accepté.',
              },
              {
                q: 'Combien de temps faut-il pour recevoir des devis ?',
                a: 'Nous garantissons au moins un devis sous 24h ouvrées. En moyenne, nos utilisateurs reçoivent 3 devis en moins de 12 heures.',
              },
              {
                q: 'Puis-je choisir n\'importe quel artisan de l\'annuaire ?',
                a: 'Oui ! Vous pouvez contacter directement n\'importe quel artisan de notre annuaire, ou utiliser notre service de mise en relation pour recevoir plusieurs devis automatiquement.',
              },
              {
                q: 'L\'artisan m\'aide-t-il pour les démarches d\'aides ?',
                a: "Les artisans premium de notre réseau s'engagent à accompagner leurs clients dans le montage du dossier MaPrimeRénov' et CEE.",
              },
            ].map((faq) => (
              <details key={faq.q} className="group bg-slate-50 rounded-xl border border-slate-200 p-5">
                <summary className="flex items-center justify-between cursor-pointer font-medium text-slate-900 list-none">
                  {faq.q}
                  <ArrowRight className="w-4 h-4 text-slate-400 group-open:rotate-90 transition-transform flex-shrink-0" />
                </summary>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
