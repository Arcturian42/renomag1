import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gestion des cookies — RENOMAG',
}

const COOKIE_TYPES = [
  {
    title: 'Cookies essentiels',
    description: 'Ces cookies sont indispensables au fonctionnement du site. Ils permettent la navigation, la sécurité et l\'authentification. Ils ne peuvent pas être désactivés.',
    examples: ['Session utilisateur', 'Panier / formulaire multi-étapes', 'Protection CSRF'],
    required: true,
  },
  {
    title: 'Cookies analytiques',
    description: 'Ces cookies nous permettent de mesurer l\'audience du site et de comprendre comment les visiteurs l\'utilisent, afin d\'améliorer nos services.',
    examples: ['Google Analytics (_ga, _gid)', 'Hotjar (hj_*)'],
    required: false,
  },
  {
    title: 'Cookies de personnalisation',
    description: 'Ces cookies permettent de mémoriser vos préférences (langue, région, paramètres d\'affichage) pour personnaliser votre expérience.',
    examples: ['Préférences de langue', 'Thème d\'affichage'],
    required: false,
  },
  {
    title: 'Cookies marketing',
    description: 'Ces cookies sont utilisés pour vous proposer des publicités pertinentes sur d\'autres sites et mesurer l\'efficacité de nos campagnes.',
    examples: ['Google Ads (_gcl_*)', 'Meta Pixel (fbp)'],
    required: false,
  },
]

export default function CookiesPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Gestion des cookies</h1>
        <p className="text-slate-500 mb-10">Dernière mise à jour : avril 2024</p>

        <div className="text-sm text-slate-600 leading-relaxed mb-10">
          <p>
            Un cookie est un petit fichier texte déposé sur votre ordinateur lors de la visite d'un site internet.
            Il permet au site de mémoriser certaines informations sur votre visite pour améliorer votre expérience.
          </p>
          <p className="mt-3">
            Conformément au RGPD et aux recommandations de la CNIL, nous vous informons des cookies utilisés sur renomag.fr
            et vous permettons de gérer vos préférences.
          </p>
        </div>

        <div className="space-y-6 mb-12">
          {COOKIE_TYPES.map((type) => (
            <div key={type.title} className="bg-slate-50 rounded-xl border border-slate-200 p-6">
              <div className="flex items-start justify-between gap-4 mb-3">
                <h2 className="text-base font-bold text-slate-900">{type.title}</h2>
                {type.required ? (
                  <span className="flex-shrink-0 text-xs font-semibold bg-slate-200 text-slate-600 rounded-full px-3 py-1">
                    Obligatoire
                  </span>
                ) : (
                  <span className="flex-shrink-0 text-xs font-semibold bg-primary-100 text-primary-700 rounded-full px-3 py-1">
                    Optionnel
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-600 mb-3">{type.description}</p>
              <div className="flex flex-wrap gap-2">
                {type.examples.map((ex) => (
                  <span key={ex} className="text-xs bg-white border border-slate-200 rounded-lg px-2 py-1 text-slate-500">
                    {ex}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-primary-50 border border-primary-200 rounded-xl p-6">
          <h2 className="text-base font-bold text-slate-900 mb-3">Gérer vos préférences</h2>
          <p className="text-sm text-slate-600 mb-4">
            Vous pouvez modifier vos préférences de cookies à tout moment via votre navigateur :
          </p>
          <ul className="space-y-1 text-sm text-slate-600 list-disc list-inside">
            <li>Chrome : Paramètres → Confidentialité et sécurité → Cookies</li>
            <li>Firefox : Options → Vie privée et sécurité → Cookies</li>
            <li>Safari : Préférences → Confidentialité</li>
            <li>Edge : Paramètres → Cookies et autorisations du site</li>
          </ul>
          <p className="text-xs text-slate-500 mt-4">
            Pour en savoir plus sur les cookies, visitez{' '}
            <a href="https://www.cnil.fr/fr/cookies-et-autres-traceurs" className="text-primary-600 hover:underline" target="_blank" rel="noopener noreferrer">
              cnil.fr
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
