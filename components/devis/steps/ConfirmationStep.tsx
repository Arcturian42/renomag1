'use client'

import { DevisFormData } from '@/lib/schemas/devis'
import { WORK_TYPES } from '@/lib/data/subsidies'
import { CheckCircle, Zap } from 'lucide-react'

const BUDGET_LABELS: Record<string, string> = {
  '5000': 'Moins de 5 000€',
  '10000': '5 000€ – 10 000€',
  '20000': '10 000€ – 20 000€',
  '35000': '20 000€ – 50 000€',
  '50000': 'Plus de 50 000€',
}

const PROPERTY_LABELS: Record<string, string> = {
  'maison': 'Maison',
  'appartement': 'Appartement',
  'copropriete': 'Copropriété',
}

const SURFACE_LABELS: Record<string, string> = {
  '50': 'Moins de 50m²',
  '100': '50 – 100m²',
  '150': '100 – 150m²',
  '200': '150 – 200m²',
  '250': 'Plus de 200m²',
}

const YEAR_LABELS: Record<string, string> = {
  'avant1948': 'Avant 1948',
  '1948-1975': '1948 – 1975',
  '1975-1990': '1975 – 1990',
  '1990-2000': '1990 – 2000',
  'apres2000': 'Après 2000',
}

const INCOME_LABELS: Record<string, string> = {
  'modeste': 'Très modestes',
  'intermediaire': 'Modestes à intermédiaires',
  'superieur': 'Intermédiaires à supérieurs',
}

export default function ConfirmationStep({ data }: { data: DevisFormData }) {
  const workTypeLabels = data.workTypes
    .map(id => WORK_TYPES.find(w => w.id === id)?.name || id)
    .join(', ')

  return (
    <div>
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 mb-4">
          <CheckCircle className="w-8 h-8 text-primary-600" />
        </div>
        <h2 className="text-lg font-semibold text-slate-900">
          Récapitulatif de votre demande
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Vérifiez vos informations avant d'envoyer votre demande
        </p>
      </div>

      <div className="space-y-4">
        <div className="bg-slate-50 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-slate-700 mb-2">Travaux</h3>
          <p className="text-sm text-slate-600">{workTypeLabels}</p>
          <p className="text-sm text-slate-500 mt-1">Budget : {BUDGET_LABELS[data.budget] || data.budget}</p>
        </div>

        <div className="bg-slate-50 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-slate-700 mb-2">Logement</h3>
          <p className="text-sm text-slate-600">{PROPERTY_LABELS[data.propertyType] || data.propertyType}</p>
          <p className="text-sm text-slate-500 mt-1">{YEAR_LABELS[data.propertyYear] || data.propertyYear} • {SURFACE_LABELS[data.surface] || data.surface}</p>
          <p className="text-sm text-slate-500 mt-1">Code postal : {data.zipCode}</p>
        </div>

        <div className="bg-slate-50 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-slate-700 mb-2">Revenus</h3>
          <p className="text-sm text-slate-600">{INCOME_LABELS[data.income] || data.income}</p>
        </div>

        <div className="bg-slate-50 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-slate-700 mb-2">Contact</h3>
          <p className="text-sm text-slate-600">{data.firstName} {data.lastName}</p>
          <p className="text-sm text-slate-500 mt-1">{data.email}</p>
          <p className="text-sm text-slate-500">{data.phone}</p>
          {data.message && <p className="text-sm text-slate-500 mt-1 italic">&ldquo;{data.message}&rdquo;</p>}
        </div>
      </div>

      <div className="mt-6 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
        <Zap className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-amber-800">
            Jusqu&apos;à 90% de vos travaux peuvent être financés par des aides !
          </p>
          <p className="text-xs text-amber-600 mt-1">
            Nos artisans vous aideront à constituer votre dossier d&apos;aides.
          </p>
        </div>
      </div>
    </div>
  )
}
