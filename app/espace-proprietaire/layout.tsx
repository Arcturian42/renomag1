import { requireRole } from '@/lib/auth/server-auth'
import { Role } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import EspaceProprietaireLayoutClient from '@/components/layout/EspaceProprietaireLayoutClient'

export default async function EspaceProprietaireLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = await requireRole('/espace-proprietaire', [Role.USER, Role.ADMIN])

  const [unreadMessages, unreadNotifications, profile] = await Promise.all([
    prisma.message.count({ where: { receiverId: user.id, read: false } }),
    prisma.notification.count({ where: { userId: user.id, read: false } }),
    prisma.profile.findUnique({ where: { userId: user.id } }),
  ])

  const name =
    profile?.firstName || 'Particulier'
  const initials = `${profile?.firstName?.[0] || 'P'}${profile?.lastName?.[0] || 'A'}`.toUpperCase()

  return (
    <EspaceProprietaireLayoutClient
      userName={name}
      userInitials={initials}
      userRole="Particulier"
      unreadMessages={unreadMessages}
      unreadNotifications={unreadNotifications}
      matchedArtisans={0}
    >
      {children}
    </EspaceProprietaireLayoutClient>
  )
}
