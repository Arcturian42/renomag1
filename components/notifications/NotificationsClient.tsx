'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from '@/app/actions/data'
import {
  Bell,
  FileText,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Star,
} from 'lucide-react'

interface Notification {
  id: string
  userId: string
  title: string
  content: string
  read: boolean
  createdAt: Date
}

const ICON_MAP: Record<string, { icon: typeof FileText; color: string }> = {
  devis: { icon: FileText, color: 'text-primary-600 bg-primary-50' },
  message: { icon: MessageSquare, color: 'text-eco-600 bg-eco-50' },
  alert: { icon: AlertCircle, color: 'text-amber-600 bg-amber-50' },
  match: { icon: CheckCircle, color: 'text-eco-600 bg-eco-50' },
  avis: { icon: Star, color: 'text-accent-600 bg-accent-50' },
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

function getIconKey(title: string): string {
  const t = title.toLowerCase()
  if (t.includes('devis')) return 'devis'
  if (t.includes('message')) return 'message'
  if (t.includes('avis')) return 'avis'
  if (t.includes('artisan') || t.includes('match')) return 'match'
  return 'alert'
}

interface NotificationsClientProps {
  initialNotifications: Notification[]
  userId: string
  settingsHref?: string
}

export default function NotificationsClient({
  initialNotifications,
  userId,
  settingsHref = '/espace-proprietaire/compte',
}: NotificationsClientProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)

  const unreadCount = notifications.filter((n) => !n.read).length

  async function handleMarkOne(notifId: string) {
    const notif = notifications.find((n) => n.id === notifId)
    if (!notif || notif.read) return

    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, read: true } : n))
    )

    startTransition(async () => {
      try {
        await markNotificationAsRead(notifId)
        router.refresh()
      } catch (err) {
        // Revert on error
        setNotifications((prev) =>
          prev.map((n) => (n.id === notifId ? { ...n, read: false } : n))
        )
        console.error('Failed to mark notification as read:', err)
      }
    })
  }

  async function handleMarkAll() {
    const previous = [...notifications]
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))

    startTransition(async () => {
      try {
        await markAllNotificationsAsRead(userId)
        router.refresh()
      } catch (err) {
        setNotifications(previous)
        console.error('Failed to mark all as read:', err)
      }
    })
  }

  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
          <p className="text-slate-500 mt-1">
            {unreadCount} notification{unreadCount !== 1 ? 's' : ''} non lue
            {unreadCount !== 1 ? 's' : ''}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAll}
            disabled={isPending}
            className="text-sm text-primary-600 hover:text-primary-800 font-medium disabled:opacity-50"
          >
            {isPending ? 'Mise à jour...' : 'Tout marquer comme lu'}
          </button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.length === 0 && (
          <p className="text-sm text-slate-500">Aucune notification pour le moment.</p>
        )}
        {notifications.map((notif) => {
          const mapped = ICON_MAP[getIconKey(notif.title)]
          const Icon = mapped.icon
          return (
            <div
              key={notif.id}
              onClick={() => handleMarkOne(notif.id)}
              className={`bg-white rounded-xl border p-5 flex items-start gap-4 transition-colors cursor-pointer hover:bg-slate-50 ${
                notif.read ? 'border-slate-200' : 'border-primary-200 shadow-sm'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${mapped.color}`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p
                    className={`text-sm font-semibold ${
                      notif.read ? 'text-slate-700' : 'text-slate-900'
                    }`}
                  >
                    {notif.title}
                  </p>
                  {!notif.read && (
                    <div className="w-2 h-2 rounded-full bg-primary-600 flex-shrink-0 mt-1.5" />
                  )}
                </div>
                <p className="text-sm text-slate-500 mt-0.5 leading-relaxed">
                  {notif.content}
                </p>
                <p className="text-xs text-slate-400 mt-2">
                  {formatTimeAgo(notif.createdAt)}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-8 bg-slate-50 rounded-xl border border-slate-200 p-5">
        <div className="flex items-center gap-3">
          <Bell className="w-5 h-5 text-slate-400" />
          <div>
            <p className="text-sm font-medium text-slate-900">
              Préférences de notifications
            </p>
            <p className="text-xs text-slate-500">
              Gérez vos notifications email et SMS depuis votre compte.
            </p>
          </div>
          <a
            href={settingsHref}
            className="ml-auto text-xs text-primary-600 hover:text-primary-800 font-medium flex-shrink-0"
          >
            Configurer →
          </a>
        </div>
      </div>
    </div>
  )
}
