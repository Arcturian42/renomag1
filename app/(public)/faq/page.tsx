import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'FAQ — Questions fréquentes sur la rénovation énergétique',
  description: 'Toutes les réponses à vos questions sur MaPrimeRénov\', les artisans RGE, les CEE et la rénovation énergétique.',
}

const FAQS = [
  {
    category: "MaPrimeRénov'",
    questions: [
      {
        q: "Qu'est-ce que MaPrimeRénov' ?",
        a: "MaPrimeRénov' est une aide financière de l'État destinée à financer les travaux de rénovation énergétique. Elle remplace le crédit d'impôt pour la transition énergétique (CITE) et les aides de l'Anah. Son montant varie selon vos revenus et le type de travaux réalisés.",
      },
      {
        q: "Qui peut bénéficier de MaPrimeRénov' ?",
        a: "Tous les propriétaires occupants ou bailleurs peuvent bénéficier de MaPrimeRénov' pour leur résidence principale construite depuis plus de 15 ans. Les syndicats de copropriétés sont également éligibles pour les parties communes.",
      },
      {
        q: "Comment faire une demande de MaPrimeRénov' ?",
        a: "La demande se fait exclusivement en ligne sur maprimerenov.gouv.fr. Vous devez déposer votre dossier AVANT le début des travaux. Votre artisan certifié RGE peut vous accompagner dans cette démarche.",
      },
      {
        q: "Quand est versée MaPrimeRénov' ?",
        a: "La prime est versée après la réalisation des travaux, sur présentation de la facture de votre artisan. Le délai de versement est généralement de 1 à 3 mois après la déclaration de fin de travaux.",
      },
    ],
  },
  {
    category: 'Artisans RGE',
    questions: [
      {
        q: "Qu'est-ce qu'un artisan RGE ?",
        a: "RGE signifie « Reconnu Garant de l'Environnement ». C'est une certification attribuée aux professionnels du bâtiment ayant suivi une formation spécifique aux travaux de rénovation énergétique. Faire appel à un artisan RGE est obligatoire pour bénéficier des aides de l'État.",
      },
      {
        q: "Comment vérifier qu'un artisan est bien certifié RGE ?",
        a: "Vous pouvez vérifier la certification RGE d'un artisan sur le site officiel france-renov.gouv.fr ou directement sur notre annuaire RENOMAG où tous les artisans sont vérifiés. Demandez toujours une preuve de certification avant de signer un devis.",
      },
      {
        q: "Combien coûte un devis chez un artisan RGE ?",
        a: "Les devis sont gratuits et sans engagement. Sur RENOMAG, vous recevez jusqu'à 3 devis d'artisans RGE certifiés dans votre zone, sans frais.",
      },
    ],
  },
  {
    category: 'CEE & autres aides',
    questions: [
      {
        q: "Qu'est-ce que les CEE ?",
        a: "Les Certificats d'Économies d'Énergie (CEE) sont des aides versées par les fournisseurs d'énergie (EDF, TotalEnergies, etc.) en échange de travaux d'économies d'énergie. Ils sont cumulables avec MaPrimeRénov' et peuvent représenter plusieurs centaines à plusieurs milliers d'euros.",
      },
      {
        q: "Peut-on cumuler plusieurs aides ?",
        a: "Oui ! La plupart des aides sont cumulables : MaPrimeRénov' + CEE + Éco-PTZ + TVA réduite à 5,5%. Votre artisan RGE peut vous aider à identifier et cumuler toutes les aides auxquelles vous avez droit.",
      },
      {
        q: "Qu'est-ce que l'Éco-PTZ ?",
        a: "L'Éco-Prêt à Taux Zéro (Éco-PTZ) est un prêt bancaire sans intérêts pour financer des travaux de rénovation énergétique. Il peut atteindre 50 000€ et être remboursé sur 20 ans. Il est disponible dans toutes les banques ayant signé une convention avec l'État.",
      },
    ],
  },
  {
    category: 'RENOMAG',
    questions: [
      {
        q: 'RENOMAG est-il gratuit pour les particuliers ?',
        a: "Oui, RENOMAG est 100% gratuit pour les particuliers. Nous sommes rémunérés par une commission sur les mises en relation réussies, payée par les artisans. Vous ne payez jamais pour obtenir des devis.",
      },
      {
        q: 'Comment RENOMAG sélectionne-t-il les artisans ?',
        a: "Notre algorithme sélectionne les artisans selon plusieurs critères : certification RGE valide, spécialité correspondant à vos travaux, zone géographique, note client, disponibilité et historique de performance sur notre plateforme.",
      },
      {
        q: 'Que faire si je ne suis pas satisfait des devis reçus ?',
        a: "Vous pouvez contacter notre équipe support qui vous aidera à trouver d'autres artisans ou à comprendre les écarts de prix. Vous pouvez également parcourir notre annuaire pour contacter directement d'autres professionnels.",
      },
    ],
  },
]

export default function FaqPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="bg-slate-900 text-white py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="badge-primary mb-4">FAQ</div>
          <h1 className="text-4xl font-bold">Questions fréquentes</h1>
          <p className="mt-4 text-slate-400">
            Tout ce que vous devez savoir sur la rénovation énergétique, les aides et RENOMAG.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
        {FAQS.map((section) => (
          <div key={section.category} className="mb-12">
            <h2 className="text-xl font-bold text-slate-900 mb-5 pb-3 border-b border-slate-200">
              {section.category}
            </h2>
            <div className="space-y-4">
              {section.questions.map((faq) => (
                <details key={faq.q} className="group bg-slate-50 rounded-xl border border-slate-200 p-5">
                  <summary className="flex items-center justify-between cursor-pointer font-medium text-slate-900 list-none">
                    {faq.q}
                    <ArrowRight className="w-4 h-4 text-slate-400 group-open:rotate-90 transition-transform flex-shrink-0 ml-3" />
                  </summary>
                  <p className="mt-3 text-sm text-slate-600 leading-relaxed">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        ))}

        <div className="bg-primary-800 rounded-2xl p-8 text-white text-center">
          <h2 className="text-xl font-bold mb-2">Vous n'avez pas trouvé votre réponse ?</h2>
          <p className="text-primary-200 mb-5">Notre équipe est disponible pour vous répondre.</p>
          <a href="mailto:contact@renomag.fr" className="btn-accent px-6 py-3">
            Contacter le support
          </a>
        </div>
      </div>
    </div>
  )
}
