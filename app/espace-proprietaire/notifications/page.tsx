import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { Bell, FileText, MessageSquare, AlertCircle, CheckCircle, Star } from 'lucide-react'

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

export default async function ProprietaireNotificationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/connexion')
  }

  const notifications = await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  })

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
          <p className="text-slate-500 mt-1">
            {unreadCount} notification{unreadCount !== 1 ? 's' : ''} non lue{unreadCount !== 1 ? 's' : ''}
          </p>
        </div>
        <button className="text-sm text-primary-600 hover:text-primary-800 font-medium">
          Tout marquer comme lu
        </button>
      </div>

      <div className="space-y-3">
        {notifications.length === 0 && (
          <p className="text-sm text-slate-500">Aucune notification pour le moment.</p>
        )}
        {notifications.map((notif) => {
          const mapped = ICON_MAP[notif.title.toLowerCase().includes('devis') ? 'devis' : notif.title.toLowerCase().includes('message') ? 'message' : notif.title.toLowerCase().includes('avis') ? 'avis' : notif.title.toLowerCase().includes('artisan') ? 'match' : 'alert']
          const Icon = mapped.icon
          return (
            <div
              key={notif.id}
              className={`bg-white rounded-xl border p-5 flex items-start gap-4 transition-colors ${
                notif.read ? 'border-slate-200' : 'border-primary-200 shadow-sm'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${mapped.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-sm font-semibold ${notif.read ? 'text-slate-700' : 'text-slate-900'}`}>
                    {notif.title}
                  </p>
                  {!notif.read && (
                    <div className="w-2 h-2 rounded-full bg-primary-600 flex-shrink-0 mt-1.5" />
                  )}
                </div>
                <p className="text-sm text-slate-500 mt-0.5 leading-relaxed">{notif.content}</p>
                <p className="text-xs text-slate-400 mt-2">{formatTimeAgo(notif.createdAt)}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-8 bg-slate-50 rounded-xl border border-slate-200 p-5">
        <div className="flex items-center gap-3">
          <Bell className="w-5 h-5 text-slate-400" />
          <div>
            <p className="text-sm font-medium text-slate-900">Préférences de notifications</p>
            <p className="text-xs text-slate-500">Gérez vos notifications email et SMS depuis votre compte.</p>
          </div>
          <a href="/espace-proprietaire/compte" className="ml-auto text-xs text-primary-600 hover:text-primary-800 font-medium flex-shrink-0">
            Configurer →
          </a>
        </div>
      </div>
    </div>
  )
}
