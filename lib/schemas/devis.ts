import { z } from 'zod'

export const devisSchema = z.object({
  workTypes: z.array(z.string()).min(1, 'Sélectionnez au moins un type de travaux'),
  budget: z.string().min(1, 'Sélectionnez un budget estimé'),
  zipCode: z.string().regex(/^\d{5}$/, 'Code postal invalide (5 chiffres)'),
  city: z.string().optional(),
  propertyType: z.string().min(1, 'Sélectionnez un type de logement'),
  propertyYear: z.string().min(1, 'Sélectionnez une année de construction'),
  surface: z.string().min(1, 'Sélectionnez une surface'),
  income: z.enum(['modeste', 'intermediaire', 'superieur'], {
    required_error: 'Sélectionnez une tranche de revenus',
  }),
  firstName: z.string().min(1, 'Le prénom est requis').max(100),
  lastName: z.string().min(1, 'Le nom est requis').max(100),
  email: z.string().email('Email invalide').max(255),
  phone: z.string().min(1, 'Le téléphone est requis').max(50),
  message: z.string().max(2000).optional(),
})

export type DevisFormData = z.infer<typeof devisSchema>

export const stepValidation = {
  travaux: devisSchema.pick({ workTypes: true, budget: true }),
  logement: devisSchema.pick({
    zipCode: true,
    propertyType: true,
    propertyYear: true,
    surface: true,
  }),
  revenus: devisSchema.pick({ income: true }),
  contact: devisSchema.pick({
    firstName: true,
    lastName: true,
    email: true,
    phone: true,
    message: true,
  }),
}

// Array indexed by step order for per-step validation
export const stepSchemas = [
  stepValidation.travaux,
  stepValidation.logement,
  stepValidation.revenus,
  stepValidation.contact,
  z.object({}),
]
