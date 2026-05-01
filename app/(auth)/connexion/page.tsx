import type { Metadata } from 'next'
import Link from 'next/link'
import { Zap, ArrowRight } from 'lucide-react'
import { login } from '@/app/actions/auth'
import GoogleSignInButton from '@/components/auth/GoogleSignInButton'

export const metadata: Metadata = {
  title: 'Connexion — RENOMAG',
}

export default function ConnexionPage({
  searchParams,
}: {
  searchParams: { error?: string; message?: string }
}) {
  const error = searchParams.error
  const message = searchParams.message

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Nav */}
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary-800">
            <Zap className="w-3.5 h-3.5 text-accent-400" />
          </div>
          <span className="font-display font-bold text-lg text-slate-900">
            RENO<span className="text-primary-700">MAG</span>
          </span>
        </Link>
        <Link href="/inscription" className="text-sm text-slate-500 hover:text-slate-700">
          Pas encore de compte ?{' '}
          <span className="text-primary-700 font-medium">S'inscrire</span>
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Bon retour !</h1>
            <p className="text-slate-500 text-sm mb-8">
              Connectez-vous à votre espace RENOMAG
            </p>

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

            {/* Social */}
            <div className="space-y-3 mb-6">
              <GoogleSignInButton mode="login" />
            </div>

            {/* Divider */}
            <div className="relative flex items-center mb-6">
              <div className="flex-1 border-t border-slate-200" />
              <span className="mx-4 text-xs text-slate-400">ou par email</span>
              <div className="flex-1 border-t border-slate-200" />
            </div>

            {/* Form */}
            <form action={login} className="space-y-4">
              <div>
                <label className="label" htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="jean.dupont@email.fr"
                  className="input-field"
                  autoComplete="email"
                  required
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="label mb-0" htmlFor="password">Mot de passe</label>
                  <Link
                    href="/mot-de-passe-oublie"
                    className="text-xs text-primary-600 hover:text-primary-800"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="input-field"
                  autoComplete="current-password"
                  required
                  minLength={6}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remember"
                  name="remember"
                  className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="remember" className="text-sm text-slate-600 cursor-pointer">
                  Se souvenir de moi
                </label>
              </div>

              <button type="submit" className="btn-primary w-full py-3">
                Se connecter
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-400">
              Pas encore de compte ?{' '}
              <Link href="/inscription" className="text-primary-700 font-medium hover:underline">
                Créer un compte gratuit
              </Link>
            </p>
          </div>

          {/* Space switcher */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Link
              href="/connexion?type=particulier"
              className="flex flex-col items-center gap-1 p-4 bg-white rounded-xl border border-primary-200 text-center hover:shadow-sm transition-shadow"
            >
              <span className="text-2xl">🏠</span>
              <span className="text-xs font-medium text-slate-700">Espace Particulier</span>
            </Link>
            <Link
              href="/connexion?type=pro"
              className="flex flex-col items-center gap-1 p-4 bg-white rounded-xl border border-slate-200 text-center hover:shadow-sm transition-shadow"
            >
              <span className="text-2xl">🔧</span>
              <span className="text-xs font-medium text-slate-700">Espace Professionnel</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
