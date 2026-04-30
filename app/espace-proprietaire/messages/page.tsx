import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export default async function ProprietaireMessagesPage() {
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
    const company = partner?.artisan?.name || partner?.email || 'Artisan'
    const initials = company
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase()
    const lastMsg = msgs[msgs.length - 1]
    const unread = msgs.filter((m) => m.receiverId === user.id && !m.read).length

    return {
      id: partnerId,
      company,
      avatar: initials,
      lastMessage: lastMsg.content,
      time: formatTimeAgo(lastMsg.createdAt),
      unread,
      status: 'offline' as const,
    }
  })

  const active = conversations[0]

  const activeMessages = messages.filter(
    (m) => m.senderId === active.id || m.receiverId === active.id
  )

  return (
    <div className="h-[calc(100vh-64px)] flex">
      {/* Conversation list */}
      <div className="w-80 border-r border-slate-200 bg-white flex flex-col">
        <div className="p-4 border-b border-slate-200">
          <h1 className="text-lg font-bold text-slate-900">Messages</h1>
          <input
            type="text"
            placeholder="Rechercher..."
            className="mt-3 w-full text-sm rounded-lg border border-slate-200 px-3 py-2 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className={`p-4 border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors ${conv.id === active.id ? 'bg-primary-50 border-l-2 border-l-primary-600' : ''}`}
            >
              <div className="flex items-start gap-3">
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-xs font-bold text-primary-700">
                    {conv.avatar}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-900 truncate">{conv.company}</p>
                    <span className="text-xs text-slate-400 flex-shrink-0">{conv.time}</span>
                  </div>
                  <p className="text-xs text-slate-500 truncate mt-0.5">{conv.lastMessage}</p>
                </div>
                {conv.unread > 0 && (
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary-600 flex items-center justify-center text-xs text-white font-bold">
                    {conv.unread}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col bg-slate-50">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-xs font-bold text-primary-700">
            {active.avatar}
          </div>
          <div>
            <p className="font-semibold text-slate-900">{active.company}</p>
            <p className="text-xs text-slate-500">Artisan RGE</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {activeMessages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-sm ${msg.senderId === user.id ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                <div
                  className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.senderId === user.id
                      ? 'bg-primary-600 text-white rounded-br-sm'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm'
                  }`}
                >
                  {msg.content}
                </div>
                <span className="text-xs text-slate-400">
                  {msg.createdAt.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="bg-white border-t border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Écrivez votre message..."
              className="flex-1 text-sm rounded-xl border border-slate-200 px-4 py-3 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button className="btn-primary px-5 py-3">
              Envoyer
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

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
