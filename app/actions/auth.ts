'use server'

import { prisma } from '@/lib/prisma'
import { Role } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { validateEmail } from '@/lib/email-validation'
import { slugify } from '@/lib/utils'

export async function getUserRoleByEmail(email: string): Promise<Role | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { role: true },
    })
    return user?.role ?? null
  } catch {
    return null
  }
}

export async function createUserInDb({
  email,
  role = Role.USER,
}: {
  email: string
  role?: Role
}) {
  try {
    const existing = await prisma.user.findUnique({
      where: { email },
    })

    if (existing) {
      return { success: true, user: existing }
    }

    const user = await prisma.user.create({
      data: {
        email,
        role,
        status: 'active',
        source: 'Direct',
      },
    })

    revalidatePath('/admin/utilisateurs')
    return { success: true, user }
  } catch (error) {
    console.error('Error creating user in DB:', error)
    return { success: false, error: 'Failed to create user' }
  }
}

export async function getRedirectPathForRole(role: Role | null): Promise<string> {
  if (role === Role.ADMIN) return '/admin'
  if (role === Role.ARTISAN) return '/espace-pro'
  return '/espace-proprietaire'
}

export async function requestPasswordReset(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://renomag.fr'}/reinitialiser-mot-de-passe`,
    })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erreur inconnue'
    return { success: false, error: message }
  }
}

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // Validate email MX record
  const emailValidation = await validateEmail(email)
  if (!emailValidation.valid) {
    redirect('/connexion?error=' + encodeURIComponent(emailValidation.error ?? 'Email invalide'))
  }

  const { data: authData, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error || !authData.user) {
    redirect('/connexion?error=' + encodeURIComponent(error?.message || 'Erreur de connexion'))
  }

  try {
    // Ensure user exists in Prisma
    let dbUser = await prisma.user.findUnique({
      where: { id: authData.user.id },
    })

    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          id: authData.user.id,
          email: authData.user.email!,
          role: 'USER',
        },
      })
    }

    // Sync role to Supabase Auth metadata for middleware access
    if (dbUser?.role) {
      await supabase.auth.updateUser({ data: { role: dbUser.role } })
    }

    revalidatePath('/', 'layout')

    if (dbUser.role === 'ADMIN') {
      redirect('/admin')
    } else if (dbUser.role === 'ARTISAN') {
      redirect('/espace-pro')
    } else {
      redirect('/espace-proprietaire')
    }
  } catch (error) {
    // Re-throw NEXT_REDIRECT errors (successful redirects are not errors)
    if (error && typeof error === 'object' && 'digest' in error && typeof error.digest === 'string' && error.digest.startsWith('NEXT_REDIRECT')) {
      throw error
    }

    console.error('Error in login:', error)
    redirect('/connexion?error=' + encodeURIComponent('Erreur lors de la connexion. Veuillez réessayer.'))
  }
}

