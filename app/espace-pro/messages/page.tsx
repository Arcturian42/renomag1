export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import ChatApp from '@/components/messages/ChatApp'

export default async function EspaceProMessagesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/connexion')
  }

  const messages = await prisma.message.findMany({
    where: {
      OR: [{ senderId: user.id }, { receiverId: user.id }],
    },
    orderBy: { createdAt: 'asc' },
  })

  if (messages.length === 0) {
    return (
      <div className="h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-slate-900">Messages</h2>
          <p className="text-slate-500 mt-1">Aucune conversation pour le moment.</p>
        </div>
      </div>
    )
  }

  const partnerIds = Array.from(
    new Set(messages.map((m) => (m.senderId === user.id ? m.receiverId : m.senderId)))
  )

  const partners = await prisma.user.findMany({
    where: { id: { in: partnerIds } },
    include: { profile: true, artisan: true },
  })

  const partnerList = partners.map((p) => {
    const name =
      p.artisan?.name ||
      `${p.profile?.firstName || ''} ${p.profile?.lastName || ''}`.trim() ||
      p.email ||
      'Client'
    const initials = name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase()
    return {
      id: p.id,
      name,
      avatar: initials,
      city: p.profile?.city || '',
    }
  })

  return (
    <ChatApp
      initialMessages={messages}
      currentUserId={user.id}
      partners={partnerList}
      mode="pro"
    />
  )
}
