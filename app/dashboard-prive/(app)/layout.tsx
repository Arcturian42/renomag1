import { requireDashboardAuth } from '@/lib/dashboard-auth'
import DashboardMobileWrapper from '@/components/dashboard/DashboardMobileWrapper'
import LogoutLink from '@/components/dashboard/LogoutLink'
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  BarChart3,
} from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Tableau de bord', href: '/dashboard-prive/tableau-de-bord', icon: LayoutDashboard },
  { label: 'Utilisateurs', href: '/dashboard-prive/utilisateurs', icon: Users },
  { label: 'Leads', href: '/dashboard-prive/leads', icon: TrendingUp },
  { label: 'Répartition', href: '/dashboard-prive/repartition', icon: BarChart3 },
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
      footerExtra={<LogoutLink />}
      title="Dashboard Privé"
      userInitials="PR"
      userName="Administrateur"
      userRole="Accès privé"
    >
      {children}
    </DashboardMobileWrapper>
  )
}
