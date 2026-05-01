'use client'

import ErrorFallback from '@/components/ui/ErrorFallback'

export default function EspaceProprietaireError({
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
      title="Erreur de l'espace particulier"
      description="Une erreur est survenue dans votre espace personnel."
    />
  )
}
