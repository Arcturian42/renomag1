'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function login(formData: FormData) {
  const supabase = createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { data: authData, error } = await supabase.auth.signInWithPassword(data)

  if (error || !authData.user) {
    redirect('/connexion?error=' + encodeURIComponent(error?.message || 'Erreur de connexion'))
  }

  // Ensure user exists in Prisma (in case of auth reset or sync issue)
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

  revalidatePath('/', 'layout')

  // Redirect based on role
  if (dbUser.role === 'ADMIN') {
    redirect('/admin')
  } else if (dbUser.role === 'ARTISAN') {
    redirect('/espace-pro')
  } else {
    redirect('/espace-proprietaire')
  }
}

export async function signup(formData: FormData) {
  const supabase = createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const role = (formData.get('role') as string) || 'USER'
  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string
  const companyName = formData.get('companyName') as string
  const siret = formData.get('siret') as string

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

  if (error || !authData.user) {
    redirect('/inscription?error=' + encodeURIComponent(error?.message || "Erreur lors de l'inscription"))
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
        name: companyName,
        siret: siret || '00000000000000',
        address: '',
        city: '',
        zipCode: '',
        department: '',
      },
    })
  }

  revalidatePath('/', 'layout')
  redirect('/connexion?message=Vérifiez votre email pour confirmer votre compte.')
}

export async function logout() {
  const supabase = createClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/connexion')
}

export async function resetPassword(formData: FormData) {
  const supabase = createClient()
  const email = formData.get('email') as string

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/callback?next=/mot-de-passe-oublie`,
  })

  if (error) {
    redirect('/mot-de-passe-oublie?error=' + encodeURIComponent(error.message))
  }

  redirect('/mot-de-passe-oublie?message=Un email de réinitialisation a été envoyé.')
}
