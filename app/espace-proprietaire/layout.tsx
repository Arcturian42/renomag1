import { requireRole } from '@/lib/auth/server-auth'
import { Role } from '@prisma/client'
import EspaceProprietaireLayoutClient from '@/components/layout/EspaceProprietaireLayoutClient'

export default async function EspaceProprietaireLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireRole('/espace-proprietaire', [Role.USER, Role.ADMIN])

  return <EspaceProprietaireLayoutClient>{children}</EspaceProprietaireLayoutClient>
}
