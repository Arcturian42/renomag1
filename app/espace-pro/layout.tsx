import { requireRole } from '@/lib/auth/server-auth'
import { Role } from '@prisma/client'
import EspaceProLayoutClient from '@/components/layout/EspaceProLayoutClient'

export default async function EspaceProLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireRole('/espace-pro', [Role.ARTISAN])

  return <EspaceProLayoutClient>{children}</EspaceProLayoutClient>
}
