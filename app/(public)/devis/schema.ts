import { z } from 'zod'

export const devisSchema = z.object({
  workTypes: z.array(z.string()).min(1, 'Sélectionnez au moins un type de travaux'),
  budget: z.string().min(1, 'Le budget est requis'),
  zipCode: z.string().regex(/^\d{5}$/, 'Code postal invalide (5 chiffres requis)'),
  city: z.string().optional(),
  propertyType: z.string().optional(),
  propertyYear: z.string().optional(),
  surface: z.string().optional(),
  income: z.enum(['modeste', 'intermediaire', 'superieur'], {
    required_error: 'Sélectionnez votre tranche de revenus',
  }),
  firstName: z.string().min(1, 'Le prénom est requis').max(100),
  lastName: z.string().min(1, 'Le nom est requis').max(100),
  email: z.string().email('Email invalide').max(255),
  phone: z.string().min(1, 'Le téléphone est requis').max(50),
  message: z.string().max(2000).optional(),
})

export type DevisFormData = z.infer<typeof devisSchema>

export const travauxSchema = devisSchema.pick({ workTypes: true, budget: true })
export const logementSchema = devisSchema.pick({
  zipCode: true,
  city: true,
  propertyType: true,
  propertyYear: true,
  surface: true,
})
export const revenusSchema = devisSchema.pick({ income: true })
export const contactSchema = devisSchema.pick({
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  message: true,
})

export type TravauxData = z.infer<typeof travauxSchema>
export type LogementData = z.infer<typeof logementSchema>
export type RevenusData = z.infer<typeof revenusSchema>
export type ContactData = z.infer<typeof contactSchema>
