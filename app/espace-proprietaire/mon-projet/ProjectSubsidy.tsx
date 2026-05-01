'use client'

import { useState } from 'react'
import { calculateSubsidy, parseBudget } from '@/lib/utils'

type IncomeLevel = 'modeste' | 'intermediaire' | 'superieur'

export default function ProjectSubsidy({ projectType, budget }: { projectType: string; budget: string }) {
  const [income, setIncome] = useState<IncomeLevel>('intermediaire')

  const workTypes = projectType.split(',').map((w) => w.trim()).filter(Boolean)
  const budgetNum = parseBudget(budget)

  const subsidy = budgetNum > 0 ? calculateSubsidy(workTypes, income, budgetNum) : null

  return (
    <div className="bg-eco-50 border border-eco-200 rounded-xl p-6 mb-5">
      <h2 className="font-semibold text-eco-900 mb-4">Estimation de vos aides</h2>

      <div className="mb-4">
        <label className="label text-eco-800" htmlFor="income-select">Votre tranche de revenus</label>
        <select
          id="income-select"
          value={income}
          onChange={(e) => setIncome(e.target.value as IncomeLevel)}
          className="input-field mt-1 bg-white"
        >
          <option value="modeste">Très modestes / Modestes</option>
          <option value="intermediaire">Intermédiaires</option>
          <option value="superieur">Supérieurs</option>
        </select>
      </div>

      {subsidy ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-sm text-eco-800">MaPrimeRénov&apos;</span>
            </div>
            <span className="text-sm font-bold text-eco-700">{subsidy.maprimerenov.toLocaleString('fr-FR')}€</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-sm text-eco-800">CEE (Prime Énergie)</span>
            </div>
            <span className="text-sm font-bold text-eco-700">{subsidy.cee.toLocaleString('fr-FR')}€</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-500" />
              <span className="text-sm text-eco-800">TVA réduite 5,5%</span>
            </div>
            <span className="text-sm font-bold text-eco-700">{subsidy.tva.toLocaleString('fr-FR')}€</span>
          </div>
          <div className="pt-3 border-t border-eco-200 flex items-center justify-between">
            <span className="text-sm font-bold text-eco-900">Total estimé</span>
            <span className="text-lg font-bold text-eco-700">≈ {subsidy.total.toLocaleString('fr-FR')}€</span>
          </div>
        </div>
      ) : (
        <p className="text-sm text-eco-700">Budget non renseigné. Complétez votre demande de devis.</p>
      )}

      <p className="text-xs text-eco-600 mt-3">
        Estimation indicative selon votre tranche de revenus. Le montant exact sera calculé par votre artisan.
      </p>
    </div>
  )
}
