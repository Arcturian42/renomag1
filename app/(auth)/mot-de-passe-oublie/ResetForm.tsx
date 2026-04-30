'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function ResetForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/espace-pro/parametres`,
    });

    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
    setLoading(false);
  }

  if (sent) {
    return (
      <div className="text-center py-4">
        <p className="text-eco-700 font-medium mb-1">Email envoyé !</p>
        <p className="text-slate-500 text-sm">Vérifiez votre boîte mail et cliquez sur le lien de réinitialisation.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">{error}</div>
      )}
      <div>
        <label className="label" htmlFor="email">Adresse email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
          placeholder="vous@exemple.fr"
          autoComplete="email"
          required
        />
      </div>
      <button type="submit" disabled={loading} className="btn-primary w-full py-3 disabled:opacity-60">
        {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Envoi...</> : 'Envoyer le lien de réinitialisation'}
      </button>
    </form>
  );
}
