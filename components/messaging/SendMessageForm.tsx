'use client'

import { useState } from 'react'
import { Send } from 'lucide-react'
import { sendMessage } from '@/app/actions/messages'

export default function SendMessageForm({ receiverId }: { receiverId: string }) {
  const [content, setContent] = useState('')
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() || sending) return
    setSending(true)
    const result = await sendMessage(receiverId, content)
    setSending(false)
    if (result.success) {
      setContent('')
      // Force refresh to show new message
      window.location.reload()
    } else {
      alert(result.error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-3 w-full">
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Écrivez votre message..."
        className="flex-1 text-sm rounded-xl border border-slate-200 px-4 py-3 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
      />
      <button
        type="submit"
        disabled={sending || !content.trim()}
        className="btn-primary px-5 py-3 flex items-center gap-2 disabled:opacity-50"
      >
        {sending ? 'Envoi...' : <><Send className="w-4 h-4" /> Envoyer</>}
      </button>
    </form>
  )
}
