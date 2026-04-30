import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import DashboardSidebar from '@/components/layout/DashboardSidebar'
import {
  LayoutDashboard,
  Users,
  BarChart3,
  UserCircle,
  CreditCard,
  MessageSquare,
  Settings,
  LogOut,
} from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Tableau de bord', href: '/espace-pro', icon: LayoutDashboard },
  { label: 'Leads', href: '/espace-pro/leads', icon: Users, badge: 0 },
  { label: 'Analytics', href: '/espace-pro/analytics', icon: BarChart3 },
  { label: 'Mon profil', href: '/espace-pro/profil', icon: UserCircle },
  { label: 'Messages', href: '/espace-pro/messages', icon: MessageSquare, badge: 0 },
  { label: 'Abonnement', href: '/espace-pro/abonnement', icon: CreditCard },
  { label: 'Paramètres', href: '/espace-pro/parametres', icon: Settings },
]

const FOOTER_ITEMS = [
  { label: 'Déconnexion', icon: LogOut, action: 'logout' as const },
]

export default async function EspaceProLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/connexion')
  }

  let dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: { artisan: true, profile: true },
  })

  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        id: user.id,
        email: user.email!,
        role: 'USER',
      },
      include: { artisan: true, profile: true },
    })
  }

  if (dbUser.role !== 'ARTISAN') {
    redirect('/espace-proprietaire')
  }

  const displayName = dbUser.artisan?.name || dbUser.profile?.firstName || user.email?.split('@')[0] || 'Artisan'
  const initials = displayName.substring(0, 2).toUpperCase()

  return (
    <div className="flex min-h-screen bg-slate-50">
      <DashboardSidebar
        navItems={NAV_ITEMS}
        footerItems={FOOTER_ITEMS}
        title="Espace Professionnel"
        userInitials={initials}
        userName={displayName}
        userRole={dbUser.artisan?.name ? 'Artisan RGE' : 'Abonnement Pro'}
      />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
