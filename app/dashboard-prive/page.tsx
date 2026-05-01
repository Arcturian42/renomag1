import { redirect } from 'next/navigation'
import { isDashboardAuthenticated, clearDashboardSession } from '@/lib/dashboard-auth'
import LoginForm from '@/components/dashboard/LoginForm'

export default function DashboardLoginPage({
  searchParams,
}: {
  searchParams: { logout?: string }
}) {
  if (searchParams.logout === '1') {
    clearDashboardSession()
    redirect('/dashboard-prive')
  }

  if (isDashboardAuthenticated()) {
    redirect('/dashboard-prive/tableau-de-bord')
  }

  return <LoginForm />
}
