'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Loader2 } from 'lucide-react';
import { signup } from '@/app/actions/auth';

type UserType = 'particulier' | 'pro' | null;

export default function SignupForm() {
  const [userType, setUserType] = useState<UserType>(null);
  const [step, setStep] = useState<'type' | 'form' | 'success'>('type');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await signup(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else if (result?.success) {
      setStep('success');
    }
  }

  if (step === 'success') {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-eco-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-eco-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Compte créé !</h2>
        <p className="text-slate-500 text-sm">
          Un email de confirmation vous a été envoyé. Cliquez sur le lien pour activer votre compte.
        </p>
        <Link href="/connexion" className="mt-6 inline-flex items-center gap-2 btn-primary">
          Se connecter
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  if (step === 'type') {
    return (
      <div>
        <h1 className="text-2xl font-bold text-slate-900 text-center mb-2">Créer un compte</h1>
        <p className="text-slate-500 text-sm text-center mb-8">Choisissez le type de compte qui vous correspond</p>

        <div className="grid sm:grid-cols-2 gap-5">
          <button
            onClick={() => { setUserType('particulier'); setStep('form'); }}
            className="group bg-white rounded-2xl border-2 border-slate-200 hover:border-primary-500 p-6 text-left transition-all hover:shadow-md"
          >
            <div className="text-4xl mb-4">🏠</div>
            <h2 className="font-bold text-slate-900 text-lg mb-2">Je suis particulier</h2>
            <p className="text-sm text-slate-500 mb-4">Je veux rénover mon logement et obtenir des aides</p>
            <ul className="space-y-2 text-sm">
              {['Devis gratuits sous 24h', 'Artisans RGE certifiés', "Aide montage dossier MPR'", 'Suivi de mon projet'].map((item) => (
                <li key={item} className="flex items-center gap-2 text-slate-600">
                  <CheckCircle className="w-3.5 h-3.5 text-eco-500 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-primary-700 group-hover:gap-3 transition-all">
              Créer mon compte gratuit <ArrowRight className="w-4 h-4" />
            </div>
          </button>

          <button
            onClick={() => { setUserType('pro'); setStep('form'); }}
            className="group bg-white rounded-2xl border-2 border-slate-200 hover:border-accent-500 p-6 text-left transition-all hover:shadow-md"
          >
            <div className="text-4xl mb-4">🔧</div>
            <h2 className="font-bold text-slate-900 text-lg mb-2">Je suis artisan RGE</h2>
            <p className="text-sm text-slate-500 mb-4">Je veux développer mon activité avec des leads qualifiés</p>
            <ul className="space-y-2 text-sm">
              {['Leads qualifiés géolocalisés', 'Profil optimisé SEO', 'Gestion des devis en ligne', 'Analytics de performance'].map((item) => (
                <li key={item} className="flex items-center gap-2 text-slate-600">
                  <CheckCircle className="w-3.5 h-3.5 text-accent-500 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-accent-700 group-hover:gap-3 transition-all">
              Démarrer 30 jours offerts <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
      <button
        onClick={() => setStep('type')}
        className="text-sm text-slate-500 hover:text-slate-700 mb-6 flex items-center gap-1"
      >
        ← Retour
      </button>

      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">{userType === 'particulier' ? '🏠' : '🔧'}</span>
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            {userType === 'particulier' ? 'Compte Particulier' : 'Compte Professionnel'}
          </h1>
          <p className="text-sm text-slate-500">
            {userType === 'particulier' ? '100% gratuit, sans engagement' : '30 jours offerts, sans carte bancaire'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="hidden" name="userType" value={userType ?? ''} />

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Prénom</label>
            <input name="firstName" type="text" placeholder="Jean" className="input-field" required />
          </div>
          <div>
            <label className="label">Nom</label>
            <input name="lastName" type="text" placeholder="Dupont" className="input-field" required />
          </div>
        </div>

        <div>
          <label className="label">Email</label>
          <input name="email" type="email" placeholder="jean.dupont@email.fr" className="input-field" required />
        </div>

        {userType === 'pro' && (
          <>
            <div>
              <label className="label">Nom de l&apos;entreprise</label>
              <input name="company" type="text" placeholder="Mon Entreprise SARL" className="input-field" required />
            </div>
            <div>
              <label className="label">SIRET</label>
              <input name="siret" type="text" placeholder="123 456 789 00012" className="input-field" required />
            </div>
          </>
        )}

        <div>
          <label className="label">Mot de passe</label>
          <input name="password" type="password" placeholder="8 caractères minimum" className="input-field" required minLength={8} />
        </div>

        <div className="flex items-start gap-2">
          <input type="checkbox" id="cgu" required className="mt-0.5 rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
          <label htmlFor="cgu" className="text-xs text-slate-500 cursor-pointer">
            J&apos;accepte les{' '}
            <Link href="/cgv" className="text-primary-600 hover:underline">CGU</Link>
            {' '}et la{' '}
            <Link href="/confidentialite" className="text-primary-600 hover:underline">politique de confidentialité</Link>
          </label>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full py-3 disabled:opacity-60">
          {loading ? (
            <><Loader2 className="w-4 h-4 animate-spin" />Création du compte...</>
          ) : (
            <>Créer mon compte <ArrowRight className="w-4 h-4" /></>
          )}
        </button>
      </form>
    </div>
  );
}
