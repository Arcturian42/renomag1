'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createProject({
  leadId,
  ownerId,
  artisanId,
  startDate,
  endDate,
  finalPrice,
}: {
  leadId: string
  ownerId: string
  artisanId: string
  startDate?: Date
  endDate?: Date
  finalPrice?: number
}) {
  try {
    const project = await prisma.project.create({
      data: {
        leadId,
        ownerId,
        artisanId,
        status: 'QUOTE_REQUESTED',
        startDate: startDate || null,
        endDate: endDate || null,
        finalPrice: finalPrice || null,
      },
      include: { lead: true, artisan: true, owner: true },
    })

    revalidatePath('/espace-proprietaire/mon-projet')
    revalidatePath('/espace-pro/projets')
    return { success: true, data: project }
  } catch (err: any) {
    console.error('createProject error:', err)
    return { success: false, error: err.message || 'Erreur serveur' }
  }
}

export async function getProjectById(projectId: string) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { lead: true, artisan: true, owner: { include: { profile: true } }, documents: true },
    })
    if (!project) return { success: false, error: 'Projet introuvable' }
    return { success: true, data: project }
  } catch (err: any) {
    console.error('getProjectById error:', err)
    return { success: false, error: err.message || 'Erreur serveur' }
  }
}

export async function getProjectByLeadId(leadId: string) {
  try {
    const project = await prisma.project.findUnique({
      where: { leadId },
      include: { lead: true, artisan: true, owner: { include: { profile: true } }, documents: true },
    })
    if (!project) return { success: false, error: 'Projet introuvable' }
    return { success: true, data: project }
  } catch (err: any) {
    console.error('getProjectByLeadId error:', err)
    return { success: false, error: err.message || 'Erreur serveur' }
  }
}

export async function getProjectsByOwner(ownerId: string) {
  try {
    const projects = await prisma.project.findMany({
      where: { ownerId },
      include: { lead: true, artisan: true, documents: true },
      orderBy: { createdAt: 'desc' },
    })
    return { success: true, data: projects }
  } catch (err: any) {
    console.error('getProjectsByOwner error:', err)
    return { success: false, error: err.message || 'Erreur serveur' }
  }
}

export async function getProjectsByArtisan(artisanId: string) {
  try {
    const projects = await prisma.project.findMany({
      where: { artisanId },
      include: { lead: true, owner: { include: { profile: true } }, documents: true },
      orderBy: { createdAt: 'desc' },
    })
    return { success: true, data: projects }
  } catch (err: any) {
    console.error('getProjectsByArtisan error:', err)
    return { success: false, error: err.message || 'Erreur serveur' }
  }
}

export async function updateProjectStatus(projectId: string, status: 'QUOTE_REQUESTED' | 'QUOTES_RECEIVED' | 'QUOTE_ACCEPTED' | 'WORK_SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'REVIEWED' | 'CANCELLED') {
  try {
    const project = await prisma.project.update({
      where: { id: projectId },
      data: { status },
    })
    revalidatePath('/espace-proprietaire/mon-projet')
    revalidatePath('/espace-pro/projets')
    return { success: true, data: project }
  } catch (err: any) {
    console.error('updateProjectStatus error:', err)
    return { success: false, error: err.message || 'Erreur serveur' }
  }
}

export async function updateProjectDates(
  projectId: string,
  data: { startDate?: Date; endDate?: Date; finalPrice?: number }
) {
  try {
    const project = await prisma.project.update({
      where: { id: projectId },
      data: {
        startDate: data.startDate || undefined,
        endDate: data.endDate || undefined,
        finalPrice: data.finalPrice || undefined,
      },
    })
    revalidatePath('/espace-proprietaire/mon-projet')
    revalidatePath('/espace-pro/projets')
    return { success: true, data: project }
  } catch (err: any) {
    console.error('updateProjectDates error:', err)
    return { success: false, error: err.message || 'Erreur serveur' }
  }
}

export async function addProjectReview(projectId: string, rating: number, review: string) {
  try {
    const project = await prisma.project.update({
      where: { id: projectId },
      data: { rating, review, status: 'REVIEWED' },
      include: { artisan: true },
    })

    // Update artisan rating
    if (project.artisan) {
      const allProjects = await prisma.project.findMany({
        where: { artisanId: project.artisanId, rating: { not: null } },
      })
      const avgRating = allProjects.length > 0
        ? allProjects.reduce((sum, p) => sum + (p.rating || 0), 0) / allProjects.length
        : 0

      await prisma.artisanCompany.update({
        where: { id: project.artisanId },
        data: {
          rating: Math.round(avgRating * 10) / 10,
          reviewCount: allProjects.length,
        },
      })
    }

    revalidatePath('/espace-proprietaire/mon-projet')
    return { success: true, data: project }
  } catch (err: any) {
    console.error('addProjectReview error:', err)
    return { success: false, error: err.message || 'Erreur serveur' }
  }
}
