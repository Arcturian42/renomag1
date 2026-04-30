'use client'

import ErrorFallback from '@/components/ui/ErrorFallback'

export default function BlogError({
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
      title="Impossible de charger le blog"
      description="Nous n'avons pas pu récupérer les articles. Veuillez réessayer."
    />
  )
}
