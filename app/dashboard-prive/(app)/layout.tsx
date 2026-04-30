import { requireDashboardAuth } from '@/lib/dashboard-auth'
import DashboardMobileWrapper from '@/components/dashboard/DashboardMobileWrapper'
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  BarChart3,
  LogOut,
} from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Tableau de bord', href: '/dashboard-prive/tableau-de-bord', icon: LayoutDashboard },
  { label: 'Utilisateurs', href: '/dashboard-prive/utilisateurs', icon: Users },
  { label: 'Leads', href: '/dashboard-prive/leads', icon: TrendingUp },
  { label: 'Répartition', href: '/dashboard-prive/repartition', icon: BarChart3 },
]

const FOOTER_ITEMS = [
  { label: 'Déconnexion', href: '/dashboard-prive?logout=1', icon: LogOut },
]

export default function PrivateDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  requireDashboardAuth()

  return (
    <DashboardMobileWrapper
      navItems={NAV_ITEMS}
      footerItems={FOOTER_ITEMS}
      title="Dashboard Privé"
      userInitials="PR"
      userName="Administrateur"
      userRole="Accès privé"
    >
      {children}
    </DashboardMobileWrapper>
  )
}
