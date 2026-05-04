'use client'

import { useState } from 'react'
import { CheckCircle, AlertCircle, Check, X } from 'lucide-react'
import { verifyArtisan, unverifyArtisan } from '@/app/actions/admin'

type ArtisanVerifyButtonProps = {
  userId: string
  initialVerified: boolean
}

export function ArtisanVerifyButton({ userId, initialVerified }: ArtisanVerifyButtonProps) {
  const [verified, setVerified] = useState(initialVerified)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleVerify = async (formData: FormData) => {
    // Optimistic update - change UI immediately
    setVerified(true)
    setIsSubmitting(true)

    try {
      await verifyArtisan(formData)
    } catch (error) {
      // Rollback on error
      setVerified(false)
      console.error('Failed to verify:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUnverify = async (formData: FormData) => {
    // Optimistic update - change UI immediately
    setVerified(false)
    setIsSubmitting(true)

    try {
      await unverifyArtisan(formData)
    } catch (error) {
      // Rollback on error
      setVerified(true)
      console.error('Failed to unverify:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      {/* Status Badge */}
      {verified ? (
        <span className="flex items-center gap-1 text-xs text-eco-700 bg-eco-50 rounded-full px-2 py-0.5 w-fit">
          <CheckCircle className="w-3 h-3" />
          Vérifié
        </span>
      ) : (
        <span className="flex items-center gap-1 text-xs text-amber-700 bg-amber-50 rounded-full px-2 py-0.5 w-fit">
          <AlertCircle className="w-3 h-3" />
          En attente
        </span>
      )}

      {/* Action Button */}
      {verified ? (
        <form action={handleUnverify}>
          <input type="hidden" name="userId" value={userId} />
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors bg-red-50 text-red-700 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-3 h-3" />
            Retirer
          </button>
        </form>
      ) : (
        <form action={handleVerify}>
          <input type="hidden" name="userId" value={userId} />
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors bg-eco-50 text-eco-700 hover:bg-eco-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Check className="w-3 h-3" />
            Vérifier
          </button>
        </form>
      )}
    </div>
  )
}
