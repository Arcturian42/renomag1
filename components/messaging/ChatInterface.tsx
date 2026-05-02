'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { sendMessage, markMessagesAsRead } from '@/app/actions/messages'

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
  city: string
  project?: string
}

interface Conversation {
  id: string
  name: string
  avatar: string
  city: string
  project: string
  lastMessage: string
  time: string
  unread: number
}

interface ChatInterfaceProps {
  userId: string
  initialConversations: Conversation[]
  initialMessages: Message[]
  partners: Partner[]
  emptyPlaceholder?: string
  inputPlaceholder?: string
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

export default function ChatInterface({
  userId,
  initialConversations,
  initialMessages,
  partners,
  emptyPlaceholder = 'Aucune conversation pour le moment.',
  inputPlaceholder = 'Écrivez votre message...',
}: ChatInterfaceProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [activePartnerId, setActivePartnerId] = useState<string>(
    initialConversations[0]?.id || ''
  )
  const [inputValue, setInputValue] = useState('')
  const [localMessages, setLocalMessages] = useState<Message[]>(initialMessages)
  const [localConversations, setLocalConversations] = useState<Conversation[]>(initialConversations)

  const activePartner = partners.find((p) => p.id === activePartnerId)
  const activeMessages = localMessages.filter(
    (m) => m.senderId === activePartnerId || m.receiverId === activePartnerId
  )

  async function handleSelectConversation(partnerId: string) {
    setActivePartnerId(partnerId)

    // Mark conversation as read
    const conv = localConversations.find((c) => c.id === partnerId)
    if (conv && conv.unread > 0) {
      startTransition(async () => {
        await markMessagesAsRead(partnerId)
        setLocalConversations((prev) =>
          prev.map((c) => (c.id === partnerId ? { ...c, unread: 0 } : c))
        )
        setLocalMessages((prev) =>
          prev.map((m) =>
            m.senderId === partnerId && m.receiverId === userId ? { ...m, read: true } : m
          )
        )
        router.refresh()
      })
    }
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!inputValue.trim() || !activePartnerId) return

    const content = inputValue.trim()
    setInputValue('')

    // Optimistic update
    const tempId = `temp-${Date.now()}`
    const now = new Date()
    const optimisticMsg: Message = {
      id: tempId,
      senderId: userId,
      receiverId: activePartnerId,
      content,
      read: false,
      createdAt: now,
    }
    setLocalMessages((prev) => [...prev, optimisticMsg])
    setLocalConversations((prev) =>
      prev.map((c) =>
        c.id === activePartnerId
          ? { ...c, lastMessage: content, time: "À l'instant" }
          : c
      )
    )

    startTransition(async () => {
      try {
        await sendMessage(activePartnerId, content)
        router.refresh()
      } catch (err) {
        // Remove optimistic message on error
        setLocalMessages((prev) => prev.filter((m) => m.id !== tempId))
        console.error('Failed to send message:', err)
      }
    })
  }

  if (localConversations.length === 0) {
    return (
      <div className="h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-slate-900">Messages</h2>
          <p className="text-slate-500 mt-1">{emptyPlaceholder}</p>
        </div>
      </div>
    )
  }

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
            onChange={(e) => {
              const term = e.target.value.toLowerCase()
              if (!term) {
                setLocalConversations(initialConversations)
                return
              }
              setLocalConversations(
                initialConversations.filter(
                  (c) =>
                    c.name.toLowerCase().includes(term) ||
                    c.lastMessage.toLowerCase().includes(term)
                )
              )
            }}
          />
        </div>
        <div className="flex-1 overflow-y-auto">
          {localConversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => handleSelectConversation(conv.id)}
              className={`p-4 border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors ${
                conv.id === activePartnerId
                  ? 'bg-primary-50 border-l-2 border-l-primary-600'
                  : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 flex-shrink-0">
                  {conv.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-900">{conv.name}</p>
                    <span className="text-xs text-slate-400">{conv.time}</span>
                  </div>
                  <p className="text-xs text-primary-600 font-medium truncate">{conv.project || 'Projet'}</p>
                  <p className="text-xs text-slate-500 truncate mt-0.5">{conv.lastMessage}</p>
                </div>
                {conv.unread > 0 && (
                  <div className="w-5 h-5 rounded-full bg-accent-500 flex items-center justify-center text-xs text-white font-bold flex-shrink-0">
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
        {activePartner && (
          <>
            <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                {activePartner.avatar}
              </div>
              <div>
                <p className="font-semibold text-slate-900">{activePartner.name}</p>
                <p className="text-xs text-slate-500">
                  {activePartner.city} — {activePartner.project || 'Projet'}
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {activeMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.senderId === userId ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-sm flex flex-col gap-1 ${
                      msg.senderId === userId ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        msg.senderId === userId
                          ? 'bg-primary-600 text-white rounded-br-sm'
                          : 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm'
                      }`}
                    >
                      {msg.content}
                    </div>
                    <span className="text-xs text-slate-400">
                      {msg.createdAt.toLocaleDateString('fr-FR', {
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

            <form
              onSubmit={handleSend}
              className="bg-white border-t border-slate-200 p-4"
            >
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={inputPlaceholder}
                  className="flex-1 text-sm rounded-xl border border-slate-200 px-4 py-3 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  disabled={isPending}
                />
                <button
                  type="submit"
                  disabled={isPending || !inputValue.trim()}
                  className="btn-primary px-5 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPending ? '...' : 'Envoyer'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
