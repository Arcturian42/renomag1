'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function ReinitialiserMotDePassePage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)
  const [hasSession, setHasSession] = useState(false)

  useEffect(() => {
    async function checkSession() {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (session) setHasSession(true)
    }
    checkSession()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password.trim() || password.length < 8) {
      setResult({ success: false, message: 'Le mot de passe doit contenir au moins 8 caractères.' })
      return
    }
    if (password !== confirmPassword) {
      setResult({ success: false, message: 'Les mots de passe ne correspondent pas.' })
      return
    }

    setIsLoading(true)
    setResult(null)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({ password })

      if (error) {
        setResult({ success: false, message: error.message })
      } else {
        setResult({ success: true, message: 'Votre mot de passe a été mis à jour avec succès.' })
        setPassword('')
        setConfirmPassword('')
      }
    } catch (err) {
      setResult({ success: false, message: 'Une erreur est survenue. Veuillez réessayer.' })
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-6">
              <span className="text-2xl font-black text-primary-800">
                RENO<span className="text-accent-500">MAG</span>
              </span>
            </Link>
            <h1 className="text-2xl font-bold text-slate-900">Réinitialiser le mot de passe</h1>
            <p className="text-slate-500 mt-2 text-sm">
              Choisissez un nouveau mot de passe sécurisé.
            </p>
          </div>

          {result && (
            <div
              className={`mb-6 p-3 rounded-lg text-sm ${
                result.success
                  ? 'bg-eco-50 text-eco-800 border border-eco-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {result.message}
            </div>
          )}

          {!hasSession && !result?.success && (
            <div className="mb-6 p-3 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-sm">
              Le lien de réinitialisation est invalide ou a expiré. Veuillez faire une nouvelle demande.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label" htmlFor="password">
                Nouveau mot de passe
              </label>
              <input
                id="password"
                type="password"
                className="input-field"
                placeholder="••••••••"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>

            <div>
              <label className="label" htmlFor="confirmPassword">
                Confirmer le mot de passe
              </label>
              <input
                id="confirmPassword"
                type="password"
                className="input-field"
                placeholder="••••••••"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !hasSession}
              className="btn-primary w-full py-3 disabled:opacity-50"
            >
              {isLoading ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/connexion"
              className="text-sm text-primary-600 hover:text-primary-800 font-medium"
            >
              ← Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
