'use client'

import { useController, Control } from 'react-hook-form'
import { Info } from 'lucide-react'
import type { DevisFormData } from '@/lib/schemas/devis'

const REVENUS = [
  { value: 'modeste', label: 'Très modestes', badge: 'jusqu\'à 21 125€/an', className: 'bg-green-100 text-green-700 border-green-200' },
  { value: 'intermediaire', label: 'Modestes à intermédiaires', badge: 'jusqu\'à 31 287€/an', className: 'bg-blue-100 text-blue-700 border-blue-200' },
  { value: 'superieur', label: 'Intermédiaires à supérieurs', badge: '> 31 287€/an', className: 'bg-slate-100 text-slate-700 border-slate-200' },
]

export default function RevenusStep({ control }: { control: Control<DevisFormData> }) {
  const { field } = useController({ control, name: 'income' })

  return (
    <div>
      <h2 className="text-lg font-semibold text-slate-900 mb-1">
        Quel est votre niveau de revenus ?
      </h2>
      <p className="text-sm text-slate-500 mb-6">
        Cette information détermine votre éligibilité aux aides
      </p>
      <div className="space-y-3">
        {REVENUS.map((r) => (
          <button
            key={r.value}
            type="button"
            onClick={() => field.onChange(r.value)}
            className={`w-full flex items-center justify-between p-4 rounded-xl border-2 text-left transition-all ${
              field.value === r.value
                ? 'border-primary-500 bg-primary-50'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                field.value === r.value ? 'border-primary-500' : 'border-slate-300'
              }`}>
                {field.value === r.value && (
                  <div className="w-2.5 h-2.5 rounded-full bg-primary-500" />
                )}
              </div>
              <span className="font-medium text-slate-900">{r.label}</span>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full border ${r.className}`}>
              {r.badge}
            </span>
          </button>
        ))}
      </div>
      <div className="mt-4 flex items-start gap-2 text-xs text-slate-400">
        <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <p>Montants pour un foyer de 1 personne (2024). Renseignement indicatif.</p>
      </div>
    </div>
  )
}
