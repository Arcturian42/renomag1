import type { Metadata } from 'next';
import Link from 'next/link';
import { Zap } from 'lucide-react';
import SignupForm from './SignupForm';

export const metadata: Metadata = { title: 'Inscription — RENOMAG' };

export default function InscriptionPage() {
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
        <Link href="/connexion" className="text-sm text-slate-500 hover:text-slate-700">
          Déjà un compte ?{' '}
          <span className="text-primary-700 font-medium">Se connecter</span>
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-xl">
          <SignupForm />
        </div>
      </div>
    </div>
  );
}
