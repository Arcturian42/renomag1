'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { X, Search, Building2, User, Phone, ChevronRight } from 'lucide-react'
import { completeOnboarding } from '@/app/actions/onboarding'

interface OnboardingModalProps {
  userId: string
  userEmail: string
  existingProfile?: {
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
  } | null
}

export default function OnboardingModal({ userId, userEmail, existingProfile }: OnboardingModalProps) {
  const router = useRouter()
  const [step, setStep] = useState<'profile' | 'company'>('profile')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [firstName, setFirstName] = useState(existingProfile?.firstName || '')
  const [lastName, setLastName] = useState(existingProfile?.lastName || '')
  const [phone, setPhone] = useState(existingProfile?.phone || '')
  const [companyChoice, setCompanyChoice] = useState<'search' | 'create' | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const handleProfileNext = () => {
    if (!firstName || !lastName || !phone) {
      alert('Veuillez remplir tous les champs')
      return
    }
    setStep('company')
  }

  const handleComplete = async (skipCompany = false) => {
    if (!firstName || !lastName || !phone) {
      alert('Veuillez remplir tous les champs')
      return
    }

    setIsSubmitting(true)
    try {
      await completeOnboarding({
        userId,
        firstName,
        lastName,
        phone,
        skipCompany,
      })

      // Redirect to profile if user chose to create company, otherwise reload
      if (!skipCompany) {
        router.push('/espace-pro/profil')
      } else {
        window.location.reload()
      }
    } catch (error) {
      console.error('Onboarding error:', error)
      alert('Une erreur est survenue. Veuillez réessayer.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {step === 'profile' ? 'Bienvenue sur RENOMAG' : 'Votre entreprise'}
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              {step === 'profile' ? 'Complétez votre profil pour commencer' : 'Trouvez ou créez votre fiche entreprise'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${step === 'profile' ? 'bg-primary-600' : 'bg-slate-300'}`} />
            <div className={`w-2 h-2 rounded-full ${step === 'company' ? 'bg-primary-600' : 'bg-slate-300'}`} />
          </div>
        </div>

        <div className="p-6">
          {step === 'profile' && (
            <div className="space-y-5">
              <div className="bg-primary-50 border border-primary-200 rounded-xl p-4">
                <p className="text-sm text-primary-900">
                  Pour continuer, merci de compléter vos informations personnelles.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    <User className="w-4 h-4 inline mr-1" />
                    Prénom
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="input-field"
                    placeholder="Jean"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    <User className="w-4 h-4 inline mr-1" />
                    Nom
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="input-field"
                    placeholder="Dupont"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="input-field"
                    placeholder="06 12 34 56 78"
                    required
                  />
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                  <p className="text-xs text-slate-600">
                    <strong>Email:</strong> {userEmail}
                  </p>
                </div>
              </div>

              <button
                onClick={handleProfileNext}
                disabled={!firstName || !lastName || !phone}
                className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continuer
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 'company' && (
            <div className="space-y-5">
              {!companyChoice && (
                <>
                  <div className="bg-primary-50 border border-primary-200 rounded-xl p-4">
                    <p className="text-sm text-primary-900">
                      Votre entreprise est-elle déjà dans notre annuaire ?
                    </p>
                  </div>

                  <div className="grid gap-4">
                    <button
                      onClick={() => setCompanyChoice('search')}
                      className="flex items-start gap-4 p-5 border-2 border-slate-200 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-all text-left"
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                        <Search className="w-5 h-5 text-primary-700" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 mb-1">Rechercher mon entreprise</h3>
                        <p className="text-sm text-slate-600">
                          Trouvez votre fiche existante et demandez à la gérer
                        </p>
                      </div>
                    </button>

                    <button
                      onClick={() => setCompanyChoice('create')}
                      className="flex items-start gap-4 p-5 border-2 border-slate-200 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-all text-left"
                    >
                      <div className="w-10 h-10 rounded-lg bg-eco-100 flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-5 h-5 text-eco-700" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 mb-1">Créer ma fiche entreprise</h3>
                        <p className="text-sm text-slate-600">
                          Mon entreprise n'est pas encore dans l'annuaire
                        </p>
                      </div>
                    </button>
                  </div>

                  <button
                    onClick={() => handleComplete(true)}
                    disabled={isSubmitting}
                    className="text-sm text-slate-500 hover:text-slate-700 underline w-full text-center"
                  >
                    Je ferai ça plus tard
                  </button>
                </>
              )}

              {companyChoice === 'search' && (
                <div className="space-y-4">
                  <button
                    onClick={() => setCompanyChoice(null)}
                    className="text-sm text-primary-600 hover:text-primary-800 flex items-center gap-1"
                  >
                    ← Retour
                  </button>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Rechercher par nom d'entreprise ou SIRET
                    </label>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="input-field"
                      placeholder="Ex: Dupont Rénovation, 12345678901234"
                    />
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <p className="text-sm text-amber-800">
                      <strong>Fonctionnalité en cours de développement</strong><br />
                      Contactez-nous à support@renomag.fr pour revendiquer votre fiche existante.
                    </p>
                  </div>

                  <button
                    onClick={() => handleComplete(true)}
                    disabled={isSubmitting}
                    className="btn-primary w-full py-3"
                  >
                    {isSubmitting ? 'En cours...' : 'Terminer pour le moment'}
                  </button>
                </div>
              )}

              {companyChoice === 'create' && (
                <div className="space-y-4">
                  <button
                    onClick={() => setCompanyChoice(null)}
                    className="text-sm text-primary-600 hover:text-primary-800 flex items-center gap-1"
                  >
                    ← Retour
                  </button>

                  <div className="bg-eco-50 border border-eco-200 rounded-lg p-4">
                    <p className="text-sm text-eco-900">
                      Vous serez redirigé vers la page de profil pour créer votre fiche entreprise.
                    </p>
                  </div>

                  <button
                    onClick={() => handleComplete(false)}
                    disabled={isSubmitting}
                    className="btn-primary w-full py-3"
                  >
                    {isSubmitting ? 'En cours...' : 'Continuer vers mon profil'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
