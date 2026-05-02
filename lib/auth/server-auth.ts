import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { Role } from '@prisma/client'

export const ROLE_ROUTES: Record<string, Role[]> = {
  '/admin': [Role.ADMIN],
  '/espace-pro': [Role.ARTISAN],
  '/espace-proprietaire': [Role.USER, Role.ADMIN],
}

export async function getCurrentUser() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  return user
}

export async function getCurrentUserRole(): Promise<Role | null> {
  const user = await getCurrentUser()
  if (!user?.email) return null

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email },
    select: { role: true },
  })

  return dbUser?.role ?? null
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/connexion')
  }
  return user
}

export async function requireRole(
  pathname: string,
  allowedRoles: Role[]
): Promise<{ user: NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>; role: Role }> {
  const user = await requireAuth()
  const role = await getCurrentUserRole()

  if (!role) {
    redirect('/connexion?error=no_role')
  }

  if (!allowedRoles.includes(role)) {
    // Rediriger vers l'espace approprié selon le rôle
    if (role === Role.ADMIN) {
      redirect('/admin')
    } else if (role === Role.ARTISAN) {
      redirect('/espace-pro')
    } else {
      redirect('/espace-proprietaire')
    }
  }

  return { user, role }
}

export function getAllowedRolesForPath(pathname: string): Role[] | null {
  for (const [route, roles] of Object.entries(ROLE_ROUTES)) {
    if (pathname.startsWith(route)) {
      return roles
    }
  }
  return null
}
