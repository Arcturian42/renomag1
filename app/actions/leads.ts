'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { calculateLeadScore } from '@/src/lib/scoring'

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

    // Calculate score
    const score = calculateLeadScore({
      workTypes: data.workTypes,
      budget: data.budget,
      zipCode: data.zipCode,
      propertyType: data.propertyType ?? '',
      propertyYear: data.propertyYear ?? '',
      surface: data.surface ?? '',
      income: data.income,
    })

    const supabase = await createClient()

    const leadData = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      zipCode: data.zipCode,
      department: data.zipCode.slice(0, 2),
      projectType: data.workTypes.join(', '),
      description: data.message ?? null,
      budget: data.budget,
      score: score,
      status: 'NEW' as const,
    }

    const { data: inserted, error } = await supabase
      .from('Lead')
      .insert([leadData])
      .select()
      .single()

    if (error) {
      throw error
    }

    revalidatePath('/devis')
    revalidatePath('/admin/leads')

    return { success: true, data: inserted }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue'
    return { success: false, error: message }
  }
}
