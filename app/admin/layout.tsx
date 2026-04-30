import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardSidebar from '@/components/layout/DashboardSidebar'
import LogoutButton from '@/components/layout/LogoutButton'
import {
  LayoutDashboard,
  Users,
  FileText,
  BarChart3,
  Bot,
  Settings,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react'

const NAV_ITEMS = [
  { label: "Vue d'ensemble", href: '/admin', icon: LayoutDashboard },
  { label: 'Artisans', href: '/admin/artisans', icon: ShieldCheck, badge: 12 },
  { label: 'Leads', href: '/admin/leads', icon: TrendingUp },
  { label: 'Utilisateurs', href: '/admin/utilisateurs', icon: Users },
  { label: 'Contenu', href: '/admin/contenu', icon: FileText },
  { label: 'Agents Hermes', href: '/admin/agents', icon: Bot, badge: 23 },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { label: 'Paramètres', href: '/admin/parametres', icon: Settings },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/connexion')

  const { data: profile } = await supabase
    .from('profiles')
    .select('first_name, last_name, role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'ADMIN') redirect('/')

  const fullName = `${profile?.first_name ?? ''} ${profile?.last_name ?? ''}`.trim()
  const displayName = fullName || (user.email ?? 'Admin')
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div className="flex min-h-screen bg-slate-950">
      <DashboardSidebar
        navItems={NAV_ITEMS}
        footerItems={[]}
        title="Admin RENOMAG"
        userInitials={initials}
        userName={displayName}
        userRole="Super Admin"
        logoutButton={<LogoutButton />}
      />
      <main className="flex-1 bg-slate-50 overflow-auto">{children}</main>
    </div>
  )
}
