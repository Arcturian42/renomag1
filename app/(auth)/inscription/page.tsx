import { Suspense } from 'react'
import type { Metadata } from 'next'
import InscriptionForm from './InscriptionForm'

export const metadata: Metadata = {
  title: 'Inscription — RENOMAG',
}

export default function InscriptionPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center">Chargement...</div>}>
      <InscriptionForm />
    </Suspense>
  )
}
