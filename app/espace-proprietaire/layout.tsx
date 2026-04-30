import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import DashboardSidebar from '@/components/layout/DashboardSidebar'
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  MessageSquare,
  Settings,
  LogOut,
  Bell,
} from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Tableau de bord', href: '/espace-proprietaire', icon: LayoutDashboard },
  { label: 'Mon projet', href: '/espace-proprietaire/mon-projet', icon: ClipboardList },
  { label: 'Artisans matchés', href: '/espace-proprietaire/artisans', icon: Users, badge: 0 },
  { label: 'Messages', href: '/espace-proprietaire/messages', icon: MessageSquare, badge: 0 },
  { label: 'Notifications', href: '/espace-proprietaire/notifications', icon: Bell },
  { label: 'Mon compte', href: '/espace-proprietaire/compte', icon: Settings },
]

const FOOTER_ITEMS = [
  { label: 'Déconnexion', icon: LogOut, action: 'logout' as const },
]

export default async function EspaceProprietaireLayout({
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
    include: { profile: true },
  })

  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        id: user.id,
        email: user.email!,
        role: 'USER',
      },
      include: { profile: true },
    })
  }

  if (dbUser.role === 'ADMIN') {
    redirect('/admin')
  }

  if (dbUser.role === 'ARTISAN') {
    redirect('/espace-pro')
  }

  const firstName = dbUser.profile?.firstName || ''
  const lastName = dbUser.profile?.lastName || ''
  const displayName = `${firstName} ${lastName}`.trim() || user.email?.split('@')[0] || 'Propriétaire'
  const initials = (firstName[0] || displayName[0] || 'U').toUpperCase()

  return (
    <div className="flex min-h-screen bg-slate-50">
      <DashboardSidebar
        navItems={NAV_ITEMS}
        footerItems={FOOTER_ITEMS}
        title="Espace Particulier"
        userInitials={initials}
        userName={displayName}
        userRole="Particulier"
      />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
