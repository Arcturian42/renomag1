'use client'

import { useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight, ArrowLeft, Loader2, Calculator, CheckCircle } from 'lucide-react'
import { calculateSubsidy, formatPrice } from '@/lib/utils'
import { submitLead } from '@/app/actions/leads'
import { devisSchema, type DevisFormData } from '../schema'
import TravauxStep from './steps/TravauxStep'
import LogementStep from './steps/LogementStep'
import RevenusStep from './steps/RevenusStep'
import ContactStep from './steps/ContactStep'
import ConfirmationStep from './steps/ConfirmationStep'

type Step = 'travaux' | 'logement' | 'revenus' | 'contact' | 'confirmation'

const STEPS: { id: Step; label: string }[] = [
  { id: 'travaux', label: 'Travaux' },
  { id: 'logement', label: 'Logement' },
  { id: 'revenus', label: 'Revenus' },
  { id: 'contact', label: 'Contact' },
  { id: 'confirmation', label: 'Confirmation' },
]

const STEP_FIELDS: Record<Exclude<Step, 'confirmation'>, (keyof DevisFormData)[]> = {
  travaux: ['workTypes', 'budget'],
  logement: ['zipCode', 'city', 'propertyType', 'propertyYear', 'surface'],
  revenus: ['income'],
  contact: ['firstName', 'lastName', 'email', 'phone', 'message'],
}

export default function DevisForm() {
  const [currentStep, setCurrentStep] = useState<Step>('travaux')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const methods = useForm<DevisFormData>({
    resolver: zodResolver(devisSchema),
    defaultValues: {
      workTypes: [],
      budget: '',
      zipCode: '',
      city: '',
      propertyType: '',
      propertyYear: '',
      surface: '',
      income: undefined as unknown as undefined,
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      message: '',
    },
    mode: 'onChange',
  })

  const { handleSubmit, trigger, watch, formState } = methods

  const workTypes = watch('workTypes')
  const income = watch('income')
  const budget = watch('budget')

  const estimatedSubsidy =
    workTypes.length > 0 && income && budget
      ? calculateSubsidy(
          workTypes[0],
          income as 'modeste' | 'intermediaire' | 'superieur',
          Number(budget)
        )
      : null

  const stepIndex = STEPS.findIndex((s) => s.id === currentStep)

  const next = async () => {
    setSubmitError(null)

    if (currentStep === 'contact') {
      const valid = await trigger(STEP_FIELDS.contact)
      if (!valid) return

      setIsSubmitting(true)
      const data = methods.getValues()
      const result = await submitLead(data)
      setIsSubmitting(false)

      if (result.success) {
        setCurrentStep('confirmation')
      } else {
        setSubmitError(result.error ?? 'Une erreur est survenue lors de l\'envoi de votre demande.')
      }
      return
    }

    const fields = STEP_FIELDS[currentStep as Exclude<Step, 'confirmation'>]
    const valid = await trigger(fields)
    if (!valid) return

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
    <FormProvider {...methods}>
      {/* Progress */}
      <nav aria-label="Progression du formulaire" className="mb-6">
        <ol className="flex items-center gap-2">
          {STEPS.map((step, idx) => (
            <li key={step.id} className="flex items-center gap-2 flex-1" aria-current={idx === stepIndex ? 'step' : undefined}>
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
            </li>
          ))}
        </ol>
      </nav>
      <div aria-live="polite" className="sr-only">
        Étape {stepIndex + 1} sur {STEPS.length} : {STEPS[stepIndex]?.label}
      </div>

      <div className="grid lg:grid-cols-[1fr_260px] gap-6">
        {/* Form */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          {currentStep === 'travaux' && <TravauxStep />}
          {currentStep === 'logement' && <LogementStep />}
          {currentStep === 'revenus' && <RevenusStep />}
          {currentStep === 'contact' && <ContactStep />}
          {currentStep === 'confirmation' && (
            <ConfirmationStep estimatedSubsidy={estimatedSubsidy} />
          )}

          {submitError && (
            <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
              {submitError}
            </div>
          )}

          {/* Navigation */}
          {currentStep !== 'confirmation' && (
            <div className="flex items-center justify-between mt-8 pt-5 border-t border-slate-100">
              <button
                type="button"
                onClick={back}
                disabled={stepIndex === 0}
                className="btn-ghost disabled:opacity-30"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour
              </button>
              <button
                type="button"
                onClick={next}
                disabled={
                  isSubmitting ||
                  (currentStep === 'travaux' && workTypes.length === 0)
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
    </FormProvider>
  )
}
