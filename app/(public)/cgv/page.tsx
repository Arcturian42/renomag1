import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Conditions Générales de Vente — RENOMAG',
}

const SECTIONS = [
  {
    title: '1. Objet',
    content: 'Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre RENOMAG SAS et ses utilisateurs (particuliers et professionnels) dans le cadre de l\'utilisation de la plateforme RENOMAG accessible à l\'adresse renomag.fr.',
  },
  {
    title: '2. Définitions',
    content: '"Plateforme" désigne le site web et les services RENOMAG. "Particulier" désigne tout utilisateur non professionnel. "Artisan" désigne tout professionnel du bâtiment inscrit sur la plateforme. "Lead" désigne une mise en relation entre un Particulier et un Artisan.',
  },
  {
    title: '3. Services proposés',
    content: 'RENOMAG propose une plateforme de mise en relation entre des particuliers souhaitant réaliser des travaux de rénovation énergétique et des artisans certifiés RGE. RENOMAG propose également des outils de simulation d\'aides et d\'accompagnement administratif.',
  },
  {
    title: '4. Tarifs pour les artisans',
    content: 'L\'accès à la plateforme est gratuit pour les particuliers. Les artisans bénéficient d\'un abonnement mensuel ou annuel dont les tarifs sont détaillés sur la page /tarifs. Les prix sont exprimés en euros HT. La TVA applicable est de 20%.',
  },
  {
    title: '5. Modalités de paiement',
    content: 'Le paiement s\'effectue par carte bancaire (Visa, Mastercard, American Express) ou par virement bancaire pour les abonnements annuels. Les paiements sont sécurisés par notre prestataire de paiement Stripe (certifié PCI-DSS).',
  },
  {
    title: '6. Durée et résiliation',
    content: 'Les abonnements sont sans engagement pour la formule mensuelle, et annuels pour la formule annuelle. L\'artisan peut résilier son abonnement à tout moment depuis son espace professionnel, avec effet à la fin de la période en cours.',
  },
  {
    title: '7. Obligations des artisans',
    content: 'L\'artisan s\'engage à maintenir ses certifications RGE à jour, à répondre aux demandes de devis dans les 48h, à respecter les délais annoncés, et à fournir des informations exactes sur son profil.',
  },
  {
    title: '8. Responsabilité',
    content: 'RENOMAG agit en qualité d\'intermédiaire. La responsabilité de RENOMAG est limitée au bon fonctionnement de la plateforme de mise en relation. RENOMAG ne peut être tenu responsable de la qualité des travaux réalisés par les artisans, ni des délais ou tarifs pratiqués.',
  },
  {
    title: '9. Propriété intellectuelle',
    content: 'L\'ensemble des éléments de la plateforme (logo, textes, images, algorithmes) sont la propriété exclusive de RENOMAG SAS et sont protégés par le droit d\'auteur. Toute reproduction est interdite sans autorisation préalable.',
  },
  {
    title: '10. Protection des données',
    content: 'Le traitement des données personnelles est régi par notre Politique de Confidentialité, conformément au RGPD. Vous disposez de droits d\'accès, de rectification et d\'effacement de vos données.',
  },
  {
    title: '11. Droit applicable et litiges',
    content: 'Les présentes CGV sont soumises au droit français. Tout litige relatif à leur interprétation ou exécution sera soumis aux tribunaux compétents de Paris, après tentative de résolution amiable.',
  },
]

export default function CGVPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Conditions Générales de Vente</h1>
        <p className="text-slate-500 mb-10">Dernière mise à jour : avril 2024</p>

        <div className="space-y-8 text-sm text-slate-600 leading-relaxed">
          {SECTIONS.map((section) => (
            <section key={section.title}>
              <h2 className="text-base font-bold text-slate-900 mb-2">{section.title}</h2>
              <p>{section.content}</p>
            </section>
          ))}
        </div>

        <div className="mt-12 p-5 bg-slate-50 rounded-xl border border-slate-200">
          <p className="text-sm text-slate-600">
            Pour toute question relative à ces CGV, contactez-nous à{' '}
            <a href="mailto:contact@renomag.fr" className="text-primary-600 hover:underline">
              contact@renomag.fr
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
