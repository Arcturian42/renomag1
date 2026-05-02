'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { MessageSquare } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function ArtisanMessageButton({ redirectUrl }: { redirectUrl: string }) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkUser() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    checkUser()
  }, [])

  if (loading) {
    return (
      <button className="btn-secondary w-full opacity-50 cursor-wait" disabled>
        <MessageSquare className="w-4 h-4" />
        Chargement...
      </button>
    )
  }

  const href = user ? '/espace-pro/messages' : `/connexion?redirect=${encodeURIComponent(redirectUrl)}`

  return (
    <Link
      href={href}
      className="btn-secondary w-full text-center flex items-center justify-center gap-2"
    >
      <MessageSquare className="w-4 h-4" />
      Envoyer un message
    </Link>
  )
}
