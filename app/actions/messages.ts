'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { sendNewMessageEmail } from './email'

export async function sendMessage({
  senderId,
  receiverId,
  content,
}: {
  senderId: string
  receiverId: string
  content: string
}) {
  try {
    const message = await prisma.message.create({
      data: {
        senderId,
        receiverId,
        content,
        read: false,
      },
    })

    // Send email notification (non-blocking)
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
      select: { email: true, profile: { select: { firstName: true } } },
    })

    if (receiver?.email) {
      const sender = await prisma.user.findUnique({
        where: { id: senderId },
        select: { profile: { select: { firstName: true, lastName: true } } },
      })
      const senderName = `${sender?.profile?.firstName ?? ''} ${sender?.profile?.lastName ?? ''}`.trim() || 'Un utilisateur'
      sendNewMessageEmail(receiver.email, senderName, content.slice(0, 100)).catch(() => {})
    }

    revalidatePath('/espace-pro/messages')
    revalidatePath('/espace-proprietaire/messages')
    return { success: true, message }
  } catch (error) {
    return { success: false, error: 'Failed to send message' }
  }
}

export async function markMessagesAsRead(senderId: string, receiverId: string) {
  try {
    await prisma.message.updateMany({
      where: {
        senderId,
        receiverId,
        read: false,
      },
      data: { read: true },
    })

    revalidatePath('/espace-pro/messages')
    revalidatePath('/espace-proprietaire/messages')
    return { success: true }
  } catch {
    return { success: false, error: 'Failed to mark as read' }
  }
}

export async function getConversation(userId: string, otherId: string) {
  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: otherId },
          { senderId: otherId, receiverId: userId },
        ],
      },
      orderBy: { createdAt: 'asc' },
      take: 200,
    })
    return messages
  } catch {
    return []
  }
}
