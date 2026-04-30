import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Politique de confidentialité — RENOMAG',
}

export default function ConfidentialitePage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Politique de confidentialité</h1>
        <p className="text-slate-500 mb-10">Dernière mise à jour : avril 2024</p>

        <div className="space-y-8 text-sm text-slate-600 leading-relaxed">
          {[
            {
              title: '1. Responsable du traitement',
              content: 'RENOMAG SAS, 12 rue de la Paix, 75002 Paris. Email : dpo@renomag.fr',
            },
            {
              title: '2. Données collectées',
              content: 'Nous collectons les données que vous nous fournissez directement : nom, prénom, email, téléphone, adresse, informations sur votre logement et votre projet de rénovation. Nous collectons également des données de navigation (cookies, adresse IP) pour améliorer notre service.',
            },
            {
              title: '3. Finalités du traitement',
              content: 'Vos données sont utilisées pour : mettre en relation avec des artisans RGE, calculer vos droits aux aides, vous envoyer des devis et informations pertinentes, améliorer nos services, respecter nos obligations légales.',
            },
            {
              title: '4. Base légale',
              content: 'Le traitement de vos données est fondé sur votre consentement (que vous pouvez retirer à tout moment), l\'exécution du contrat de mise en relation, et nos intérêts légitimes (amélioration du service, sécurité).',
            },
            {
              title: '5. Destinataires des données',
              content: 'Vos données sont transmises aux artisans RGE sélectionnés pour votre projet, dans la limite strictement nécessaire à la réalisation du devis. Elles ne sont jamais vendues à des tiers.',
            },
            {
              title: '6. Durée de conservation',
              content: 'Vos données sont conservées pendant 3 ans à compter de votre dernière interaction avec RENOMAG, sauf obligation légale contraire.',
            },
            {
              title: '7. Vos droits',
              content: 'Conformément au RGPD, vous disposez des droits d\'accès, de rectification, d\'effacement, de portabilité et d\'opposition au traitement de vos données. Pour exercer ces droits, contactez-nous à dpo@renomag.fr.',
            },
            {
              title: '8. Cookies',
              content: 'Nous utilisons des cookies pour le fonctionnement du site, l\'analyse d\'audience (Google Analytics) et la personnalisation. Vous pouvez gérer vos préférences de cookies depuis les paramètres de votre navigateur ou via notre bannière de consentement.',
            },
            {
              title: '9. Contact & réclamation',
              content: 'Pour toute question relative à notre politique de confidentialité, contactez notre DPO à dpo@renomag.fr. Vous pouvez également déposer une réclamation auprès de la CNIL (cnil.fr).',
            },
          ].map((section) => (
            <section key={section.title}>
              <h2 className="text-base font-bold text-slate-900 mb-2">{section.title}</h2>
              <p>{section.content}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
