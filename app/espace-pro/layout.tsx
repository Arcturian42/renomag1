import { requireRole } from '@/lib/auth/server-auth'
import { Role } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import EspaceProLayoutClient from '@/components/layout/EspaceProLayoutClient'

export default async function EspaceProLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = await requireRole('/espace-pro', [Role.ARTISAN])

  const [unreadMessages, unreadNotifications, newLeads, artisan] = await Promise.all([
    prisma.message.count({ where: { receiverId: user.id, read: false } }),
    prisma.notification.count({ where: { userId: user.id, read: false } }),
    prisma.lead.count({ where: { artisanId: user.id, status: 'NEW' } }),
    prisma.artisanCompany.findUnique({
      where: { userId: user.id },
      include: { user: { include: { profile: true } }, subscription: true },
    }),
  ])

  const name = artisan?.name || artisan?.user?.profile?.firstName || 'Artisan'
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()

  return (
    <EspaceProLayoutClient
      userName={name}
      userInitials={initials}
      userRole={artisan?.subscription?.plan || 'Abonnement Pro'}
      unreadMessages={unreadMessages}
      unreadNotifications={unreadNotifications}
      newLeads={newLeads}
    >
      {children}
    </EspaceProLayoutClient>
  )
}
