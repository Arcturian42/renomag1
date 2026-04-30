import { createAdminClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
  }

  const adminSupabase = await createAdminClient();

  const [
    { count: leadsTotal },
    { count: leadsNew },
    { count: artisansTotal },
    { count: usersTotal },
  ] = await Promise.all([
    adminSupabase.from('leads').select('*', { count: 'exact', head: true }),
    adminSupabase.from('leads').select('*', { count: 'exact', head: true }).eq('status', 'NEW'),
    adminSupabase.from('artisan_companies').select('*', { count: 'exact', head: true }),
    adminSupabase.from('profiles').select('*', { count: 'exact', head: true }),
  ]);

  return NextResponse.json({
    stats: {
      leadsTotal: leadsTotal ?? 0,
      leadsNew: leadsNew ?? 0,
      artisansTotal: artisansTotal ?? 0,
      usersTotal: usersTotal ?? 0,
    },
  });
}
