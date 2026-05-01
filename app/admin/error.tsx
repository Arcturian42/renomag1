'use client'

import ErrorFallback from '@/components/ui/ErrorFallback'

export default function AdminError({
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
      title="Erreur de l'espace admin"
      description="Une erreur est survenue dans l'interface d'administration."
    />
  )
}
