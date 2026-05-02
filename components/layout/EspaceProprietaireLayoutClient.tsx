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

interface EspaceProprietaireLayoutClientProps {
  children: React.ReactNode
  userName?: string
  userInitials?: string
  userRole?: string
  unreadMessages?: number
  unreadNotifications?: number
  matchedArtisans?: number
}

export default function EspaceProprietaireLayoutClient({
  children,
  userName = 'Particulier',
  userInitials = 'PA',
  userRole = 'Particulier',
  unreadMessages = 0,
  unreadNotifications = 0,
  matchedArtisans = 0,
}: EspaceProprietaireLayoutClientProps) {
  const navItems = [
    { label: 'Tableau de bord', href: '/espace-proprietaire', icon: LayoutDashboard },
    { label: 'Mon projet', href: '/espace-proprietaire/mon-projet', icon: ClipboardList },
    { label: 'Artisans matchés', href: '/espace-proprietaire/artisans', icon: Users, badge: matchedArtisans > 0 ? matchedArtisans : undefined },
    { label: 'Messages', href: '/espace-proprietaire/messages', icon: MessageSquare, badge: unreadMessages > 0 ? unreadMessages : undefined },
    { label: 'Notifications', href: '/espace-proprietaire/notifications', icon: Bell, badge: unreadNotifications > 0 ? unreadNotifications : undefined },
    { label: 'Mon compte', href: '/espace-proprietaire/compte', icon: Settings },
  ]

  const footerItems: { label: string; href: string; icon: typeof LayoutDashboard; badge?: number }[] = []

  return (
    <div className="flex min-h-screen bg-slate-50">
      <DashboardSidebar
        navItems={navItems}
        footerItems={footerItems}
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
