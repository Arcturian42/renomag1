'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { logger } from '@/lib/logger'

const VALID_LEAD_STATUS = ['NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'REJECTED'] as const
type LeadStatus = (typeof VALID_LEAD_STATUS)[number]

export async function updateLeadStatus(id: string, status: LeadStatus) {
  try {
    if (!VALID_LEAD_STATUS.includes(status)) {
      return { success: false, error: 'Statut invalide' }
    }

    await prisma.lead.update({
      where: { id },
      data: { status },
    })

    revalidatePath('/dashboard-prive/leads')
    revalidatePath('/dashboard-prive/tableau-de-bord')
    revalidatePath('/dashboard-prive/repartition')
    return { success: true }
  } catch (error) {
    logger.error({ err: error }, 'updateLeadStatus error')
    return { success: false, error: 'Erreur lors de la mise à jour' }
  }
}

export async function deleteLead(id: string) {
  try {
    await prisma.lead.delete({ where: { id } })

    revalidatePath('/dashboard-prive/leads')
    revalidatePath('/dashboard-prive/tableau-de-bord')
    revalidatePath('/dashboard-prive/repartition')
    return { success: true }
  } catch (error) {
    logger.error({ err: error }, 'deleteLead error')
    return { success: false, error: 'Erreur lors de la suppression' }
  }
}

export async function updateUserStatus(id: string, status: 'active' | 'inactive') {
  try {
    await prisma.user.update({
      where: { id },
      data: { status },
    })

    revalidatePath('/dashboard-prive/utilisateurs')
    revalidatePath('/dashboard-prive/tableau-de-bord')
    return { success: true }
  } catch (error) {
    logger.error({ err: error }, 'updateUserStatus error')
    return { success: false, error: 'Erreur lors de la mise à jour' }
  }
}

export async function deleteUser(id: string) {
  try {
    await prisma.user.delete({ where: { id } })

    revalidatePath('/dashboard-prive/utilisateurs')
    revalidatePath('/dashboard-prive/tableau-de-bord')
    return { success: true }
  } catch (error) {
    logger.error({ err: error }, 'deleteUser error')
    return { success: false, error: 'Erreur lors de la suppression' }
  }
}
