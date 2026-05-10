'use client'

import { useState } from 'react'
import { CreditCard } from 'lucide-react'
import { updateArtisanBillingInfo } from '@/app/actions/artisan'

interface BillingFormProps {
  companyName: string
  siret: string
  billingAddress: string
  tvaNumber: string
}

export default function BillingForm({
  companyName,
  siret,
  billingAddress,
  tvaNumber,
}: BillingFormProps) {
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    try {
      await updateArtisanBillingInfo(formData)
    } catch (error) {
      // Error handling is done via redirect with error param
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex items-center gap-3 mb-5">
        <CreditCard className="w-5 h-5 text-primary-600" />
        <h2 className="font-semibold text-slate-900">Facturation</h2>
      </div>
      <form action={handleSubmit}>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label" htmlFor="raison-sociale">
              Raison sociale
            </label>
            <input
              id="raison-sociale"
              type="text"
              className="input-field bg-slate-50"
              value={companyName}
              disabled
              title="Modifiez la raison sociale depuis la page Profil"
            />
            <p className="text-xs text-slate-400 mt-1">
              Modifiable depuis la page Profil
            </p>
          </div>
          <div>
            <label className="label" htmlFor="siret">
              SIRET
            </label>
            <input
              id="siret"
              name="siret"
              type="text"
              className="input-field"
              defaultValue={siret}
              placeholder="123 456 789 00012"
              disabled={loading}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="label" htmlFor="billingAddress">
              Adresse de facturation
            </label>
            <input
              id="billingAddress"
              name="billingAddress"
              type="text"
              className="input-field"
              defaultValue={billingAddress}
              placeholder="12 rue de la République, 75011 Paris"
              disabled={loading}
            />
          </div>
          <div>
            <label className="label" htmlFor="tvaNumber">
              Numéro de TVA intra.
            </label>
            <input
              id="tvaNumber"
              name="tvaNumber"
              type="text"
              className="input-field"
              defaultValue={tvaNumber}
              placeholder="FR12 123456789"
              disabled={loading}
            />
          </div>
        </div>
        <div className="mt-5 flex justify-end">
          <button
            type="submit"
            className="btn-primary px-5 py-2.5"
            disabled={loading}
          >
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </div>
  )
}
