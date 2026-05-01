'use client'

import { useFormContext } from 'react-hook-form'
import type { DevisFormData } from '../../schema'

const OPTIONS = [
  {
    value: 'modeste',
    label: 'Ménage très modeste ou modeste',
    description: 'RFR inférieur à 36 816€ (couple en Île-de-France)',
    rate: "Jusqu'à 70% d'aides",
    color: 'border-blue-400 bg-blue-50',
  },
  {
    value: 'intermediaire',
    label: 'Ménage intermédiaire',
    description: 'RFR entre 36 816€ et 56 130€ (couple en Île-de-France)',
    rate: "Jusqu'à 40% d'aides",
    color: 'border-purple-400 bg-purple-50',
  },
  {
    value: 'superieur',
    label: 'Ménage supérieur',
    description: 'RFR au-dessus des plafonds intermédiaires',
    rate: "Jusqu'à 30% d'aides",
    color: 'border-rose-400 bg-rose-50',
  },
] as const

export default function RevenusStep() {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<DevisFormData>()

  const income = watch('income')

  return (
    <div>
      <h2 className="text-lg font-semibold text-slate-900 mb-1">
        Votre situation financière
      </h2>
      <p className="text-sm text-slate-500 mb-6">
        Votre revenu fiscal de référence détermine le montant de vos aides
      </p>
      <div className="space-y-3">
        {OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setValue('income', option.value, { shouldValidate: true })}
            className={`w-full flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-all ${
              income === option.value ? option.color : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center ${
                income === option.value ? 'border-primary-500 bg-primary-500' : 'border-slate-300'
              }`}
            >
              {income === option.value && <div className="w-2 h-2 rounded-full bg-white" />}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-900">{option.label}</p>
              <p className="text-xs text-slate-500 mt-0.5">{option.description}</p>
            </div>
            <span className="text-xs font-bold text-eco-600 whitespace-nowrap">{option.rate}</span>
          </button>
        ))}
      </div>
      {errors.income && (
        <p className="text-sm text-red-600 mt-3">{errors.income.message}</p>
      )}
    </div>
  )
}
