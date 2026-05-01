'use client'

import DashboardSidebar from '@/components/layout/DashboardSidebar'
import SignOutButton from '@/components/layout/SignOutButton'
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
  { label: 'Vue d\'ensemble', href: '/admin', icon: LayoutDashboard },
  { label: 'Artisans', href: '/admin/artisans', icon: ShieldCheck, badge: 12 },
  { label: 'Leads', href: '/admin/leads', icon: TrendingUp },
  { label: 'Utilisateurs', href: '/admin/utilisateurs', icon: Users },
  { label: 'Contenu', href: '/admin/contenu', icon: FileText },
  { label: 'Agents Hermes', href: '/admin/agents', icon: Bot, badge: 23 },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { label: 'Paramètres', href: '/admin/parametres', icon: Settings },
]

const FOOTER_ITEMS: { label: string; href: string; icon: typeof LayoutDashboard; badge?: number }[] = []

interface AdminLayoutClientProps {
  children: React.ReactNode
  userName?: string
  userInitials?: string
  userRole?: string
}

export default function AdminLayoutClient({
  children,
  userName = 'Administrateur',
  userInitials = 'AD',
  userRole = 'Super Admin',
}: AdminLayoutClientProps) {
  return (
    <div className="flex min-h-screen bg-slate-950">
      <DashboardSidebar
        navItems={NAV_ITEMS}
        footerItems={FOOTER_ITEMS}
        footerExtra={<SignOutButton />}
        title="Admin RENOMAG"
        userInitials={userInitials}
        userName={userName}
        userRole={userRole}
      />
      <main className="flex-1 bg-slate-50 overflow-auto">{children}</main>
    </div>
  )
}
