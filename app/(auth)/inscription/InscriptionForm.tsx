'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Zap, ArrowRight, CheckCircle } from 'lucide-react'
import { signup } from '@/app/actions/auth'
import GoogleSignInButton from '@/components/auth/GoogleSignInButton'

type UserType = 'particulier' | 'pro' | null

export default function InscriptionForm() {
  const [userType, setUserType] = useState<UserType>(null)
  const [step, setStep] = useState<'type' | 'form'>('type')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Nav */}
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary-800">
            <Zap className="w-3.5 h-3.5 text-accent-400" />
          </div>
          <span className="font-display font-bold text-lg text-slate-900">
            RENO<span className="text-primary-700">MAG</span>
          </span>
        </Link>
        <Link href="/connexion" className="text-sm text-slate-500 hover:text-slate-700">
          Déjà un compte ?{' '}
          <span className="text-primary-700 font-medium">Se connecter</span>
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-xl">
          {step === 'type' && (
            <div>
              <h1 className="text-2xl font-bold text-slate-900 text-center mb-2">
                Créer un compte
              </h1>
              <p className="text-slate-500 text-sm text-center mb-8">
                Choisissez le type de compte qui vous correspond
              </p>

              <div className="grid sm:grid-cols-2 gap-5">
                <button
                  onClick={() => {
                    setUserType('particulier')
                    setStep('form')
                  }}
                  className="group bg-white rounded-2xl border-2 border-slate-200 hover:border-primary-500 p-6 text-left transition-all hover:shadow-md"
                >
                  <div className="text-4xl mb-4">🏠</div>
                  <h2 className="font-bold text-slate-900 text-lg mb-2">Je suis particulier</h2>
                  <p className="text-sm text-slate-500 mb-4">
                    Je veux rénover mon logement et obtenir des aides
                  </p>
                  <ul className="space-y-2 text-sm">
                    {[
                      'Devis gratuits sous 24h',
                      'Artisans RGE certifiés',
                      "Aide montage dossier MPR'",
                      'Suivi de mon projet',
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2 text-slate-600">
                        <CheckCircle className="w-3.5 h-3.5 text-eco-500 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-primary-700 group-hover:gap-3 transition-all">
                    Créer mon compte gratuit
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </button>

                <button
                  onClick={() => {
                    setUserType('pro')
                    setStep('form')
                  }}
                  className="group bg-white rounded-2xl border-2 border-slate-200 hover:border-accent-500 p-6 text-left transition-all hover:shadow-md"
                >
                  <div className="text-4xl mb-4">🔧</div>
                  <h2 className="font-bold text-slate-900 text-lg mb-2">Je suis artisan RGE</h2>
                  <p className="text-sm text-slate-500 mb-4">
                    Je veux développer mon activité avec des leads qualifiés
                  </p>
                  <ul className="space-y-2 text-sm">
                    {[
                      'Leads qualifiés géolocalisés',
                      'Profil optimisé SEO',
                      'Gestion des devis en ligne',
                      'Analytics de performance',
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2 text-slate-600">
                        <CheckCircle className="w-3.5 h-3.5 text-accent-500 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-accent-700 group-hover:gap-3 transition-all">
                    Démarrer 30 jours offerts
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </button>
              </div>
            </div>
          )}

          {step === 'form' && userType && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
              <button
                onClick={() => setStep('type')}
                className="text-sm text-slate-500 hover:text-slate-700 mb-6 flex items-center gap-1"
              >
                ← Retour
              </button>

              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">{userType === 'particulier' ? '🏠' : '🔧'}</span>
                <div>
                  <h1 className="text-xl font-bold text-slate-900">
                    {userType === 'particulier' ? 'Compte Particulier' : 'Compte Professionnel'}
                  </h1>
                  <p className="text-sm text-slate-500">
                    {userType === 'particulier'
                      ? '100% gratuit, sans engagement'
                      : '30 jours offerts, sans carte bancaire'}
                  </p>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                  {error}
                </div>
              )}

              {/* Social */}
              <div className="mb-5">
                <GoogleSignInButton mode="signup" userType={userType || undefined} />
              </div>

              <div className="relative flex items-center mb-5">
                <div className="flex-1 border-t border-slate-200" />
                <span className="mx-4 text-xs text-slate-400">ou par email</span>
                <div className="flex-1 border-t border-slate-200" />
              </div>

              <form onSubmit={async (e) => {
                e.preventDefault()
                setIsLoading(true)
                setError(null)

                try {
                  const formData = new FormData(e.currentTarget)
                  await signup(formData)
                  // If signup succeeds, it will redirect via the server action
                  // This code only runs if redirect fails
                  const role = formData.get('role') as string
                  if (role === 'ARTISAN') {
                    router.push('/espace-pro')
                  } else {
                    router.push('/espace-proprietaire')
                  }
                } catch (err) {
                  setIsLoading(false)
                  if (err && typeof err === 'object' && 'digest' in err && typeof err.digest === 'string' && err.digest.startsWith('NEXT_REDIRECT')) {
                    // This is a successful redirect, not an error
                    return
                  }
                  setError(err instanceof Error ? err.message : "Erreur lors de l'inscription. Veuillez réessayer.")
                }
              }} className="space-y-4">
                <input type="hidden" name="role" value={userType === 'pro' ? 'ARTISAN' : 'USER'} />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label" htmlFor="firstName">Prénom</label>
                    <input type="text" id="firstName" name="firstName" placeholder="Jean" className="input-field" disabled={isLoading} />
                  </div>
                  <div>
                    <label className="label" htmlFor="lastName">Nom</label>
                    <input type="text" id="lastName" name="lastName" placeholder="Dupont" className="input-field" disabled={isLoading} />
                  </div>
                </div>
                <div>
                  <label className="label" htmlFor="email">Email</label>
                  <input type="email" id="email" name="email" placeholder="jean.dupont@email.fr" className="input-field" required disabled={isLoading} />
                </div>
                {userType === 'pro' && (
                  <>
                    <div>
                      <label className="label" htmlFor="companyName">Nom de l'entreprise</label>
                      <input type="text" id="companyName" name="companyName" placeholder="Mon Entreprise SARL" className="input-field" disabled={isLoading} />
                    </div>
                    <div>
                      <label className="label" htmlFor="siret">SIRET</label>
                      <input type="text" id="siret" name="siret" placeholder="123 456 789 00012" className="input-field" disabled={isLoading} />
                    </div>
                  </>
                )}
                <div>
                  <label className="label" htmlFor="password">Mot de passe</label>
                  <input type="password" id="password" name="password" placeholder="8 caractères minimum" className="input-field" required minLength={6} disabled={isLoading} />
                </div>

                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="cgu"
                    name="cgu"
                    required
                    disabled={isLoading}
                    className="mt-0.5 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor="cgu" className="text-xs text-slate-500 cursor-pointer">
                    J'accepte les{' '}
                    <Link href="/cgv" className="text-primary-600 hover:underline">
                      CGU
                    </Link>{' '}
                    et la{' '}
                    <Link href="/confidentialite" className="text-primary-600 hover:underline">
                      politique de confidentialité
                    </Link>
                  </label>
                </div>

                <button type="submit" className="btn-primary w-full py-3" disabled={isLoading}>
                  {isLoading ? 'Création en cours...' : 'Créer mon compte'}
                  {!isLoading && <ArrowRight className="w-4 h-4" />}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
