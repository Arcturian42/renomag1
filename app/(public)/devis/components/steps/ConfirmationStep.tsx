'use client'

import Link from 'next/link'
import { CheckCircle, ArrowRight, Calculator } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

interface ConfirmationStepProps {
  estimatedSubsidy: number | null
}

export default function ConfirmationStep({ estimatedSubsidy }: ConfirmationStepProps) {
  return (
    <div className="text-center py-6">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-eco-100 mx-auto mb-5">
        <CheckCircle className="w-8 h-8 text-eco-600" />
      </div>
      <h2 className="text-xl font-bold text-slate-900 mb-3">
        Votre demande a été envoyée !
      </h2>
      <p className="text-slate-500 mb-6">
        Vous recevrez jusqu&apos;à 3 devis d&apos;artisans RGE certifiés dans votre zone sous
        <strong className="text-slate-900"> 24 heures</strong>.
      </p>
      {estimatedSubsidy && (
        <div className="bg-eco-50 border border-eco-200 rounded-xl p-4 mb-6 text-left">
          <p className="text-sm font-semibold text-eco-800 mb-1">
            <Calculator className="w-4 h-4 inline mr-1" />
            Estimation de vos aides
          </p>
          <p className="text-2xl font-bold text-eco-700">{formatPrice(estimatedSubsidy)}</p>
          <p className="text-xs text-eco-600 mt-1">
            Estimation indicative — votre artisan calculera le montant exact
          </p>
        </div>
      )}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/annuaire" className="btn-secondary">
          Parcourir l&apos;annuaire
        </Link>
        <Link href="/espace-proprietaire" className="btn-primary">
          Accéder à mon espace
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
