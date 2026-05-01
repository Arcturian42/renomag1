'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

/**
 * Find artisans that match a lead based on department and specialty.
 * Returns ranked list (exact department match first, then specialty match).
 */
export async function findMatchingArtisans(leadId: string) {
  try {
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: { specialty: true },
    })

    if (!lead) return { success: false, error: 'Lead introuvable' }

    const artisans = await prisma.artisanCompany.findMany({
      where: {
        available: true,
        verified: true,
        deletedAt: null,
      },
      include: { specialties: true, user: true },
    })

    const scored = artisans.map((artisan) => {
      let score = 0
      // Exact department match = 10 pts
      if (artisan.department === lead.department) score += 10
      // Same region = 3 pts
      else if (artisan.region && lead.city && artisan.region.includes(lead.department.slice(0, 2))) score += 3

      // Specialty match = 5 pts
      if (lead.specialtyId && artisan.specialties.some((s) => s.id === lead.specialtyId)) {
        score += 5
      }
      // Project type keyword match = 2 pts
      if (lead.projectType && artisan.specialties.some((s) => lead.projectType.toLowerCase().includes(s.name.toLowerCase()))) {
        score += 2
      }

      return { artisan, score }
    })

    scored.sort((a, b) => b.score - a.score)

    return {
      success: true,
      data: scored.filter((s) => s.score > 0).map((s) => ({
        id: s.artisan.id,
        name: s.artisan.name,
        city: s.artisan.city,
        department: s.artisan.department,
        specialties: s.artisan.specialties.map((sp) => sp.name),
        score: s.score,
        userId: s.artisan.userId,
      })),
    }
  } catch (err: any) {
    console.error('findMatchingArtisans error:', err)
    return { success: false, error: err.message || 'Erreur serveur' }
  }
}

/**
 * Assign a lead to a specific artisan and record the assignment.
 */
export async function assignLeadToArtisan(leadId: string, artisanId: string, reason?: string) {
  try {
    const [updatedLead, assignment] = await prisma.$transaction([
      prisma.lead.update({
        where: { id: leadId },
        data: { artisanId },
      }),
      prisma.leadAssignment.create({
        data: {
          leadId,
          artisanId,
          reason: reason || 'Auto-assigned by matching algorithm',
        },
      }),
    ])

    revalidatePath('/admin/leads')
    revalidatePath('/espace-pro/leads')
    return { success: true, data: { lead: updatedLead, assignment } }
  } catch (err: any) {
    console.error('assignLeadToArtisan error:', err)
    return { success: false, error: err.message || 'Erreur serveur' }
  }
}

/**
 * Get unassigned leads that match an artisan's department and specialties.
 */
export async function getPotentialLeads(artisanId: string) {
  try {
    const artisan = await prisma.artisanCompany.findUnique({
      where: { id: artisanId },
      include: { specialties: true },
    })

    if (!artisan) return { success: false, error: 'Artisan introuvable' }

    const specialtyIds = artisan.specialties.map((s) => s.id)

    const leads = await prisma.lead.findMany({
      where: {
        artisanId: null,
        deletedAt: null,
        OR: [
          { department: artisan.department },
          ...(specialtyIds.length > 0 ? [{ specialtyId: { in: specialtyIds } }] : []),
        ],
      },
      orderBy: { createdAt: 'desc' },
      include: { specialty: true },
    })

    return { success: true, data: leads }
  } catch (err: any) {
    console.error('getPotentialLeads error:', err)
    return { success: false, error: err.message || 'Erreur serveur' }
  }
}

/**
 * Artisan accepts a lead assignment.
 */
export async function acceptLeadAssignment(leadId: string, artisanId: string) {
  try {
    await prisma.leadAssignment.updateMany({
      where: { leadId, artisanId },
      data: { accepted: true, acceptedAt: new Date() },
    })

    await prisma.lead.update({
      where: { id: leadId },
      data: { artisanId, status: 'CONTACTED' },
    })

    revalidatePath('/espace-pro/leads')
    return { success: true }
  } catch (err: any) {
    console.error('acceptLeadAssignment error:', err)
    return { success: false, error: err.message || 'Erreur serveur' }
  }
}

/**
 * Artisan declines a lead assignment.
 */
export async function declineLeadAssignment(leadId: string, artisanId: string, reason?: string) {
  try {
    await prisma.leadAssignment.updateMany({
      where: { leadId, artisanId },
      data: { accepted: false, reason: reason || 'Refusé par l\'artisan' },
    })

    revalidatePath('/espace-pro/leads')
    return { success: true }
  } catch (err: any) {
    console.error('declineLeadAssignment error:', err)
    return { success: false, error: err.message || 'Erreur serveur' }
  }
}
