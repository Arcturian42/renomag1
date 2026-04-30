import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import LeadsClient from './LeadsClient';

export default async function LeadsPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/connexion');

  const { data: artisan } = await supabase
    .from('artisan_companies')
    .select('id, name')
    .eq('user_id', user.id)
    .single();

  const leads = artisan
    ? (await supabase
        .from('leads')
        .select('*')
        .eq('artisan_id', artisan.id)
        .order('created_at', { ascending: false })).data ?? []
    : [];

  return <LeadsClient leads={leads} />;
}
