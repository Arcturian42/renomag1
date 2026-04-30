import type { Metadata } from 'next'
import Link from 'next/link'
import { resetPassword } from '@/app/actions/auth'

export const metadata: Metadata = {
  title: 'Mot de passe oublié — RENOMAG',
}

export default function MotDePasseOubliePage({
  searchParams,
}: {
  searchParams: { error?: string; message?: string }
}) {
  const error = searchParams.error
  const message = searchParams.message

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-6">
              <span className="text-2xl font-black text-primary-800">RENO<span className="text-accent-500">MAG</span></span>
            </Link>
            <h1 className="text-2xl font-bold text-slate-900">Mot de passe oublié</h1>
            <p className="text-slate-500 mt-2 text-sm">
              Entrez votre email pour recevoir un lien de réinitialisation.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
              {error}
            </div>
          )}
          {message && (
            <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-sm text-green-700">
              {message}
            </div>
          )}

          <form action={resetPassword} className="space-y-5">
            <div>
              <label className="label" htmlFor="email">Adresse email</label>
              <input
                id="email"
                name="email"
                type="email"
                className="input-field"
                placeholder="vous@exemple.fr"
                autoComplete="email"
                required
              />
            </div>

            <button type="submit" className="btn-primary w-full py-3">
              Envoyer le lien de réinitialisation
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/connexion" className="text-sm text-primary-600 hover:text-primary-800 font-medium">
              ← Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
