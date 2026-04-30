import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardSidebar from '@/components/layout/DashboardSidebar'
import LogoutButton from '@/components/layout/LogoutButton'
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  MessageSquare,
  Settings,
  Bell,
} from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Tableau de bord', href: '/espace-proprietaire', icon: LayoutDashboard },
  { label: 'Mon projet', href: '/espace-proprietaire/mon-projet', icon: ClipboardList },
  { label: 'Artisans matchés', href: '/espace-proprietaire/artisans', icon: Users, badge: 3 },
  { label: 'Messages', href: '/espace-proprietaire/messages', icon: MessageSquare, badge: 2 },
  { label: 'Notifications', href: '/espace-proprietaire/notifications', icon: Bell },
  { label: 'Mon compte', href: '/espace-proprietaire/compte', icon: Settings },
]

export default async function EspaceProprietaireLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/connexion')

  const { data: profile } = await supabase
    .from('profiles')
    .select('first_name, last_name')
    .eq('id', user.id)
    .single()

  const fullName = `${profile?.first_name ?? ''} ${profile?.last_name ?? ''}`.trim()
  const displayName = fullName || (user.email ?? 'Mon espace')
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div className="flex min-h-screen bg-slate-50">
      <DashboardSidebar
        navItems={NAV_ITEMS}
        footerItems={[]}
        title="Espace Particulier"
        userInitials={initials}
        userName={displayName}
        userRole="Particulier"
        logoutButton={<LogoutButton />}
      />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
