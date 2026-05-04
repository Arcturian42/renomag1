'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'

// ==================== AUTH HELPERS ====================

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } })
  if (!dbUser || dbUser.role !== 'ADMIN') throw new Error('Forbidden: admin access required')

  return dbUser
}

// ==================== USER MANAGEMENT ====================

export async function suspendUser(userId: string) {
  await requireAdmin()

  await prisma.user.update({
    where: { id: userId },
    data: { status: 'suspended' },
  })

  revalidatePath('/admin/utilisateurs')
  return { success: true }
}

export async function unsuspendUser(userId: string) {
  await requireAdmin()

  await prisma.user.update({
    where: { id: userId },
    data: { status: 'active' },
  })

  revalidatePath('/admin/utilisateurs')
  return { success: true }
}

export async function deleteUserAdmin(userId: string) {
  await requireAdmin()

  // Delete related data first
  await prisma.profile.deleteMany({ where: { userId } })
  await prisma.artisanCompany.deleteMany({ where: { userId } })
  await prisma.notification.deleteMany({ where: { userId } })
  await prisma.projectDocument.deleteMany({ where: { userId } })

  // Delete user
  await prisma.user.delete({ where: { id: userId } })

  revalidatePath('/admin/utilisateurs')
  return { success: true }
}

// ==================== ARTISAN MANAGEMENT ====================

export async function verifyArtisan(formData: FormData) {
  'use server'

  try {
    await requireAdmin()

    const artisanId = formData.get('artisanId') as string
    if (!artisanId) {
      throw new Error('Artisan ID is required')
    }

    await prisma.artisanCompany.update({
      where: { id: artisanId },
      data: { verified: true },
    })

    revalidatePath('/admin/artisans')
  } catch (error) {
    console.error('Error verifying artisan:', error)
    throw error
  }
}

export async function unverifyArtisan(formData: FormData) {
  'use server'

  try {
    await requireAdmin()

    const artisanId = formData.get('artisanId') as string
    if (!artisanId) {
      throw new Error('Artisan ID is required')
    }

    await prisma.artisanCompany.update({
      where: { id: artisanId },
      data: { verified: false },
    })

    revalidatePath('/admin/artisans')
  } catch (error) {
    console.error('Error unverifying artisan:', error)
    throw error
  }
}

export async function togglePremiumArtisan(artisanId: string) {
  try {
    await requireAdmin()

    const artisan = await prisma.artisanCompany.findUnique({ where: { id: artisanId } })
    if (!artisan) {
      return { success: false, error: 'Artisan not found' }
    }

    await prisma.artisanCompany.update({
      where: { id: artisanId },
      data: { premium: !artisan.premium },
    })

    revalidatePath('/admin/artisans')
    return { success: true }
  } catch (error) {
    console.error('Error toggling premium status:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Failed to toggle premium status' }
  }
}

export async function toggleFeaturedArtisan(artisanId: string) {
  try {
    await requireAdmin()

    const artisan = await prisma.artisanCompany.findUnique({ where: { id: artisanId } })
    if (!artisan) {
      return { success: false, error: 'Artisan not found' }
    }

    await prisma.artisanCompany.update({
      where: { id: artisanId },
      data: { isFeatured: !artisan.isFeatured },
    })

    revalidatePath('/admin/artisans')
    revalidatePath('/admin/parametres')
    return { success: true }
  } catch (error) {
    console.error('Error toggling featured status:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Failed to toggle featured status' }
  }
}

// ==================== LEAD MANAGEMENT ====================

export async function assignLeadToArtisan(leadId: string, artisanId: string) {
  await requireAdmin()

  await prisma.lead.update({
    where: { id: leadId },
    data: { artisanId },
  })

  revalidatePath('/admin/leads')
  return { success: true }
}

export async function updateLeadScore(leadId: string, score: number) {
  await requireAdmin()

  await prisma.lead.update({
    where: { id: leadId },
    data: { score },
  })

  revalidatePath('/admin/leads')
  return { success: true }
}

export async function updateLeadTemperature(leadId: string, temperature: 'HOT' | 'COLD') {
  await requireAdmin()

  await prisma.lead.update({
    where: { id: leadId },
    data: { temperature },
  })

  revalidatePath('/admin/leads')
  return { success: true }
}

// ==================== SETTINGS ====================

export async function updateLeadPricing(hotPrice: number, coldPrice: number) {
  await requireAdmin()

  await prisma.setting.upsert({
    where: { key: 'lead_pricing' },
    create: {
      key: 'lead_pricing',
      value: JSON.stringify({ hot: hotPrice, cold: coldPrice }),
    },
    update: {
      value: JSON.stringify({ hot: hotPrice, cold: coldPrice }),
    },
  })

  revalidatePath('/admin/parametres')
  return { success: true }
}

export async function getLeadPricing() {
  const setting = await prisma.setting.findUnique({ where: { key: 'lead_pricing' } })
  if (!setting) return { hot: 70, cold: 20 }
  return JSON.parse(setting.value)
}
