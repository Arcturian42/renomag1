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

// Simulation : ajouter des crédits et/ou activer l'abonnement
export async function simulateTopUp(creditsToAdd: number) {
  'use server'
  return _simulateTopUp(creditsToAdd)
}

export async function simulateTopUpForm() {
  'use server'
  await _simulateTopUp(100)
}

async function _simulateTopUp(creditsToAdd: number) {
  try {
    const authUser = await requireAuth()
    const dbUser = await prisma.user.findUnique({
      where: { id: authUser.id },
      include: { artisan: true },
    })

    if (!dbUser || !dbUser.artisan) {
      return { success: false, error: 'Artisan non trouvé' }
    }

    const artisan = dbUser.artisan

    // Ajouter les crédits
    await prisma.artisanCompany.update({
      where: { id: artisan.id },
      data: { credits: { increment: creditsToAdd * 100 } },
    })

    // Créer ou mettre à jour l'abonnement
    const now = new Date()
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)

    await prisma.subscription.upsert({
      where: { artisanId: artisan.id },
      update: {
        status: 'active',
        expiresAt: nextMonth,
      },
      create: {
        artisanId: artisan.id,
        plan: 'pro',
        status: 'active',
        priceMonthly: 1999,
        articlesQuota: 1,
        expiresAt: nextMonth,
      },
    })

    revalidatePath('/espace-pro')
    revalidatePath('/espace-pro/abonnement')

    return { success: true }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue'
    return { success: false, error: message }
  }
}
