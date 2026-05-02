'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { getSpecialtyFromWorkType } from '@/lib/data/specialties'
import { calculateLeadScore } from '@/src/lib/scoring'

async function requireAuth() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  return user
}

const leadSchema = z.object({
  firstName: z.string().min(1, 'Le prénom est requis').max(100),
  lastName: z.string().min(1, 'Le nom est requis').max(100),
  email: z.string().email('Email invalide').max(255),
  phone: z.string().min(1, 'Le téléphone est requis').max(50),
  zipCode: z.string().regex(/^\d{5}$/, 'Code postal invalide (5 chiffres requis)'),
  city: z.string().optional(),
  workTypes: z.array(z.string()).min(1, 'Sélectionnez au moins un type de travaux'),
  budget: z.string().min(1, 'Le budget est requis'),
  propertyType: z.string().optional(),
  propertyYear: z.string().optional(),
  surface: z.string().optional(),
  income: z.enum(['modeste', 'intermediaire', 'superieur']),
  message: z.string().max(2000).optional(),
  isContactRequested: z.boolean().optional(),
})

export type LeadFormData = z.infer<typeof leadSchema>

export async function submitLead(formData: unknown) {
  try {
    const parsed = leadSchema.safeParse(formData)

    if (!parsed.success) {
      return {
        success: false,
        error: 'Données invalides',
        fieldErrors: parsed.error.flatten().fieldErrors,
      }
    }

    const data = parsed.data

    // 1. Calculer le score
    const score = calculateLeadScore({
      workTypes: data.workTypes,
      budget: data.budget,
      zipCode: data.zipCode,
      propertyType: data.propertyType ?? '',
      propertyYear: data.propertyYear ?? '',
      surface: data.surface ?? '',
      income: data.income,
    })

    // 2. Déterminer la spécialité (premier workType)
    const specialtyMapping = getSpecialtyFromWorkType(data.workTypes[0])
    let specialtyId: string | undefined

    if (specialtyMapping) {
      const specialty = await prisma.specialty.upsert({
        where: { slug: specialtyMapping.slug },
        update: {},
        create: { name: specialtyMapping.name, slug: specialtyMapping.slug },
      })
      specialtyId = specialty.id
    }

    // 3. Déterminer température et prix
    const isContactRequested = data.isContactRequested ?? false
    const temperature = isContactRequested ? 'HOT' : 'COLD'
    const price = isContactRequested ? 7000 : 2000

    // 4. Créer le lead
    const lead = await prisma.lead.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        zipCode: data.zipCode,
        city: data.city,
        department: data.zipCode.slice(0, 2),
        projectType: data.workTypes.join(', '),
        description: data.message ?? null,
        budget: data.budget,
        score,
        status: 'NEW',
        temperature,
        price,
        isContactRequested,
        specialtyId,
      },
    })

    // 5. Matching : artisans par spécialité + département
    const matchedArtisans = await prisma.artisanCompany.findMany({
      where: {
        department: lead.department,
        ...(specialtyId ? { specialties: { some: { id: specialtyId } } } : {}),
      },
      include: { user: true },
    })

    // 6. Notifications pour artisans matchés
    if (matchedArtisans.length > 0) {
      await prisma.notification.createMany({
        data: matchedArtisans.map((artisan) => ({
          userId: artisan.userId,
          title: 'Nouveau lead disponible',
          content: `Un projet "${lead.projectType}" dans le ${lead.department} correspond à vos spécialités. Prix : ${price / 100}€`,
          read: false,
        })),
      })
    }

    revalidatePath('/devis')
    revalidatePath('/admin/leads')
    revalidatePath('/espace-pro')

    return { success: true, data: lead }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue'
    console.error('submitLead error:', message)
    return { success: false, error: message }
  }
}

// Leads disponibles (matchés mais non encore achetés)
export async function getMatchedLeadsForArtisan(artisanId: string) {
  const authUser = await requireAuth()
  const artisan = await prisma.artisanCompany.findFirst({
    where: { id: artisanId, userId: authUser.id },
    include: { specialties: true },
  })
  if (!artisan) return []

  const specialtyIds = artisan.specialties.map((s) => s.id)
  if (specialtyIds.length === 0) return []

  return prisma.lead.findMany({
    where: {
      department: artisan.department,
      specialtyId: { in: specialtyIds },
      purchasedById: null,
      artisanId: null,
    },
    orderBy: { createdAt: 'desc' },
    include: { specialty: true },
  })
}

// Leads achetés / assignés à un artisan
export async function getArtisanLeads(artisanId: string) {
  const authUser = await requireAuth()
  const artisan = await prisma.artisanCompany.findFirst({
    where: { id: artisanId, userId: authUser.id },
  })
  if (!artisan) throw new Error('Forbidden')

  return prisma.lead.findMany({
    where: {
      OR: [{ artisanId }, { purchasedById: artisanId }],
    },
    orderBy: { createdAt: 'desc' },
    include: { specialty: true, purchases: true },
  })
}

export async function purchaseLead(artisanId: string, leadId: string) {
  try {
    const authUser = await requireAuth()
    const artisan = await prisma.artisanCompany.findFirst({
      where: { id: artisanId, userId: authUser.id },
    })
    if (!artisan) return { success: false, error: 'Artisan non trouvé' }

    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
    })
    if (!lead) return { success: false, error: 'Lead non trouvé' }

    if (lead.purchasedById) {
      return { success: false, error: 'Ce lead a déjà été acheté' }
    }

    if (artisan.credits < lead.price) {
      return {
        success: false,
        error: `Crédits insuffisants. Prix : ${lead.price / 100}€`,
      }
    }

    await prisma.$transaction([
      prisma.artisanCompany.update({
        where: { id: artisanId },
        data: { credits: { decrement: lead.price } },
      }),
      prisma.lead.update({
        where: { id: leadId },
        data: {
          purchasedById: artisanId,
          artisanId,
          status: 'CONTACTED',
        },
      }),
      prisma.leadPurchase.create({
        data: { leadId, artisanId, price: lead.price },
      }),
    ])

    revalidatePath('/espace-pro')
    revalidatePath('/espace-pro/leads')

    return { success: true }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue'
    return { success: false, error: message }
  }
}

export async function updateLeadStatus(leadId: string, status: string) {
  return prisma.lead.update({
    where: { id: leadId },
    data: { status: status as any },
  })
}
