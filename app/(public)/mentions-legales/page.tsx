import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mentions légales — RENOMAG',
}

export default function MentionsLegalesPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Mentions légales</h1>

        <div className="prose prose-slate max-w-none space-y-8 text-sm text-slate-600 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">Éditeur du site</h2>
            <p>RENOMAG SAS<br />
            Capital social : 10 000€<br />
            RCS Paris — SIRET : 123 456 789 00012<br />
            Siège social : 12 rue de la Paix, 75002 Paris<br />
            Téléphone : 01 23 45 67 89<br />
            Email : contact@renomag.fr</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">Directeur de la publication</h2>
            <p>Le directeur de la publication est le représentant légal de RENOMAG SAS.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">Hébergement</h2>
            <p>Le site est hébergé par :<br />
            Vercel Inc.<br />
            440 N Barranca Ave #4133, Covina, CA 91723, USA<br />
            <a href="https://vercel.com" className="text-primary-600 hover:underline">vercel.com</a></p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">Propriété intellectuelle</h2>
            <p>L'ensemble du contenu de ce site (textes, images, vidéos, logos, icônes) est protégé par le droit d'auteur et appartient à RENOMAG SAS ou à ses partenaires. Toute reproduction, même partielle, est strictement interdite sans autorisation préalable écrite.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">Responsabilité</h2>
            <p>RENOMAG s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur ce site. Cependant, RENOMAG ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations mises à disposition. RENOMAG décline toute responsabilité pour toute imprécision, inexactitude ou omission portant sur des informations disponibles sur ce site.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">Liens hypertextes</h2>
            <p>Le site peut contenir des liens vers d'autres sites internet. RENOMAG n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu.</p>
          </section>

          <p className="text-xs text-slate-400">Dernière mise à jour : avril 2024</p>
        </div>
      </div>
    </div>
  )
}
