'use client'

import ErrorFallback from '@/components/ui/ErrorFallback'

export default function AnnuaireError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <ErrorFallback
      error={error}
      reset={reset}
      title="Impossible de charger l'annuaire"
      description="Nous n'avons pas pu récupérer la liste des artisans. Veuillez réessayer."
    />
  )
}
