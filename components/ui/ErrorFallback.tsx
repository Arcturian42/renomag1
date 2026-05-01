'use client'

import { useEffect } from 'react'
import { AlertTriangle, RotateCcw } from 'lucide-react'

interface ErrorFallbackProps {
  error: Error & { digest?: string }
  reset: () => void
  title?: string
  description?: string
}

export default function ErrorFallback({
  error,
  reset,
  title = 'Une erreur est survenue',
  description = 'Nous avons rencontré un problème en chargeant cette page.',
}: ErrorFallbackProps) {
  useEffect(() => {
    console.error('Error boundary caught:', error)
  }, [error])

  return (
    <div className="min-h-[400px] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-50 mx-auto">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-900">{title}</h2>
          <p className="text-slate-500">{description}</p>
          {error.digest && (
            <p className="text-xs text-slate-400 font-mono">Ref: {error.digest}</p>
          )}
        </div>

        <button
          onClick={reset}
          className="btn-primary inline-flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Réessayer
        </button>
      </div>
    </div>
  )
}
