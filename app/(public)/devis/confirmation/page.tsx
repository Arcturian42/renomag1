import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle, Clock, Users, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Demande envoyée — RENOMAG',
  description: 'Votre demande de devis a bien été envoyée. Nos artisans RGE vont vous recontacter rapidement.',
}

export default function DevisConfirmationPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
        {/* Success icon */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 rounded-full bg-eco-100 flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-eco-600" />
          </div>
        </div>

        {/* Main message */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            Votre demande a été envoyée !
          </h1>
          <p className="text-lg text-slate-600">
            Merci pour votre confiance. Nos artisans RGE certifiés vont étudier votre projet.
          </p>
        </div>

        {/* What happens next */}
        <div className="bg-white rounded-xl border border-slate-200 p-8 mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6">
            Et maintenant ?
          </h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">
                  Sous 24h
                </h3>
                <p className="text-sm text-slate-600">
                  Un ou plusieurs artisans certifiés RGE de votre région vont étudier votre demande et vous contacter par téléphone ou email.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-accent-100 flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-accent-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">
                  Devis personnalisé
                </h3>
                <p className="text-sm text-slate-600">
                  Chaque artisan vous proposera un devis détaillé adapté à votre projet, avec le montant des aides MaPrimeRénov&apos; et CEE dont vous pouvez bénéficier.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-eco-100 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-eco-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">
                  Comparez et choisissez
                </h3>
                <p className="text-sm text-slate-600">
                  Comparez les devis, les délais et les garanties. Choisissez l&apos;artisan qui vous convient le mieux, sans engagement.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="grid sm:grid-cols-2 gap-4">
          <Link
            href="/annuaire"
            className="btn-secondary text-center flex items-center justify-center gap-2"
          >
            Parcourir l&apos;annuaire
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/espace-proprietaire"
            className="btn-primary text-center flex items-center justify-center gap-2"
          >
            Accéder à mon espace
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Additional info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500">
            Vous n&apos;avez pas reçu de réponse sous 48h ?{' '}
            <Link href="/contact" className="text-primary-600 hover:underline font-medium">
              Contactez notre support
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
