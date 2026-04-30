import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Partenaires — RENOMAG',
  description: 'Découvrez les partenaires de RENOMAG : fournisseurs d\'énergie, organismes de certification, institutions et acteurs de la rénovation énergétique.',
}

const PARTNERS = [
  {
    category: 'Institutions & organismes',
    items: [
      { name: 'ANAH', description: 'Agence Nationale de l\'Habitat — partenaire pour les aides aux ménages modestes', logo: '🏛️' },
      { name: 'ADEME', description: 'Agence de la Transition Écologique — référence pour les certifications RGE', logo: '🌿' },
      { name: 'France Rénov\'', description: 'Réseau national d\'accompagnement à la rénovation énergétique', logo: '🇫🇷' },
    ],
  },
  {
    category: 'Certification & Qualification',
    items: [
      { name: 'Qualibat', description: 'Organisme de qualification des entreprises du bâtiment', logo: '🏗️' },
      { name: 'Qualifelec', description: 'Qualification des entreprises d\'installation électrique', logo: '⚡' },
      { name: 'QualiPAC', description: 'Qualification pour l\'installation de pompes à chaleur', logo: '🌡️' },
    ],
  },
  {
    category: 'Financement',
    items: [
      { name: 'Crédit Agricole', description: 'Partenaire bancaire pour l\'Éco-PTZ et les financements verts', logo: '🏦' },
      { name: 'Banque Populaire', description: 'Solutions de financement dédiées à la rénovation', logo: '💳' },
      { name: 'CEE Obligés', description: 'Partenariat avec les obligés CEE pour des primes directes', logo: '📋' },
    ],
  },
]

export default function PartenairesPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="bg-slate-900 text-white py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="badge-primary mb-4">Écosystème</div>
          <h1 className="text-4xl font-bold">Nos partenaires</h1>
          <p className="mt-4 text-slate-400 max-w-xl">
            RENOMAG s'appuie sur un réseau de partenaires de confiance pour vous offrir le meilleur service de rénovation énergétique.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        {PARTNERS.map((section) => (
          <div key={section.category} className="mb-12">
            <h2 className="text-xl font-bold text-slate-900 mb-6 pb-3 border-b border-slate-200">
              {section.category}
            </h2>
            <div className="grid sm:grid-cols-3 gap-5">
              {section.items.map((partner) => (
                <div key={partner.name} className="bg-slate-50 rounded-xl border border-slate-200 p-5">
                  <div className="text-4xl mb-3">{partner.logo}</div>
                  <h3 className="font-bold text-slate-900 mb-1">{partner.name}</h3>
                  <p className="text-sm text-slate-500">{partner.description}</p>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Become a partner */}
        <div className="bg-primary-800 rounded-2xl p-8 text-white">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-3">Devenir partenaire</h2>
              <p className="text-primary-200 mb-4">
                Vous êtes un acteur de la rénovation énergétique ? Rejoignez l'écosystème RENOMAG et développez votre activité.
              </p>
              <ul className="space-y-2">
                {['Visibilité auprès de 50 000+ propriétaires', 'Intégration dans notre plateforme', 'Co-marketing et contenu dédié'].map(item => (
                  <li key={item} className="flex items-center gap-2 text-sm text-primary-100">
                    <CheckCircle className="w-4 h-4 text-eco-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="text-center">
              <a href="mailto:partenaires@renomag.fr" className="btn-accent px-6 py-3 inline-flex items-center gap-2">
                Nous contacter
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
