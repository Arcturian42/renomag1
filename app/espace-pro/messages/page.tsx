export const dynamic = 'force-dynamic'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import ChatInterface from '@/components/messaging/ChatInterface'

function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return "À l'instant"
  if (diffMins < 60) return `Il y a ${diffMins}min`
  if (diffHours < 24) return `Il y a ${diffHours}h`
  if (diffDays === 1) return 'Hier'
  if (diffDays < 7) return `Il y a ${diffDays} jours`
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

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

  const conversationsMap = new Map<string, typeof messages>()
  for (const msg of messages) {
    const partnerId = msg.senderId === user.id ? msg.receiverId : msg.senderId
    if (!conversationsMap.has(partnerId)) {
      conversationsMap.set(partnerId, [])
    }
    conversationsMap.get(partnerId)!.push(msg)
  }

  const partnerIds = Array.from(conversationsMap.keys())
  const partners = await prisma.user.findMany({
    where: { id: { in: partnerIds } },
    include: { profile: true, artisan: true },
  })
  const partnerMap = new Map(partners.map((p) => [p.id, p]))

  const conversations = Array.from(conversationsMap.entries()).map(([partnerId, msgs]) => {
    const partner = partnerMap.get(partnerId)
    const name =
      partner?.artisan?.name ||
      `${partner?.profile?.firstName || ''} ${partner?.profile?.lastName || ''}`.trim() ||
      partner?.email ||
      'Utilisateur'
    const initials = name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase()
    const lastMsg = msgs[msgs.length - 1]
    const unread = msgs.filter((m) => m.receiverId === user.id && !m.read).length

    return {
      id: partnerId,
      name,
      avatar: initials,
      city: partner?.profile?.city || partner?.artisan?.city || '',
      project: partner?.artisan?.name ? '' : '',
      lastMessage: lastMsg.content,
      time: formatTimeAgo(lastMsg.createdAt),
      unread,
    }
  })

  const partnerData = conversations.map((conv) => {
    const partner = partnerMap.get(conv.id)
    return {
      id: conv.id,
      name: conv.name,
      avatar: conv.avatar,
      city: conv.city,
      project: conv.project,
    }
  })

  return (
    <ChatInterface
      userId={user.id}
      initialConversations={conversations}
      initialMessages={messages}
      partners={partnerData}
      emptyPlaceholder="Aucune conversation pour le moment."
      inputPlaceholder="Répondre à ce client..."
    />
  )
}
