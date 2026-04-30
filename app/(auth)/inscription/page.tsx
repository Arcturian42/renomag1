'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import Link from 'next/link'
import { Zap, ArrowRight, CheckCircle } from 'lucide-react'
import SignupForm from '@/src/components/auth/SignupForm'

type UserType = 'particulier' | 'pro' | null

export default function InscriptionPage() {
  const [userType, setUserType] = useState<UserType>(null)
  const [step, setStep] = useState<'type' | 'form'>('type')

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

              <SignupForm userType={userType} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
