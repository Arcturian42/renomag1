const CONVERSATIONS = [
  {
    id: 1,
    name: 'Jean Dupont',
    avatar: 'JD',
    city: 'Paris 16e',
    project: 'Isolation combles + PAC',
    lastMessage: 'Pouvez-vous me donner une estimation du délai de réalisation pour ce projet ?',
    time: 'Il y a 1h',
    unread: 1,
  },
  {
    id: 2,
    name: 'Marie Martin',
    avatar: 'MM',
    city: 'Versailles',
    project: 'Panneaux solaires 6kWc',
    lastMessage: 'Merci pour le devis, je vais l\'étudier et vous recontacte.',
    time: 'Hier',
    unread: 0,
  },
  {
    id: 3,
    name: 'Pierre Bernard',
    avatar: 'PB',
    city: 'Boulogne-Billancourt',
    project: 'VMC double flux',
    lastMessage: 'Le devis vous convient-il ? Nous pouvons commencer la semaine prochaine.',
    time: '2 jours',
    unread: 0,
  },
]

const MESSAGES = [
  {
    id: 1,
    from: 'user',
    text: 'Bonjour, j\'ai bien reçu votre demande de devis pour l\'isolation des combles et une PAC air/eau. Votre logement fait bien 120 m² construit en 1985 ?',
    time: '14 avril, 10:15',
  },
  {
    id: 2,
    from: 'client',
    text: 'Oui c\'est exact. Et nous avons aussi un grenier non isolé d\'environ 60 m².',
    time: '14 avril, 10:45',
  },
  {
    id: 3,
    from: 'user',
    text: 'Parfait. Je prends en compte le grenier dans le devis. Je viendrai faire une visite technique jeudi si vous êtes disponible.',
    time: '14 avril, 11:02',
  },
  {
    id: 4,
    from: 'client',
    text: 'Pouvez-vous me donner une estimation du délai de réalisation pour ce projet ?',
    time: 'Aujourd\'hui, 09:30',
  },
]

export default function EspaceProMessagesPage() {
  const active = CONVERSATIONS[0]

  return (
    <div className="h-[calc(100vh-64px)] flex">
      {/* Conversation list */}
      <div className="w-80 border-r border-slate-200 bg-white flex flex-col">
        <div className="p-4 border-b border-slate-200">
          <h1 className="text-lg font-bold text-slate-900">Messages</h1>
          <input
            type="text"
            placeholder="Rechercher un client..."
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
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 flex-shrink-0">
                  {conv.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-900">{conv.name}</p>
                    <span className="text-xs text-slate-400">{conv.time}</span>
                  </div>
                  <p className="text-xs text-primary-600 font-medium truncate">{conv.project}</p>
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
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
            {active.avatar}
          </div>
          <div>
            <p className="font-semibold text-slate-900">{active.name}</p>
            <p className="text-xs text-slate-500">{active.city} — {active.project}</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {MESSAGES.map((msg) => (
            <div key={msg.id} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-sm flex flex-col gap-1 ${msg.from === 'user' ? 'items-end' : 'items-start'}`}>
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

        <div className="bg-white border-t border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Répondre à ce client..."
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
