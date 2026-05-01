'use server';

import { createClient, createAdminClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Erreur de connexion' };

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role === 'ADMIN') redirect('/admin');
  if (profile?.role === 'ARTISAN') redirect('/espace-pro');
  redirect('/espace-proprietaire');
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const userType = formData.get('userType') as string;
  const company = formData.get('company') as string | null;
  const siret = formData.get('siret') as string | null;

  const role = userType === 'pro' ? 'ARTISAN' : 'USER';

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
        user_type: userType,
        company_name: company,
        siret,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://renomag.vercel.app'}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  // Update profile role and name via admin client (bypasses RLS)
  // The trigger already created the profile row with role='USER'
  if (data.user) {
    const admin = await createAdminClient();
    await admin
      .from('profiles')
      .update({ role, first_name: firstName, last_name: lastName })
      .eq('id', data.user.id);
  }

  return { success: true };
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/connexion');
}
