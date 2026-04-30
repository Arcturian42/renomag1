'use client'

import DashboardSidebar from '@/components/layout/DashboardSidebar'
import SignOutButton from '@/components/layout/SignOutButton'
import {
  LayoutDashboard,
  Users,
  BarChart3,
  UserCircle,
  CreditCard,
  MessageSquare,
  Settings,
} from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Tableau de bord', href: '/espace-pro', icon: LayoutDashboard },
  { label: 'Leads', href: '/espace-pro/leads', icon: Users, badge: 7 },
  { label: 'Analytics', href: '/espace-pro/analytics', icon: BarChart3 },
  { label: 'Mon profil', href: '/espace-pro/profil', icon: UserCircle },
  { label: 'Messages', href: '/espace-pro/messages', icon: MessageSquare, badge: 3 },
  { label: 'Abonnement', href: '/espace-pro/abonnement', icon: CreditCard },
  { label: 'Paramètres', href: '/espace-pro/parametres', icon: Settings },
]

const FOOTER_ITEMS: { label: string; href: string; icon: typeof LayoutDashboard; badge?: number }[] = []

interface EspaceProLayoutClientProps {
  children: React.ReactNode
  userName?: string
  userInitials?: string
  userRole?: string
}

export default function EspaceProLayoutClient({
  children,
  userName = 'Artisan',
  userInitials = 'AR',
  userRole = 'Abonnement Pro',
}: EspaceProLayoutClientProps) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <DashboardSidebar
        navItems={NAV_ITEMS}
        footerItems={FOOTER_ITEMS}
        footerExtra={<SignOutButton />}
        title="Espace Professionnel"
        userInitials={userInitials}
        userName={userName}
        userRole={userRole}
      />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
