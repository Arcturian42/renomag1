import { Bell, CheckCircle, MessageSquare, FileText, AlertCircle, Star } from 'lucide-react'

const NOTIFICATIONS = [
  {
    id: 1,
    type: 'devis',
    icon: FileText,
    iconColor: 'text-primary-600 bg-primary-50',
    title: 'Nouveau devis reçu',
    message: 'Éco-Rénov Lyon vous a envoyé un devis de 12 400€ pour votre projet d\'isolation.',
    time: 'Il y a 2 heures',
    read: false,
  },
  {
    id: 2,
    type: 'message',
    icon: MessageSquare,
    iconColor: 'text-eco-600 bg-eco-50',
    title: 'Nouveau message',
    message: 'ThermoConfort Paris : "Je prépare votre devis et vous contacte demain matin."',
    time: 'Il y a 5 heures',
    read: false,
  },
  {
    id: 3,
    type: 'alert',
    icon: AlertCircle,
    iconColor: 'text-amber-600 bg-amber-50',
    title: 'Action requise',
    message: 'Pensez à déposer votre dossier MaPrimeRénov\' avant de commencer les travaux.',
    time: 'Hier, 14:00',
    read: true,
  },
  {
    id: 4,
    type: 'match',
    icon: CheckCircle,
    iconColor: 'text-eco-600 bg-eco-50',
    title: '3 artisans sélectionnés',
    message: 'Notre algorithme a sélectionné 3 artisans RGE pour votre projet. Consultez les profils.',
    time: '15 avril, 10:30',
    read: true,
  },
  {
    id: 5,
    type: 'avis',
    icon: Star,
    iconColor: 'text-accent-600 bg-accent-50',
    title: 'Laissez un avis',
    message: 'Vos travaux sont terminés ? Partagez votre expérience avec la communauté RENOMAG.',
    time: '10 avril, 09:00',
    read: true,
  },
]

export default function ProprietaireNotificationsPage() {
  const unreadCount = NOTIFICATIONS.filter((n) => !n.read).length

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
        {NOTIFICATIONS.map((notif) => {
          const Icon = notif.icon
          return (
            <div
              key={notif.id}
              className={`bg-white rounded-xl border p-5 flex items-start gap-4 transition-colors ${
                notif.read ? 'border-slate-200' : 'border-primary-200 shadow-sm'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${notif.iconColor}`}>
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
                <p className="text-sm text-slate-500 mt-0.5 leading-relaxed">{notif.message}</p>
                <p className="text-xs text-slate-400 mt-2">{notif.time}</p>
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
