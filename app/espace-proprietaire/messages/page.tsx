const CONVERSATIONS = [
  {
    id: 1,
    company: 'Éco-Rénov Lyon',
    avatar: 'ÉR',
    lastMessage: 'Bonjour, je vous envoie le devis détaillé ce soir. Pouvez-vous confirmer votre disponibilité pour une visite mercredi ?',
    time: 'Il y a 2h',
    unread: 2,
    status: 'online',
  },
  {
    id: 2,
    company: 'Nord Isolation',
    avatar: 'NI',
    lastMessage: 'Votre devis a été envoyé. N\'hésitez pas si vous avez des questions sur les matériaux utilisés.',
    time: 'Hier',
    unread: 0,
    status: 'offline',
  },
  {
    id: 3,
    company: 'ThermoConfort Paris',
    avatar: 'TC',
    lastMessage: 'Je prépare votre devis pour l\'installation de la pompe à chaleur air/eau.',
    time: '2 jours',
    unread: 0,
    status: 'offline',
  },
]

const MESSAGES = [
  {
    id: 1,
    from: 'artisan',
    text: 'Bonjour Jean, merci pour votre demande de devis. J\'ai bien pris note de votre projet : isolation des combles et installation d\'une PAC air/eau.',
    time: '14 avril, 10:23',
  },
  {
    id: 2,
    from: 'user',
    text: 'Bonjour, merci. Pouvez-vous me donner une estimation du délai de réalisation ?',
    time: '14 avril, 11:05',
  },
  {
    id: 3,
    from: 'artisan',
    text: 'Pour ce type de travaux, il faut compter 3 à 5 jours de chantier. Nous pourrions intervenir courant mai. Je vous envoie le devis complet demain matin.',
    time: '14 avril, 11:32',
  },
  {
    id: 4,
    from: 'artisan',
    text: 'Bonjour, je vous envoie le devis détaillé ce soir. Pouvez-vous confirmer votre disponibilité pour une visite mercredi ?',
    time: 'Aujourd\'hui, 09:15',
  },
]

export default function ProprietaireMessagesPage() {
  const active = CONVERSATIONS[0]

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
          {CONVERSATIONS.map((conv) => (
            <div
              key={conv.id}
              className={`p-4 border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors ${conv.id === active.id ? 'bg-primary-50 border-l-2 border-l-primary-600' : ''}`}
            >
              <div className="flex items-start gap-3">
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-xs font-bold text-primary-700">
                    {conv.avatar}
                  </div>
                  {conv.status === 'online' && (
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-eco-500 border-2 border-white" />
                  )}
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
            <p className="text-xs text-eco-600">En ligne</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {MESSAGES.map((msg) => (
            <div key={msg.id} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-sm ${msg.from === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                <div
                  className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.from === 'user'
                      ? 'bg-primary-600 text-white rounded-br-sm'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-xs text-slate-400">{msg.time}</span>
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