export async function signup(formData: FormData) {
  try {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    // SECURITY: Only allow USER and ARTISAN roles from self-registration (no ADMIN)
    const requestedRole = (formData.get('role') as string) || 'USER'
    const role = requestedRole === 'ARTISAN' ? 'ARTISAN' : 'USER'
    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    const companyName = formData.get('companyName') as string
    const siret = formData.get('siret') as string

    // Validate inputs
    if (!email || !password) {
      redirect('/inscription?error=' + encodeURIComponent('Email et mot de passe requis'))
    }

    // Validate email MX record
    try {
      const emailValidation = await validateEmail(email)
      if (!emailValidation.valid) {
        redirect('/inscription?error=' + encodeURIComponent(emailValidation.error ?? 'Email invalide'))
      }
    } catch (emailError) {
      console.error('Email validation error:', emailError)
      // Continue anyway - don't block signup on email validation failure
    }

    try {
      // Check if user already exists in database
      const existingUser = await prisma.user.findUnique({
        where: { email },
      })

      if (existingUser) {
        redirect('/inscription?error=' + encodeURIComponent('Cette adresse email est déjà enregistrée. Veuillez vous connecter.'))
      }
    } catch (dbError) {
      console.error('Database check error:', dbError)
      redirect('/inscription?error=' + encodeURIComponent('Erreur de connexion à la base de données'))
    }

    // Create Supabase auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role,
          firstName: firstName || '',
          lastName: lastName || '',
        },
      },
    })

    if (authError) {
      console.error('Supabase auth error:', authError)
      if (authError.message.includes('already registered') || authError.message.includes('already exists')) {
        redirect('/inscription?error=' + encodeURIComponent('Cette adresse email est déjà enregistrée. Veuillez vous connecter.'))
      }
      redirect('/inscription?error=' + encodeURIComponent(authError.message || "Erreur lors de l'inscription"))
    }

    if (!authData.user) {
      redirect('/inscription?error=' + encodeURIComponent("Erreur lors de l'inscription. Veuillez réessayer."))
    }

    // Create Prisma user record
    let dbUser
    try {
      dbUser = await prisma.user.create({
        data: {
          id: authData.user.id,
          email: authData.user.email!,
          role: role === 'ARTISAN' ? 'ARTISAN' : 'USER',
          profile: firstName || lastName ? {
            create: {
              firstName: firstName || null,
              lastName: lastName || null,
            },
          } : undefined,
        },
      })
    } catch (userError) {
      console.error('Error creating user in database:', userError)
      redirect('/inscription?error=' + encodeURIComponent('Erreur lors de la création du compte'))
    }

    // If artisan, ALWAYS create the company record (required for dashboard)
    if (role === 'ARTISAN') {
      try {
        // Generate safe defaults for all required fields
        const safeCompanyName = companyName && companyName.trim()
          ? companyName.trim()
          : `Entreprise ${firstName || 'Artisan'} ${lastName || ''}`.trim()

        // Generate unique SIRET (use timestamp + random for uniqueness)
        const uniqueSiret = siret && siret.trim()
          ? siret.trim()
          : `TEMP${Date.now()}${Math.floor(Math.random() * 10000)}`

        // Generate unique slug (use company name + userId to avoid collisions)
        const baseSlug = slugify(safeCompanyName)
        const uniqueSlug = `${baseSlug}-${dbUser.id.substring(0, 8)}`

        await prisma.artisanCompany.create({
          data: {
            userId: dbUser.id,
            slug: uniqueSlug,
            name: safeCompanyName,
            siret: uniqueSiret,
            address: '',
            city: '',
            zipCode: '',
            department: '',
          },
        })
      } catch (companyError) {
        console.error('Error creating artisan company:', companyError)
        // If company creation fails, the artisan dashboard will show welcome screen
        // Don't fail the entire signup process
      }
    }

    // Sync role to Supabase Auth metadata for middleware access
    try {
      await supabase.auth.updateUser({ data: { role: dbUser.role } })
    } catch (updateError) {
      console.error('Error updating Supabase metadata:', updateError)
      // Continue anyway - not critical
    }

    revalidatePath('/', 'layout')

    // Redirect to appropriate dashboard based on role
    if (dbUser.role === 'ADMIN') {
      redirect('/admin')
    } else if (dbUser.role === 'ARTISAN') {
      redirect('/espace-pro')
    } else {
      redirect('/espace-proprietaire')
    }
  } catch (error) {
    // Re-throw NEXT_REDIRECT errors (successful redirects are not errors)
    if (error && typeof error === 'object' && 'digest' in error && typeof error.digest === 'string' && error.digest.startsWith('NEXT_REDIRECT')) {
      throw error
    }

    console.error('Unexpected error in signup:', error)

    // Check if it's a Prisma unique constraint error
    if (error && typeof error === 'object' && 'code' in error) {
      const prismaError = error as { code: string; meta?: { target?: string[] } }
      if (prismaError.code === 'P2002') {
        const target = prismaError.meta?.target?.[0]
        if (target === 'email') {
          redirect('/inscription?error=' + encodeURIComponent('Cette adresse email est déjà enregistrée'))
        } else if (target === 'siret') {
          redirect('/inscription?error=' + encodeURIComponent('Ce numéro SIRET est déjà enregistré'))
        } else {
          redirect('/inscription?error=' + encodeURIComponent('Ces informations sont déjà utilisées'))
        }
      }
    }

    // Generic error fallback
    redirect('/inscription?error=' + encodeURIComponent("Erreur lors de l'inscription. Veuillez réessayer."))
  }
}

export async function logout() {
  try {
    const supabase = await createClient()

    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Error during logout:', error)
      redirect('/connexion?error=' + encodeURIComponent('Erreur lors de la déconnexion'))
    }

    revalidatePath('/', 'layout')
    redirect('/connexion')
  } catch (error) {
    // Re-throw NEXT_REDIRECT errors (successful redirects are not errors)
    if (error && typeof error === 'object' && 'digest' in error && typeof error.digest === 'string' && error.digest.startsWith('NEXT_REDIRECT')) {
      throw error
    }

    console.error('Unexpected error in logout:', error)
    redirect('/connexion')
  }
}
