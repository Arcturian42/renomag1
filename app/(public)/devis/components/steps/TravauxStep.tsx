'use client'

import { useFormContext, Controller } from 'react-hook-form'
import { CheckCircle } from 'lucide-react'
import { WORK_TYPES } from '@/lib/data/subsidies'
import type { DevisFormData } from '../../schema'

export default function TravauxStep() {
  const {
    control,
    formState: { errors },
  } = useFormContext<DevisFormData>()

  return (
    <div>
      <h2 className="text-lg font-semibold text-slate-900 mb-1">
        Quels travaux souhaitez-vous réaliser ?
      </h2>
      <p className="text-sm text-slate-500 mb-6">
        Sélectionnez un ou plusieurs types de travaux
      </p>

      <Controller
        control={control}
        name="workTypes"
        render={({ field }) => (
          <div className="grid sm:grid-cols-2 gap-3 mb-6">
            {WORK_TYPES.map((work) => {
              const selected = field.value.includes(work.id)
              return (
                <button
                  key={work.id}
                  type="button"
                  onClick={() => {
                    const next = selected
                      ? field.value.filter((w) => w !== work.id)
                      : [...field.value, work.id]
                    field.onChange(next)
                  }}
                  className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                    selected
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
                  {selected && (
                    <CheckCircle className="w-4 h-4 text-primary-600 ml-auto flex-shrink-0 mt-0.5" />
                  )}
                </button>
              )
            })}
          </div>
        )}
      />

      {errors.workTypes && (
        <p role="alert" className="text-sm text-red-600 mb-4">{errors.workTypes.message}</p>
      )}

      <div>
        <label className="label" htmlFor="budget-estim-pour-vos-travaux">
          Budget estimé pour vos travaux
        </label>
        <select
          id="budget-estim-pour-vos-travaux"
          className="input-field"
          {...control.register('budget')}
        >
          <option value="">Sélectionnez une tranche</option>
          <option value="5000">Moins de 5 000€</option>
          <option value="10000">5 000€ – 10 000€</option>
          <option value="20000">10 000€ – 20 000€</option>
          <option value="35000">20 000€ – 50 000€</option>
          <option value="50000">Plus de 50 000€</option>
        </select>
        {errors.budget && (
          <p role="alert" className="text-sm text-red-600 mt-1">{errors.budget.message}</p>
        )}
      </div>
    </div>
  )
}
