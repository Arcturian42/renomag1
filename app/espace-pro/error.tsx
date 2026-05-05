'use client'

import { useEffect } from 'react'
import ErrorFallback from '@/components/ui/ErrorFallback'

export default function EspaceProError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log detailed error information for debugging
    console.error('=== ESPACE PRO ERROR BOUNDARY ===')
    console.error('Error message:', error.message)
    console.error('Error name:', error.name)
    console.error('Error digest:', error.digest)
    console.error('Error stack:', error.stack)
    console.error('Error object:', error)
    console.error('================================')
  }, [error])

  return (
    <ErrorFallback
      error={error}
      reset={reset}
      title="Erreur de l'espace pro"
      description="Une erreur est survenue dans votre espace professionnel."
    />
  )
}
