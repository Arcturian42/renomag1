import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import DashboardSidebar from '@/components/layout/DashboardSidebar'
import {
  LayoutDashboard,
  Users,
  FileText,
  BarChart3,
  Bot,
  Settings,
  LogOut,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react'

const NAV_ITEMS = [
  { label: "Vue d'ensemble", href: '/admin', icon: LayoutDashboard },
  { label: 'Artisans', href: '/admin/artisans', icon: ShieldCheck, badge: 0 },
  { label: 'Leads', href: '/admin/leads', icon: TrendingUp },
  { label: 'Utilisateurs', href: '/admin/utilisateurs', icon: Users },
  { label: 'Contenu', href: '/admin/contenu', icon: FileText },
  { label: 'Agents Hermes', href: '/admin/agents', icon: Bot, badge: 0 },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { label: 'Paramètres', href: '/admin/parametres', icon: Settings },
]

const FOOTER_ITEMS = [
  { label: 'Déconnexion', icon: LogOut, action: 'logout' as const },
]

export default async function AdminLayout({
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

  if (dbUser.role !== 'ADMIN') {
    redirect('/')
  }

  const firstName = dbUser.profile?.firstName || ''
  const lastName = dbUser.profile?.lastName || ''
  const displayName = `${firstName} ${lastName}`.trim() || user.email?.split('@')[0] || 'Administrateur'
  const initials = (firstName[0] || displayName[0] || 'A').toUpperCase()

  return (
    <div className="flex min-h-screen bg-slate-950">
      <DashboardSidebar
        navItems={NAV_ITEMS}
        footerItems={FOOTER_ITEMS}
        title="Admin RENOMAG"
        userInitials={initials}
        userName={displayName}
        userRole="Super Admin"
      />
      <main className="flex-1 bg-slate-50 overflow-auto">{children}</main>
    </div>
  )
}
