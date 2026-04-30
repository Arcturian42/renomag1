import type { Metadata } from 'next'
import Link from 'next/link'
import { Zap, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Connexion — RENOMAG',
}

export default function ConnexionPage() {
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

            {/* Social */}
            <div className="space-y-3 mb-6">
              <button className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continuer avec Google
              </button>
            </div>

            {/* Divider */}
            <div className="relative flex items-center mb-6">
              <div className="flex-1 border-t border-slate-200" />
              <span className="mx-4 text-xs text-slate-400">ou par email</span>
              <div className="flex-1 border-t border-slate-200" />
            </div>

            {/* Form */}
            <form className="space-y-4">
              <div>
                <label className="label">Email</label>
                <input
                  type="email"
                  placeholder="jean.dupont@email.fr"
                  className="input-field"
                  autoComplete="email"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="label mb-0">Mot de passe</label>
                  <Link
                    href="/mot-de-passe-oublie"
                    className="text-xs text-primary-600 hover:text-primary-800"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="input-field"
                  autoComplete="current-password"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remember"
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
