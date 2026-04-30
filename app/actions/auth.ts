'use server'

import { prisma } from '@/lib/prisma'
import { Role } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

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
