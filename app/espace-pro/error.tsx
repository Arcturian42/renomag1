'use client'

import ErrorFallback from '@/components/ui/ErrorFallback'

export default function EspaceProError({
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
      title="Erreur de l'espace pro"
      description="Une erreur est survenue dans votre espace professionnel."
    />
  )
}
