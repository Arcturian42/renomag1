import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { Zap, ArrowRight, CheckCircle, User, FileText, Award, Image as ImageIcon } from 'lucide-react'

export default async function BienvenuePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/connexion')
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: { profile: true, artisan: true },
  })

  if (!dbUser) {
    redirect('/connexion')
  }

  const isArtisan = dbUser.role === 'ARTISAN'
  const dashboardUrl = isArtisan ? '/espace-pro' : '/espace-proprietaire'

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-3xl w-full">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 justify-center mb-8">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary-800 shadow-lg">
            <Zap className="w-6 h-6 text-accent-400" />
          </div>
          <span className="font-display font-bold text-3xl text-slate-900">
            RENO<span className="text-primary-700">MAG</span>
          </span>
        </Link>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-8 md:p-12">
          {/* Welcome message */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-eco-100 mb-4">
              <CheckCircle className="w-8 h-8 text-eco-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
              Bienvenue sur RENOMAG !
            </h1>
            <p className="text-lg text-slate-600">
              {isArtisan
                ? 'Votre compte professionnel a été créé avec succès'
                : 'Votre compte a été créé avec succès'}
            </p>
          </div>

          {/* Content based on role */}
          {isArtisan ? (
            <div className="space-y-6">
              <div className="bg-primary-50 border border-primary-200 rounded-xl p-6">
                <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary-600" />
                  Complétez votre profil pour maximiser vos opportunités
                </h2>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 w-5 h-5 rounded-full border-2 border-slate-300 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">Ajoutez une photo de profil</p>
                      <p className="text-xs text-slate-500">Les profils avec photo reçoivent 3x plus de contacts</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 w-5 h-5 rounded-full border-2 border-slate-300 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">Rédigez votre présentation</p>
                      <p className="text-xs text-slate-500">Décrivez votre expertise et vos spécialités</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 w-5 h-5 rounded-full border-2 border-slate-300 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">Ajoutez vos certifications RGE</p>
                      <p className="text-xs text-slate-500">Indispensable pour recevoir des leads qualifiés</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 w-5 h-5 rounded-full border-2 border-slate-300 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">Importez votre galerie de réalisations</p>
                      <p className="text-xs text-slate-500">Les photos de chantiers rassurent vos futurs clients</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-accent-50 border border-accent-200 rounded-xl p-5">
                <p className="text-sm text-accent-900 font-medium mb-2">
                  🎁 Offre de bienvenue
                </p>
                <p className="text-xs text-accent-700">
                  Profitez de 30 jours d'essai gratuit pour tester toutes les fonctionnalités premium et recevoir vos premiers leads !
                </p>
              </div>

              <Link
                href="/espace-pro/profil"
                className="btn-primary w-full py-4 text-center flex items-center justify-center gap-2"
              >
                Compléter mon profil
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link
                href={dashboardUrl}
                className="block text-center text-sm text-slate-500 hover:text-slate-700 transition-colors"
              >
                Plus tard, aller au tableau de bord →
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-primary-50 border border-primary-200 rounded-xl p-6">
                <h2 className="font-semibold text-slate-900 mb-4">
                  Vos prochaines étapes
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 mb-1">Décrivez votre projet</p>
                      <p className="text-sm text-slate-600">
                        Remplissez un devis en 2 minutes pour être mis en relation avec les meilleurs artisans RGE de votre région
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 mb-1">Recevez des devis gratuits</p>
                      <p className="text-sm text-slate-600">
                        Les artisans vous contactent sous 24h avec des propositions détaillées
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 mb-1">Maximisez vos aides</p>
                      <p className="text-sm text-slate-600">
                        Nous calculons automatiquement vos aides MaPrimeRénov' et CEE
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-eco-50 border border-eco-200 rounded-xl p-5">
                <p className="text-sm text-eco-900 font-medium mb-2">
                  💡 Le saviez-vous ?
                </p>
                <p className="text-xs text-eco-700">
                  En moyenne, nos utilisateurs économisent 40% sur leurs travaux de rénovation énergétique grâce aux aides dont ils peuvent bénéficier.
                </p>
              </div>

              <Link
                href="/devis"
                className="btn-primary w-full py-4 text-center flex items-center justify-center gap-2"
              >
                Demander un devis gratuit
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link
                href={dashboardUrl}
                className="block text-center text-sm text-slate-500 hover:text-slate-700 transition-colors"
              >
                Plus tard, aller à mon espace →
              </Link>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-slate-400 mt-8">
          Besoin d'aide ? Contactez-nous à{' '}
          <a href="mailto:contact@renomag.fr" className="text-primary-600 hover:underline">
            contact@renomag.fr
          </a>
        </p>
      </div>
    </div>
  )
}
