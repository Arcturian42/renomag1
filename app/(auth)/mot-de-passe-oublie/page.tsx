'use client'

import { useState } from 'react'
import Link from 'next/link'
import { requestPasswordReset } from '@/app/actions/auth'

export default function MotDePasseOubliePage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setIsLoading(true)
    setResult(null)
    const res = await requestPasswordReset(email.trim())
    setIsLoading(false)

    if (res.success) {
      setResult({
        success: true,
        message: 'Si un compte existe avec cet email, vous recevrez un lien de réinitialisation.',
      })
    } else {
      setResult({
        success: false,
        message: res.error ?? 'Une erreur est survenue. Veuillez réessayer.',
      })
    }
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
            <h1 className="text-2xl font-bold text-slate-900">Mot de passe oublié</h1>
            <p className="text-slate-500 mt-2 text-sm">
              Entrez votre email pour recevoir un lien de réinitialisation.
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

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label" htmlFor="email">
                Adresse email
              </label>
              <input
                id="email"
                type="email"
                className="input-field"
                placeholder="vous@exemple.fr"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-3 disabled:opacity-50"
            >
              {isLoading ? 'Envoi en cours...' : 'Envoyer le lien de réinitialisation'}
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
