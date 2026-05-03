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
  Bell,
  FileText,
} from 'lucide-react'

interface EspaceProLayoutClientProps {
  children: React.ReactNode
  userName?: string
  userInitials?: string
  userRole?: string
  unreadMessages?: number
  unreadNotifications?: number
  newLeads?: number
}

export default function EspaceProLayoutClient({
  children,
  userName = 'Artisan',
  userInitials = 'AR',
  userRole = 'Abonnement Pro',
  unreadMessages = 0,
  unreadNotifications = 0,
  newLeads = 0,
}: EspaceProLayoutClientProps) {
  const navItems = [
    { label: 'Tableau de bord', href: '/espace-pro', icon: LayoutDashboard },
    { label: 'Leads', href: '/espace-pro/leads', icon: Users, badge: newLeads > 0 ? newLeads : undefined },
    { label: 'Devis', href: '/espace-pro/devis', icon: FileText },
    { label: 'Analytics', href: '/espace-pro/analytics', icon: BarChart3 },
    { label: 'Mon profil', href: '/espace-pro/profil', icon: UserCircle },
    { label: 'Messages', href: '/espace-pro/messages', icon: MessageSquare, badge: unreadMessages > 0 ? unreadMessages : undefined },
    { label: 'Notifications', href: '/espace-pro/notifications', icon: Bell, badge: unreadNotifications > 0 ? unreadNotifications : undefined },
    { label: 'Abonnement', href: '/espace-pro/abonnement', icon: CreditCard },
    { label: 'Paramètres', href: '/espace-pro/parametres', icon: Settings },
  ]

  const footerItems: { label: string; href: string; icon: typeof LayoutDashboard; badge?: number }[] = []

  return (
    <div className="flex min-h-screen bg-slate-50">
      <DashboardSidebar
        navItems={navItems}
        footerItems={footerItems}
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
