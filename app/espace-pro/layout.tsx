import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import DashboardSidebar from '@/components/layout/DashboardSidebar';
import LogoutButton from '@/components/layout/LogoutButton';
import {
  LayoutDashboard, Users, BarChart3, UserCircle,
  CreditCard, MessageSquare, Settings,
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Tableau de bord', href: '/espace-pro', icon: LayoutDashboard },
  { label: 'Leads', href: '/espace-pro/leads', icon: Users },
  { label: 'Analytics', href: '/espace-pro/analytics', icon: BarChart3 },
  { label: 'Mon profil', href: '/espace-pro/profil', icon: UserCircle },
  { label: 'Messages', href: '/espace-pro/messages', icon: MessageSquare },
  { label: 'Abonnement', href: '/espace-pro/abonnement', icon: CreditCard },
  { label: 'Paramètres', href: '/espace-pro/parametres', icon: Settings },
];

export default async function EspaceProLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/connexion');

  const { data: profile } = await supabase.from('profiles').select('first_name, last_name').eq('id', user.id).single();
  const { data: artisan } = await supabase.from('artisan_companies').select('name').eq('user_id', user.id).single();

  const fullName = `${profile?.first_name ?? ''} ${profile?.last_name ?? ''}`.trim()
  const displayName = artisan?.name ?? fullName ?? (user.email ?? 'Mon espace');
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="flex min-h-screen bg-slate-50">
      <DashboardSidebar
        navItems={NAV_ITEMS}
        footerItems={[]}
        title="Espace Professionnel"
        userInitials={initials}
        userName={displayName}
        userRole="Artisan RGE"
        logoutButton={<LogoutButton />}
      />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
