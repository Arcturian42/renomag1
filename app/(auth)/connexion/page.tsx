import type { Metadata } from 'next';
import Link from 'next/link';
import { Zap } from 'lucide-react';
import LoginForm from './LoginForm';

export const metadata: Metadata = { title: 'Connexion — RENOMAG' };

export default function ConnexionPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
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
          <span className="text-primary-700 font-medium">S&apos;inscrire</span>
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Bon retour !</h1>
            <p className="text-slate-500 text-sm mb-8">Connectez-vous à votre espace RENOMAG</p>

            <LoginForm />

            <p className="mt-6 text-center text-sm text-slate-400">
              Pas encore de compte ?{' '}
              <Link href="/inscription" className="text-primary-700 font-medium hover:underline">
                Créer un compte gratuit
              </Link>
            </p>
            <p className="mt-2 text-center text-xs text-slate-400">
              <Link href="/mot-de-passe-oublie" className="hover:text-slate-600">
                Mot de passe oublié ?
              </Link>
            </p>
          </div>

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
  );
}
