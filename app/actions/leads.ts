'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { getSpecialtyFromWorkType } from '@/lib/data/specialties'
import { calculateLeadScore } from '@/src/lib/scoring'
import { ratelimit, getClientIdentifier } from '@/lib/rate-limit'

async function requireAuth() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  return user
}

// Get current user's artisan company ID
export async function getCurrentArtisanCompanyId() {
  try {
    const authUser = await requireAuth()
    const artisan = await prisma.artisanCompany.findFirst({
      where: { userId: authUser.id },
      select: { id: true },
    })
    return artisan?.id || null
  } catch (error) {
    console.error('Error getting artisan company ID:', error)
    return null
  }
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
    // Rate limiting
    const ip = await getClientIdentifier()
    const limit = await ratelimit.publicForm.limit(ip)
    if (!limit.success) {
      return { success: false, error: 'Trop de requêtes. Veuillez réessayer dans une minute.' }
    }

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

    // 4. Matching : artisans par spécialité + département
    const matchedArtisans = await prisma.artisanCompany.findMany({
      where: {
        department: data.zipCode.slice(0, 2),
        ...(specialtyId ? { specialties: { some: { id: specialtyId } } } : {}),
      },
      orderBy: { projectCount: 'desc' },
      take: 1,
    })

    const bestArtisanId = matchedArtisans[0]?.id

    // 5. Créer le lead avec artisan assigné si matché
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
        ...(bestArtisanId ? { artisanId: bestArtisanId } : {}),
      },
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
  try {
    const authUser = await requireAuth()
    const artisan = await prisma.artisanCompany.findFirst({
      where: { id: artisanId, userId: authUser.id },
      include: { specialties: true },
    })

    console.log('🔍 [getMatchedLeadsForArtisan] DEBUG:')
    console.log('  artisanId:', artisanId)
    console.log('  artisan found:', !!artisan)

    if (!artisan) {
      console.log('  ❌ No artisan found - returning empty array')
      return []
    }

    console.log('  artisan.name:', artisan.name)
    console.log('  artisan.department:', artisan.department || 'NOT SET')
    console.log('  artisan.specialties:', artisan.specialties.map(s => s.name).join(', ') || 'NONE')

    const specialtyIds = artisan.specialties.map((s) => s.id)

    // Build where clause: only filter by department/specialty if explicitly set
    const where: any = {
      purchasedById: null,
      artisanId: null,
    }

    // Only filter by department if artisan has one set
    if (artisan.department) {
      where.department = artisan.department
      console.log('  ✓ Filtering by department:', artisan.department)
    } else {
      console.log('  ℹ️  No department filter - showing ALL departments')
    }

    // Only filter by specialty if artisan has at least one
    if (specialtyIds.length > 0) {
      where.specialtyId = { in: specialtyIds }
      console.log('  ✓ Filtering by specialties:', specialtyIds)
    } else {
      console.log('  ℹ️  No specialty filter - showing ALL specialties')
    }

    console.log('  where clause:', JSON.stringify(where, null, 2))

    const leads = await prisma.lead.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { specialty: true },
    })

    console.log('  ✅ Found', leads.length, 'matching leads')
    console.log('  Lead IDs:', leads.map(l => l.id).slice(0, 5))

    return leads
  } catch (error) {
    console.error('Error in getMatchedLeadsForArtisan:', error)
    return []
  }
}

// Leads achetés / assignés à un artisan
export async function getArtisanLeads(artisanId: string) {
  try {
    const authUser = await requireAuth()
    const artisan = await prisma.artisanCompany.findFirst({
      where: { id: artisanId, userId: authUser.id },
    })
    if (!artisan) {
      console.log('getArtisanLeads: No artisan found')
      return []
    }

    return prisma.lead.findMany({
      where: {
        OR: [{ artisanId }, { purchasedById: artisanId }],
      },
      orderBy: { createdAt: 'desc' },
      include: { specialty: true, purchases: true },
    })
  } catch (error) {
    console.error('Error in getArtisanLeads:', error)
    return []
  }
}

export async function purchaseLead(artisanId: string, leadId: string) {
  try {
    // Authenticate user
    const authUser = await requireAuth()

    // Find artisan with explicit selection of credits field
    const artisan = await prisma.artisanCompany.findFirst({
      where: { id: artisanId, userId: authUser.id },
      select: {
        id: true,
        credits: true,
        name: true,
        userId: true
      }
    })

    if (!artisan) {
      return { success: false, error: 'Votre profil artisan n\'a pas été trouvé. Veuillez compléter votre profil.' }
    }

    // Verify credits field exists (should always be there with default 0)
    const currentCredits = artisan.credits ?? 0

    // Find the lead
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      select: {
        id: true,
        price: true,
        purchasedById: true,
        firstName: true,
        lastName: true,
        projectType: true
      }
    })

    if (!lead) {
      return { success: false, error: 'Ce lead n\'existe plus ou a été supprimé.' }
    }

    // Check if already purchased
    if (lead.purchasedById) {
      return { success: false, error: 'Ce lead a déjà été acheté par un autre artisan.' }
    }

    // Check credits
    const leadPrice = lead.price || 2000 // Default to 20€ if price missing
    if (currentCredits < leadPrice) {
      const needed = leadPrice / 100
      const current = currentCredits / 100
      return {
        success: false,
        error: `Crédits insuffisants. Vous avez ${current}€ de crédits, ce lead coûte ${needed}€. Rechargez votre compte pour continuer.`,
      }
    }

    // Execute purchase transaction
    await prisma.$transaction([
      prisma.artisanCompany.update({
        where: { id: artisanId },
        data: { credits: { decrement: leadPrice } },
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
        data: { leadId, artisanId, price: leadPrice },
      }),
    ])

    revalidatePath('/espace-pro')
    revalidatePath('/espace-pro/leads')

    return { success: true }
  } catch (error) {
    console.error('Error in purchaseLead:', error)
    const message = error instanceof Error ? error.message : 'Une erreur est survenue'
    return {
      success: false,
      error: `Impossible d'acheter ce lead : ${message}. Contactez le support si le problème persiste.`
    }
  }
}

export async function updateLeadStatus(leadId: string, status: string) {
  return prisma.lead.update({
    where: { id: leadId },
    data: { status: status as any },
  })
}
