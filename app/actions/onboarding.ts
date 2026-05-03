'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function completeOnboarding({
  userId,
  firstName,
  lastName,
  phone,
  skipCompany,
}: {
  userId: string
  firstName: string
  lastName: string
  phone: string
  skipCompany: boolean
}) {
  try {
    // Update or create profile
    await prisma.profile.upsert({
      where: { userId },
      create: {
        userId,
        firstName,
        lastName,
        phone,
      },
      update: {
        firstName,
        lastName,
        phone,
      },
    })

    // Mark onboarding as completed
    await prisma.user.update({
      where: { id: userId },
      data: { onboardingCompleted: true },
    })

    revalidatePath('/espace-pro')
    return { success: true }
  } catch (error) {
    console.error('Error completing onboarding:', error)
    throw new Error('Failed to complete onboarding')
  }
}
