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

  // Validate email MX record
  const emailValidation = await validateEmail(email)
  if (!emailValidation.valid) {
    redirect('/inscription?error=' + encodeURIComponent(emailValidation.error ?? 'Email invalide'))
  }

  try {
    // Check if user already exists in database
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      redirect('/inscription?error=' + encodeURIComponent('Cette adresse email est déjà enregistrée. Veuillez vous connecter.'))
    }

    const { data: authData, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role,
          firstName,
          lastName,
        },
      },
    })

    if (error) {
      // Handle Supabase-specific errors
      if (error.message.includes('already registered') || error.message.includes('already exists')) {
        redirect('/inscription?error=' + encodeURIComponent('Cette adresse email est déjà enregistrée. Veuillez vous connecter.'))
      }
      redirect('/inscription?error=' + encodeURIComponent(error.message || "Erreur lors de l'inscription"))
    }

    if (!authData.user) {
      redirect('/inscription?error=' + encodeURIComponent("Erreur lors de l'inscription. Veuillez réessayer."))
    }

    // Create Prisma user record
    const dbUser = await prisma.user.create({
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

    // If artisan, create the company record
    if (role === 'ARTISAN' && companyName) {
      await prisma.artisanCompany.create({
        data: {
          userId: dbUser.id,
          slug: slugify(companyName),
          name: companyName,
          siret: siret || '00000000000000',
          address: '',
          city: '',
          zipCode: '',
          department: '',
        },
      })
    }

    // Sync role to Supabase Auth metadata for middleware access
    await supabase.auth.updateUser({ data: { role: dbUser.role } })

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

    console.error('Error in signup:', error)
    // Check if it's a unique constraint error
    if (error && typeof error === 'object' && 'code' in error) {
      const prismaError = error as { code: string; meta?: { target?: string[] } }
      if (prismaError.code === 'P2002') {
        redirect('/inscription?error=' + encodeURIComponent('Cette adresse email est déjà enregistrée. Veuillez vous connecter.'))
      }
    }
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
