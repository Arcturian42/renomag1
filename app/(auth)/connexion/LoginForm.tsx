'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Loader2 } from 'lucide-react';
import { login } from '@/app/actions/auth';

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await login(formData);

    if (result?.error) {
      setError(result.error === 'Invalid login credentials'
        ? 'Email ou mot de passe incorrect.'
        : result.error);
      setLoading(false);
    }
    // redirect() dans la server action gère la navigation
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <div>
        <label className="label">Email</label>
        <input
          name="email"
          type="email"
          placeholder="jean.dupont@email.fr"
          className="input-field"
          autoComplete="email"
          required
        />
      </div>
      <div>
        <label className="label">Mot de passe</label>
        <input
          name="password"
          type="password"
          placeholder="••••••••"
          className="input-field"
          autoComplete="current-password"
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full py-3 disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Connexion...
          </>
        ) : (
          <>
            Se connecter
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
}
