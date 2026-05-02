'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'

async function requireAuth() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  return user
}

export async function sendMessage(receiverId: string, content: string) {
  try {
    const authUser = await requireAuth()
    if (!content.trim()) return { success: false, error: 'Message vide' }

    const message = await prisma.message.create({
      data: {
        senderId: authUser.id,
        receiverId,
        content: content.trim(),
      },
    })

    // Créer une notification pour le destinataire
    await prisma.notification.create({
      data: {
        userId: receiverId,
        title: 'Nouveau message',
        content: `Vous avez reçu un nouveau message.`,
        read: false,
      },
    })

    revalidatePath('/espace-pro/messages')
    revalidatePath('/espace-proprietaire/messages')

    return { success: true, data: message }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue'
    return { success: false, error: message }
  }
}

export async function getConversationMessages(partnerId: string) {
  const authUser = await requireAuth()
  return prisma.message.findMany({
    where: {
      OR: [
        { senderId: authUser.id, receiverId: partnerId },
        { senderId: partnerId, receiverId: authUser.id },
      ],
    },
    orderBy: { createdAt: 'asc' },
  })
}

export async function markMessagesAsRead(partnerId: string) {
  const authUser = await requireAuth()
  await prisma.message.updateMany({
    where: {
      senderId: partnerId,
      receiverId: authUser.id,
      read: false,
    },
    data: { read: true },
  })
  revalidatePath('/espace-pro/messages')
  revalidatePath('/espace-proprietaire/messages')
}
