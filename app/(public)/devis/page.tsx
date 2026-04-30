'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle, ArrowRight, ArrowLeft, Calculator, MapPin, Loader2 } from 'lucide-react'
import { WORK_TYPES } from '@/lib/data/subsidies'
import { calculateSubsidy, formatPrice } from '@/lib/utils'
import { submitLead } from '@/app/actions/leads'

type Step = 'travaux' | 'logement' | 'revenus' | 'contact' | 'confirmation'

const STEPS: { id: Step; label: string }[] = [
  { id: 'travaux', label: 'Travaux' },
  { id: 'logement', label: 'Logement' },
  { id: 'revenus', label: 'Revenus' },
  { id: 'contact', label: 'Contact' },
  { id: 'confirmation', label: 'Confirmation' },
]

export default function DevisPage() {
  const [currentStep, setCurrentStep] = useState<Step>('travaux')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    workTypes: [] as string[],
    budget: '',
    zipCode: '',
    city: '',
    propertyType: '',
    propertyYear: '',
    surface: '',
    income: '' as '' | 'modeste' | 'intermediaire' | 'superieur',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
  })

  const stepIndex = STEPS.findIndex((s) => s.id === currentStep)

  const estimatedSubsidy = formData.workTypes.length > 0 && formData.income && formData.budget
    ? calculateSubsidy(
        formData.workTypes[0],
        formData.income as 'modeste' | 'intermediaire' | 'superieur',
        Number(formData.budget)
      )
    : null

  const toggleWorkType = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      workTypes: prev.workTypes.includes(id)
        ? prev.workTypes.filter((w) => w !== id)
        : [...prev.workTypes, id],
    }))
  }

  const next = async () => {
    if (currentStep === 'contact') {
      setIsSubmitting(true)
      const result = await submitLead(formData)
      setIsSubmitting(false)
      
      if (result.success) {
        setCurrentStep('confirmation')
      } else {
        alert('Une erreur est survenue lors de l\'envoi de votre demande : ' + result.error)
      }
      return
    }

    const nextIdx = stepIndex + 1
    if (nextIdx < STEPS.length) {
      setCurrentStep(STEPS[nextIdx].id)
    }
  }

  const back = () => {
    const prevIdx = stepIndex - 1
    if (prevIdx >= 0) {
      setCurrentStep(STEPS[prevIdx].id)
    }
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold text-slate-900">
            Obtenez vos devis gratuits
          </h1>
          <p className="text-slate-500 mt-1">
            En quelques minutes, recevez jusqu'à 3 devis d'artisans RGE certifiés
          </p>

          {/* Progress */}
          <div className="mt-6 flex items-center gap-2">
            {STEPS.map((step, idx) => (
              <div key={step.id} className="flex items-center gap-2 flex-1">
                <div
                  className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold flex-shrink-0 transition-colors ${
                    idx < stepIndex
                      ? 'bg-eco-500 text-white'
                      : idx === stepIndex
                      ? 'bg-primary-800 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {idx < stepIndex ? <CheckCircle className="w-4 h-4" /> : idx + 1}
                </div>
                <span
                  className={`text-xs font-medium hidden sm:block ${
                    idx === stepIndex ? 'text-primary-800' : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </span>
                {idx < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-px ${
                      idx < stepIndex ? 'bg-eco-300' : 'bg-slate-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-[1fr_260px] gap-6">
          {/* Form */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            {/* Step: Travaux */}
            {currentStep === 'travaux' && (
              <div>
                <h2 className="text-lg font-semibold text-slate-900 mb-1">
                  Quels travaux souhaitez-vous réaliser ?
                </h2>
                <p className="text-sm text-slate-500 mb-6">
                  Sélectionnez un ou plusieurs types de travaux
                </p>
                <div className="grid sm:grid-cols-2 gap-3 mb-6">
                  {WORK_TYPES.map((work) => (
                    <button
                      key={work.id}
                      onClick={() => toggleWorkType(work.id)}
                      className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                        formData.workTypes.includes(work.id)
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-2xl flex-shrink-0">{work.icon}</span>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{work.name}</p>
                        <p className="text-xs text-slate-400 mt-0.5 leading-snug">
                          {work.description}
                        </p>
                      </div>
                      {formData.workTypes.includes(work.id) && (
                        <CheckCircle className="w-4 h-4 text-primary-600 ml-auto flex-shrink-0 mt-0.5" />
                      )}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="label">Budget estimé pour vos travaux</label>
                  <select
                    className="input-field"
                    value={formData.budget}
                    onChange={(e) => setFormData((p) => ({ ...p, budget: e.target.value }))}
                  >
                    <option value="">Sélectionnez une tranche</option>
                    <option value="5000">Moins de 5 000€</option>
                    <option value="10000">5 000€ – 10 000€</option>
                    <option value="20000">10 000€ – 20 000€</option>
                    <option value="35000">20 000€ – 50 000€</option>
                    <option value="50000">Plus de 50 000€</option>
                  </select>
                </div>
              </div>
            )}

            {/* Step: Logement */}
            {currentStep === 'logement' && (
              <div>
                <h2 className="text-lg font-semibold text-slate-900 mb-1">
                  Votre logement
                </h2>
                <p className="text-sm text-slate-500 mb-6">
                  Ces informations nous permettent de sélectionner les artisans dans votre zone
                </p>
                <div className="space-y-4">
                  <div className="relative">
                    <label className="label">Code postal et ville</label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="75001 Paris"
                        className="input-field pl-10"
                        value={formData.zipCode}
                        onChange={(e) => setFormData((p) => ({ ...p, zipCode: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="label">Type de logement</label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: 'maison', label: 'Maison', icon: '🏠' },
                        { value: 'appartement', label: 'Appartement', icon: '🏢' },
                        { value: 'copropriete', label: 'Copropriété', icon: '🏘️' },
                      ].map((type) => (
                        <button
                          key={type.value}
                          onClick={() =>
                            setFormData((p) => ({ ...p, propertyType: type.value }))
                          }
                          className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                            formData.propertyType === type.value
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <span className="text-2xl">{type.icon}</span>
                          <span className="text-xs font-medium text-slate-700">
                            {type.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">Année de construction</label>
                      <select
                        className="input-field"
                        value={formData.propertyYear}
                        onChange={(e) =>
                          setFormData((p) => ({ ...p, propertyYear: e.target.value }))
                        }
                      >
                        <option value="">Sélectionner</option>
                        <option value="avant1948">Avant 1948</option>
                        <option value="1948-1975">1948 – 1975</option>
                        <option value="1975-1990">1975 – 1990</option>
                        <option value="1990-2000">1990 – 2000</option>
                        <option value="apres2000">Après 2000</option>
                      </select>
                    </div>
                    <div>
                      <label className="label">Surface habitable</label>
                      <select
                        className="input-field"
                        value={formData.surface}
                        onChange={(e) =>
                          setFormData((p) => ({ ...p, surface: e.target.value }))
                        }
                      >
                        <option value="">Sélectionner</option>
                        <option value="50">Moins de 50m²</option>
                        <option value="100">50 – 100m²</option>
                        <option value="150">100 – 150m²</option>
                        <option value="200">150 – 200m²</option>
                        <option value="250">Plus de 200m²</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step: Revenus */}
            {currentStep === 'revenus' && (
              <div>
                <h2 className="text-lg font-semibold text-slate-900 mb-1">
                  Votre situation financière
                </h2>
                <p className="text-sm text-slate-500 mb-6">
                  Votre revenu fiscal de référence détermine le montant de vos aides
                </p>
                <div className="space-y-3">
                  {[
                    {
                      value: 'modeste',
                      label: 'Ménage très modeste ou modeste',
                      description: 'RFR inférieur à 36 816€ (couple en Île-de-France)',
                      rate: 'Jusqu\'à 70% d\'aides',
                      color: 'border-blue-400 bg-blue-50',
                    },
                    {
                      value: 'intermediaire',
                      label: 'Ménage intermédiaire',
                      description: 'RFR entre 36 816€ et 56 130€ (couple en Île-de-France)',
                      rate: 'Jusqu\'à 40% d\'aides',
                      color: 'border-purple-400 bg-purple-50',
                    },
                    {
                      value: 'superieur',
                      label: 'Ménage supérieur',
                      description: 'RFR au-dessus des plafonds intermédiaires',
                      rate: 'Jusqu\'à 30% d\'aides',
                      color: 'border-rose-400 bg-rose-50',
                    },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() =>
                        setFormData((p) => ({
                          ...p,
                          income: option.value as typeof formData.income,
                        }))
                      }
                      className={`w-full flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                        formData.income === option.value
                          ? option.color
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center ${
                          formData.income === option.value
                            ? 'border-primary-500 bg-primary-500'
                            : 'border-slate-300'
                        }`}
                      >
                        {formData.income === option.value && (
                          <div className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-900">{option.label}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{option.description}</p>
                      </div>
                      <span className="text-xs font-bold text-eco-600 whitespace-nowrap">
                        {option.rate}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step: Contact */}
            {currentStep === 'contact' && (
              <div>
                <h2 className="text-lg font-semibold text-slate-900 mb-1">
                  Vos coordonnées
                </h2>
                <p className="text-sm text-slate-500 mb-6">
                  Pour que les artisans puissent vous contacter
                </p>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">Prénom</label>
                      <input
                        type="text"
                        placeholder="Jean"
                        className="input-field"
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData((p) => ({ ...p, firstName: e.target.value }))
                        }
                      />
                    </div>
                    <div>
                      <label className="label">Nom</label>
                      <input
                        type="text"
                        placeholder="Dupont"
                        className="input-field"
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData((p) => ({ ...p, lastName: e.target.value }))
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <label className="label">Email</label>
                    <input
                      type="email"
                      placeholder="jean.dupont@email.fr"
                      className="input-field"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, email: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <label className="label">Téléphone</label>
                    <input
                      type="tel"
                      placeholder="06 12 34 56 78"
                      className="input-field"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, phone: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <label className="label">Informations complémentaires (optionnel)</label>
                    <textarea
                      rows={3}
                      placeholder="Précisez votre projet, vos contraintes..."
                      className="input-field resize-none"
                      value={formData.message}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, message: e.target.value }))
                      }
                    />
                  </div>
                  <p className="text-xs text-slate-400">
                    En soumettant ce formulaire, vous acceptez nos{' '}
                    <Link href="/cgv" className="text-primary-600 hover:underline">CGU</Link>
                    {' '}et notre{' '}
                    <Link href="/confidentialite" className="text-primary-600 hover:underline">
                      politique de confidentialité
                    </Link>.
                  </p>
                </div>
              </div>
            )}

            {/* Step: Confirmation */}
            {currentStep === 'confirmation' && (
              <div className="text-center py-6">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-eco-100 mx-auto mb-5">
                  <CheckCircle className="w-8 h-8 text-eco-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-3">
                  Votre demande a été envoyée !
                </h2>
                <p className="text-slate-500 mb-6">
                  Vous recevrez jusqu'à 3 devis d'artisans RGE certifiés dans votre zone sous
                  <strong className="text-slate-900"> 24 heures</strong>.
                </p>
                {estimatedSubsidy && (
                  <div className="bg-eco-50 border border-eco-200 rounded-xl p-4 mb-6 text-left">
                    <p className="text-sm font-semibold text-eco-800 mb-1">
                      <Calculator className="w-4 h-4 inline mr-1" />
                      Estimation de vos aides
                    </p>
                    <p className="text-2xl font-bold text-eco-700">
                      {formatPrice(estimatedSubsidy)}
                    </p>
                    <p className="text-xs text-eco-600 mt-1">
                      Estimation indicative — votre artisan calculera le montant exact
                    </p>
                  </div>
                )}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/annuaire" className="btn-secondary">
                    Parcourir l'annuaire
                  </Link>
                  <Link href="/espace-proprietaire" className="btn-primary">
                    Accéder à mon espace
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}

            {/* Navigation */}
            {currentStep !== 'confirmation' && (
              <div className="flex items-center justify-between mt-8 pt-5 border-t border-slate-100">
                <button
                  onClick={back}
                  disabled={stepIndex === 0}
                  className="btn-ghost disabled:opacity-30"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Retour
                </button>
                <button
                  onClick={next}
                  disabled={
                    isSubmitting || (currentStep === 'travaux' && formData.workTypes.length === 0)
                  }
                  className="btn-primary disabled:opacity-30"
                >
                  {isSubmitting ? (
                    <>
                      Envoi en cours...
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </>
                  ) : (
                    <>
                      {currentStep === 'contact' ? 'Envoyer ma demande' : 'Continuer'}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Subsidy estimate */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Calculator className="w-4 h-4 text-primary-600" />
                <h3 className="text-sm font-semibold text-slate-900">Vos aides estimées</h3>
              </div>
              {estimatedSubsidy ? (
                <div>
                  <div className="text-3xl font-bold text-eco-600 mb-1">
                    {formatPrice(estimatedSubsidy)}
                  </div>
                  <p className="text-xs text-slate-400">Estimation indicative</p>
                </div>
              ) : (
                <p className="text-sm text-slate-400">
                  Complétez le formulaire pour estimer vos aides
                </p>
              )}
            </div>

            {/* Guarantees */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-5">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Nos garanties</h3>
              {[
                '✓ Service 100% gratuit',
                '✓ Devis sous 24h',
                '✓ Artisans certifiés RGE',
                '✓ Sans engagement',
                '✓ Données protégées',
              ].map((g) => (
                <p key={g} className="text-xs text-slate-600 mb-2">
                  {g}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
