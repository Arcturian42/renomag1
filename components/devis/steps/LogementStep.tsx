'use client'

import { useController, Control } from 'react-hook-form'
import { MapPin } from 'lucide-react'
import type { DevisFormData } from '@/lib/schemas/devis'

const PROPERTY_TYPES = [
  { value: 'maison', label: 'Maison', icon: '🏠' },
  { value: 'appartement', label: 'Appartement', icon: '🏢' },
  { value: 'copropriete', label: 'Copropriété', icon: '🏘️' },
]

export default function LogementStep({ control }: { control: Control<DevisFormData> }) {
  const { field: zipCodeField } = useController({ control, name: 'zipCode' })
  const { field: propertyTypeField } = useController({ control, name: 'propertyType' })
  const { field: propertyYearField } = useController({ control, name: 'propertyYear' })
  const { field: surfaceField } = useController({ control, name: 'surface' })

  return (
    <div>
      <h2 className="text-lg font-semibold text-slate-900 mb-1">
        Votre logement
      </h2>
      <p className="text-sm text-slate-500 mb-6">
        Ces informations nous permettent de sélectionner les artisans dans votre zone
      </p>
      <div className="space-y-4">
        <div className="relative">
          <label className="label" htmlFor="zipCode">
            Code postal et ville
          </label>
          <div className="relative">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="zipCode"
              type="text"
              placeholder="75001 Paris"
              className="input-field pl-10"
              value={zipCodeField.value || ''}
              onChange={zipCodeField.onChange}
            />
          </div>
        </div>
        <fieldset>
          <legend className="label">Type de logement</legend>
          <div className="grid grid-cols-3 gap-3">
            {PROPERTY_TYPES.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => propertyTypeField.onChange(type.value)}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  propertyTypeField.value === type.value
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <span className="text-2xl">{type.icon}</span>
                <span className="text-xs font-medium text-slate-700">{type.label}</span>
              </button>
            ))}
          </div>
        </fieldset>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label" htmlFor="propertyYear">
              Année de construction
            </label>
            <select
              id="propertyYear"
              className="input-field"
              value={propertyYearField.value || ''}
              onChange={propertyYearField.onChange}
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
            <label className="label" htmlFor="surface">
              Surface habitable
            </label>
            <select
              id="surface"
              className="input-field"
              value={surfaceField.value || ''}
              onChange={surfaceField.onChange}
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
  )
}
