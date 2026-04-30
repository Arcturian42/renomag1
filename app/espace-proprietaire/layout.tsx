'use client'

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
  { label: 'Artisans matchés', href: '/espace-proprietaire/artisans', icon: Users, badge: 3 },
  { label: 'Messages', href: '/espace-proprietaire/messages', icon: MessageSquare, badge: 2 },
  { label: 'Notifications', href: '/espace-proprietaire/notifications', icon: Bell },
  { label: 'Mon compte', href: '/espace-proprietaire/compte', icon: Settings },
]

const FOOTER_ITEMS = [
  { label: 'Déconnexion', href: '/connexion', icon: LogOut },
]

export default function EspaceProprietaireLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <DashboardSidebar
        navItems={NAV_ITEMS}
        footerItems={FOOTER_ITEMS}
        title="Espace Particulier"
        userInitials="JD"
        userName="Jean Dupont"
        userRole="Particulier"
      />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
