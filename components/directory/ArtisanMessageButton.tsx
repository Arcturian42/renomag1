'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { MessageSquare, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { sendContactMessage } from '@/app/actions/messages'

interface ArtisanMessageButtonProps {
  artisanId: string
  artisanName: string
  redirectUrl: string
}

export default function ArtisanMessageButton({
  artisanId,
  artisanName,
  redirectUrl,
}: ArtisanMessageButtonProps) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    async function checkUser() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    checkUser()
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSending(true)
    setError(null)

    try {
      const formData = new FormData(e.currentTarget)
      const result = await sendContactMessage(formData)

      if (result.success) {
        setSuccess(true)
        setTimeout(() => {
          setShowModal(false)
          setSuccess(false)
        }, 2000)
      } else {
        setError(result.error || 'Erreur lors de l\'envoi du message')
      }
    } catch (err) {
      setError('Erreur lors de l\'envoi du message')
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <button className="btn-secondary w-full opacity-50 cursor-wait" disabled>
        <MessageSquare className="w-4 h-4" />
        Chargement...
      </button>
    )
  }

  // If not logged in, redirect to login
  if (!user) {
    return (
      <Link
        href={`/connexion?redirect=${encodeURIComponent(redirectUrl)}`}
        className="btn-secondary w-full text-center flex items-center justify-center gap-2"
      >
        <MessageSquare className="w-4 h-4" />
        Envoyer un message
      </Link>
    )
  }

  // If logged in, show button that opens modal
  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="btn-secondary w-full text-center flex items-center justify-center gap-2"
      >
        <MessageSquare className="w-4 h-4" />
        Envoyer un message
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-slate-900 mb-2">
              Contacter {artisanName}
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              Envoyez un message directement à cet artisan
            </p>

            {success ? (
              <div className="bg-eco-50 border border-eco-200 text-eco-800 px-4 py-3 rounded-lg text-center">
                ✅ Message envoyé avec succès !
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input type="hidden" name="artisanId" value={artisanId} />

                <div>
                  <label className="label" htmlFor="message">
                    Votre message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    disabled={sending}
                    placeholder="Bonjour, je souhaite obtenir un devis pour..."
                    className="input-field resize-none"
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    disabled={sending}
                    className="btn-secondary flex-1"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={sending}
                    className="btn-primary flex-1"
                  >
                    {sending ? 'Envoi...' : 'Envoyer'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}
