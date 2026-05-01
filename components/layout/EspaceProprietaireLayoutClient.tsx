'use client'

import DashboardSidebar from '@/components/layout/DashboardSidebar'
import SignOutButton from '@/components/layout/SignOutButton'
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

const FOOTER_ITEMS: { label: string; href: string; icon: typeof LayoutDashboard; badge?: number }[] = []

interface EspaceProprietaireLayoutClientProps {
  children: React.ReactNode
  userName?: string
  userInitials?: string
  userRole?: string
}

export default function EspaceProprietaireLayoutClient({
  children,
  userName = 'Particulier',
  userInitials = 'PA',
  userRole = 'Particulier',
}: EspaceProprietaireLayoutClientProps) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <DashboardSidebar
        navItems={NAV_ITEMS}
        footerItems={FOOTER_ITEMS}
        footerExtra={<SignOutButton />}
        title="Espace Particulier"
        userInitials={userInitials}
        userName={userName}
        userRole={userRole}
      />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
