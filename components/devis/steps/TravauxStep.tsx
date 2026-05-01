'use client'

import { useController, Control } from 'react-hook-form'
import { CheckCircle } from 'lucide-react'
import { WORK_TYPES } from '@/lib/data/subsidies'
import type { DevisFormData } from '@/lib/schemas/devis'

export default function TravauxStep({ control }: { control: Control<DevisFormData> }) {
  const { field: workTypesField } = useController({
    control,
    name: 'workTypes',
  })

  const { field: budgetField } = useController({
    control,
    name: 'budget',
  })

  const toggleWorkType = (id: string) => {
    const current = (workTypesField.value as string[]) || []
    if (current.includes(id)) {
      workTypesField.onChange(current.filter((w) => w !== id))
    } else {
      workTypesField.onChange([...current, id])
    }
  }

  return (
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
            type="button"
            onClick={() => toggleWorkType(work.id)}
            className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all ${
              (workTypesField.value || []).includes(work.id)
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
            {(workTypesField.value || []).includes(work.id) && (
              <CheckCircle className="w-4 h-4 text-primary-600 ml-auto flex-shrink-0 mt-0.5" />
            )}
          </button>
        ))}
      </div>

      <div>
        <label className="label" htmlFor="budget">
          Budget estimé pour vos travaux
        </label>
        <select id="budget" className="input-field" value={budgetField.value || ''} onChange={budgetField.onChange}>
          <option value="">Sélectionnez une tranche</option>
          <option value="5000">Moins de 5 000€</option>
          <option value="10000">5 000€ – 10 000€</option>
          <option value="20000">10 000€ – 20 000€</option>
          <option value="35000">20 000€ – 50 000€</option>
          <option value="50000">Plus de 50 000€</option>
        </select>
      </div>
    </div>
  )
}
