'use client'

import { useState, useOptimistic, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { sendMessage, markMessagesAsRead } from '@/app/actions/data'

interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  read: boolean
  createdAt: Date
}

interface Partner {
  id: string
  name: string
  avatar: string
  city?: string
}

export default function ChatApp({
  initialMessages,
  currentUserId,
  partners,
  mode,
}: {
  initialMessages: Message[]
  currentUserId: string
  partners: Partner[]
  mode: 'pro' | 'proprietaire'
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [activePartnerId, setActivePartnerId] = useState<string>(partners[0]?.id || '')
  const [input, setInput] = useState('')

  const activePartner = partners.find((p) => p.id === activePartnerId)

  const conversationsMap = new Map<string, Message[]>()
  for (const msg of initialMessages) {
    const partnerId = msg.senderId === currentUserId ? msg.receiverId : msg.senderId
    if (!conversationsMap.has(partnerId)) {
      conversationsMap.set(partnerId, [])
    }
    conversationsMap.get(partnerId)!.push(msg)
  }

  const activeMessages = conversationsMap.get(activePartnerId) || []

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || !activePartnerId) return

    const content = input.trim()
    setInput('')

    startTransition(async () => {
      await sendMessage({
        senderId: currentUserId,
        receiverId: activePartnerId,
        content,
      })
      router.refresh()
    })
  }

  async function handleSelectPartner(partnerId: string) {
    setActivePartnerId(partnerId)
    startTransition(async () => {
      await markMessagesAsRead({ userId: currentUserId, partnerId })
      router.refresh()
    })
  }

  return (
    <div className="h-[calc(100vh-64px)] flex">
      {/* Conversation list */}
      <div className="w-80 border-r border-slate-200 bg-white flex flex-col">
        <div className="p-4 border-b border-slate-200">
          <h1 className="text-lg font-bold text-slate-900">Messages</h1>
          <input
            type="text"
            placeholder={mode === 'pro' ? 'Rechercher un client...' : 'Rechercher un artisan...'}
            className="mt-3 w-full text-sm rounded-lg border border-slate-200 px-3 py-2 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div className="flex-1 overflow-y-auto">
          {partners.length === 0 && (
            <p className="text-sm text-slate-500 p-4">Aucune conversation.</p>
          )}
          {partners.map((partner) => {
            const msgs = conversationsMap.get(partner.id) || []
            const lastMsg = msgs[msgs.length - 1]
            const unread = msgs.filter((m) => m.receiverId === currentUserId && !m.read).length
            return (
              <button
                key={partner.id}
                onClick={() => handleSelectPartner(partner.id)}
                className={`w-full text-left p-4 border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors ${
                  partner.id === activePartnerId ? 'bg-primary-50 border-l-2 border-l-primary-600' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 flex-shrink-0">
                    {partner.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-slate-900">{partner.name}</p>
                      <span className="text-xs text-slate-400">
                        {lastMsg ? formatTimeAgo(new Date(lastMsg.createdAt)) : ''}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 truncate mt-0.5">
                      {lastMsg ? lastMsg.content : 'Pas encore de message'}
                    </p>
                  </div>
                  {unread > 0 && (
                    <div className="w-5 h-5 rounded-full bg-accent-500 flex items-center justify-center text-xs text-white font-bold flex-shrink-0">
                      {unread}
                    </div>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col bg-slate-50">
        {activePartner ? (
          <>
            <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                {activePartner.avatar}
              </div>
              <div>
                <p className="font-semibold text-slate-900">{activePartner.name}</p>
                <p className="text-xs text-slate-500">{activePartner.city || (mode === 'pro' ? 'Client' : 'Artisan RGE')}</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {activeMessages.length === 0 && (
                <p className="text-sm text-slate-400 text-center py-10">
                  {mode === 'pro'
                    ? 'Envoyez un message à ce client pour démarrer la conversation.'
                    : 'Envoyez un message à cet artisan pour démarrer la conversation.'}
                </p>
              )}
              {activeMessages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-sm flex flex-col gap-1 ${msg.senderId === currentUserId ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        msg.senderId === currentUserId
                          ? 'bg-primary-600 text-white rounded-br-sm'
                          : 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm'
                      }`}
                    >
                      {msg.content}
                    </div>
                    <span className="text-xs text-slate-400">
                      {new Date(msg.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSend} className="bg-white border-t border-slate-200 p-4">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={mode === 'pro' ? 'Répondre à ce client...' : 'Écrivez votre message...'}
                  className="flex-1 text-sm rounded-xl border border-slate-200 px-4 py-3 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button
                  type="submit"
                  disabled={isPending || !input.trim()}
                  className="btn-primary px-5 py-3 disabled:opacity-50"
                >
                  {isPending ? '...' : 'Envoyer'}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-slate-400">Sélectionnez une conversation</p>
          </div>
        )}
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
