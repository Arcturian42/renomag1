export const dynamic = 'force-dynamic'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import NotificationsClient from '@/components/notifications/NotificationsClient'

export default async function EspaceProNotificationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/connexion')
  }

  const notifications = await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <NotificationsClient
      initialNotifications={notifications}
      userId={user.id}
      settingsHref="/espace-pro/parametres"
    />
  )
}
