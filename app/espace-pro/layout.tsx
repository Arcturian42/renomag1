'use client'

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
  { label: 'Leads', href: '/espace-pro/leads', icon: Users, badge: 7 },
  { label: 'Analytics', href: '/espace-pro/analytics', icon: BarChart3 },
  { label: 'Mon profil', href: '/espace-pro/profil', icon: UserCircle },
  { label: 'Messages', href: '/espace-pro/messages', icon: MessageSquare, badge: 3 },
  { label: 'Abonnement', href: '/espace-pro/abonnement', icon: CreditCard },
  { label: 'Paramètres', href: '/espace-pro/parametres', icon: Settings },
]

const FOOTER_ITEMS = [
  { label: 'Déconnexion', href: '/connexion', icon: LogOut },
]

export default function EspaceProLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <DashboardSidebar
        navItems={NAV_ITEMS}
        footerItems={FOOTER_ITEMS}
        title="Espace Professionnel"
        userInitials="TC"
        userName="ThermoConfort Paris"
        userRole="Abonnement Pro"
      />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
