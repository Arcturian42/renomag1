'use client'

import { useFormContext } from 'react-hook-form'
import { MapPin } from 'lucide-react'
import type { DevisFormData } from '../../schema'

const PROPERTY_TYPES = [
  { value: 'maison', label: 'Maison', icon: '🏠' },
  { value: 'appartement', label: 'Appartement', icon: '🏢' },
  { value: 'copropriete', label: 'Copropriété', icon: '🏘️' },
]

export default function LogementStep() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<DevisFormData>()

  const propertyType = watch('propertyType')

  return (
    <div>
      <h2 className="text-lg font-semibold text-slate-900 mb-1">Votre logement</h2>
      <p className="text-sm text-slate-500 mb-6">
        Ces informations nous permettent de sélectionner les artisans dans votre zone
      </p>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <label className="label" htmlFor="zipCode">Code postal</label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="zipCode"
                type="text"
                placeholder="75001"
                className="input-field pl-10"
                required
                aria-required="true"
                {...register('zipCode')}
              />
            </div>
            {errors.zipCode && (
              <p role="alert" className="text-sm text-red-600 mt-1">{errors.zipCode.message}</p>
            )}
          </div>
          <div>
            <label className="label" htmlFor="city">Ville</label>
            <input
              id="city"
              type="text"
              placeholder="Paris"
              className="input-field"
              {...register('city')}
            />
            {errors.city && (
              <p role="alert" className="text-sm text-red-600 mt-1">{errors.city.message}</p>
            )}
          </div>
        </div>

        <div>
          <p className="label">Type de logement</p>
          <div className="grid grid-cols-3 gap-3">
            {PROPERTY_TYPES.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => setValue('propertyType', type.value, { shouldValidate: true })}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  propertyType === type.value
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <span className="text-2xl">{type.icon}</span>
                <span className="text-xs font-medium text-slate-700">{type.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label" htmlFor="anne-de-construction">
              Année de construction
            </label>
            <select
              id="anne-de-construction"
              className="input-field"
              {...register('propertyYear')}
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
            <label className="label" htmlFor="surface-habitable">
              Surface habitable
            </label>
            <select
              id="surface-habitable"
              className="input-field"
              {...register('surface')}
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
