import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { Role } from '@prisma/client'
import { slugify } from '@/lib/utils'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  if (!code) {
    redirect('/connexion?error=' + encodeURIComponent('Code OAuth manquant'))
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    redirect('/connexion?error=' + encodeURIComponent(error.message))
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email) {
    redirect('/connexion?error=' + encodeURIComponent('Utilisateur non trouvé'))
  }

  const cookieStore = cookies()
  const oauthUserType = cookieStore.get('oauth_user_type')?.value

  // Check if user already exists in Prisma
  let dbUser = await prisma.user.findUnique({
    where: { email: user.email },
  })

  if (!dbUser) {
    // New OAuth user — determine role from cookie or default to USER
    const role: Role = oauthUserType === 'pro' ? 'ARTISAN' : 'USER'
    const fullName =
      (user.user_metadata?.full_name as string) ||
      (user.user_metadata?.name as string) ||
      ''
    const givenName = (user.user_metadata?.given_name as string) || ''
    const familyName = (user.user_metadata?.family_name as string) || ''

    const firstName = givenName || fullName.split(' ')[0] || null
    const lastName =
      familyName || fullName.split(' ').slice(1).join(' ') || null

    dbUser = await prisma.user.create({
      data: {
        id: user.id,
        email: user.email,
        role,
        status: 'active',
        source: 'Google OAuth',
        profile:
          firstName || lastName
            ? {
                create: {
                  firstName,
                  lastName,
                },
              }
            : undefined,
      },
    })

    // If artisan, create a minimal company record so they can access their space
    if (role === 'ARTISAN') {
      await prisma.artisanCompany.create({
        data: {
          userId: dbUser.id,
          slug: slugify(
            (user.email.split('@')[0] || 'artisan') + '-' + dbUser.id.slice(0, 4)
          ),
          name: fullName || 'Mon entreprise',
          siret: '00000000000000',
          address: '',
          city: '',
          zipCode: '',
          department: '',
        },
      })
    }
  }

  // Clean up OAuth type cookie
  cookieStore.set('oauth_user_type', '', { maxAge: 0, path: '/' })

  // Sync role to Supabase Auth metadata for middleware access
  if (dbUser.role) {
    await supabase.auth.updateUser({ data: { role: dbUser.role } })
  }

  // Redirect based on role
  if (dbUser.role === 'ADMIN') {
    redirect('/admin')
  } else if (dbUser.role === 'ARTISAN') {
    redirect('/espace-pro')
  } else {
    redirect('/espace-proprietaire')
  }
}
