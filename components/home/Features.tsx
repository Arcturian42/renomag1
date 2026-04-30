import {
  ShieldCheck,
  Zap,
  BarChart3,
  HeadphonesIcon,
  FileCheck,
  MapPin,
} from 'lucide-react'

const FEATURES = [
  {
    icon: <ShieldCheck className="w-5 h-5" />,
    color: 'bg-primary-100 text-primary-700',
    title: 'Artisans certifiés RGE',
    description:
      'Tous nos artisans sont certifiés RGE (Reconnu Garant de l\'Environnement), condition obligatoire pour bénéficier des aides.',
  },
  {
    icon: <FileCheck className="w-5 h-5" />,
    color: 'bg-eco-100 text-eco-700',
    title: 'Aides optimisées',
    description:
      'Notre algorithme calcule automatiquement le meilleur mix d\'aides pour maximiser votre financement.',
  },
  {
    icon: <Zap className="w-5 h-5" />,
    color: 'bg-accent-100 text-accent-700',
    title: 'Matching intelligent',
    description:
      'Nous sélectionnons les 3 artisans les plus adaptés à votre projet selon leur expertise, disponibilité et proximité.',
  },
  {
    icon: <MapPin className="w-5 h-5" />,
    color: 'bg-purple-100 text-purple-700',
    title: 'Couverture nationale',
    description:
      'Réseau de 2 400+ artisans dans toute la France. Nous trouvons toujours un professionnel qualifié près de chez vous.',
  },
  {
    icon: <BarChart3 className="w-5 h-5" />,
    color: 'bg-rose-100 text-rose-700',
    title: 'Suivi de projet',
    description:
      'Suivez l\'avancement de votre projet de rénovation et de vos dossiers d\'aides en temps réel depuis votre espace.',
  },
  {
    icon: <HeadphonesIcon className="w-5 h-5" />,
    color: 'bg-teal-100 text-teal-700',
    title: 'Conseils d\'experts',
    description:
      'Nos conseillers répondent à toutes vos questions sur les aides, les travaux et la réglementation.',
  },
]

export default function Features() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="badge-eco mx-auto w-fit mb-3">Pourquoi RENOMAG</div>
          <h2 className="section-title">Tout ce qu'il vous faut pour rénover sereinement</h2>
          <p className="section-subtitle">
            Une plateforme complète qui simplifie chaque étape de votre projet de rénovation
            énergétique.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feat) => (
            <div
              key={feat.title}
              className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md hover:border-slate-300 transition-all duration-200"
            >
              <div
                className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${feat.color} mb-4`}
              >
                {feat.icon}
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">{feat.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{feat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
