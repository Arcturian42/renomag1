'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export type Message = {
  id: string
  senderId: string
  receiverId: string
  content: string
  read: boolean
  createdAt: string
}

export function useRealtimeMessages(userId: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const supabase = createClient()

  useEffect(() => {
    if (!userId) return

    // Fetch initial messages
    const fetchMessages = async () => {
      const { data } = await supabase
        .from('Message')
        .select('*')
        .or(`senderId.eq.${userId},receiverId.eq.${userId}`)
        .order('createdAt', { ascending: false })
        .limit(100)
      if (data) setMessages(data as Message[])
    }
    fetchMessages()

    // Subscribe to realtime inserts
    const channel = supabase
      .channel(`messages:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'Message',
          filter: `receiverId=eq.${userId}`,
        },
        (payload) => {
          setMessages((prev) => [payload.new as Message, ...prev])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId, supabase])

  return messages
}
