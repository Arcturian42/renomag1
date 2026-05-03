'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'

export async function updateArtisanProfile(formData: FormData) {
  'use server'
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/connexion')

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: { artisan: true },
  })
  if (!dbUser?.artisan) redirect('/espace-pro')

  const name = formData.get('name') as string
  const phone = formData.get('phone') as string
  const email = formData.get('email') as string
  const address = formData.get('address') as string
  const city = formData.get('city') as string
  const zipCode = formData.get('zipCode') as string
  const website = formData.get('website') as string
  const googleBusinessUrl = formData.get('googleBusinessUrl') as string
  const description = formData.get('description') as string
  const departments = formData.get('departments') as string

  await prisma.artisanCompany.update({
    where: { id: dbUser.artisan.id },
    data: {
      ...(name ? { name } : {}),
      ...(phone ? { phone } : {}),
      ...(email ? { email } : {}),
      ...(address ? { address } : {}),
      ...(city ? { city } : {}),
      ...(zipCode ? { zipCode } : {}),
      ...(website ? { website } : {}),
      ...(googleBusinessUrl ? { googleBusinessUrl } : {}),
      ...(description ? { description } : {}),
      ...(departments ? { department: departments } : {}),
    },
  })

  revalidatePath('/espace-pro/profil')
  revalidatePath('/annuaire')
  redirect('/espace-pro/profil?success=1')
}

export async function updateOwnerProfile(formData: FormData) {
  'use server'
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/connexion')

  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string
  const phone = formData.get('phone') as string
  const address = formData.get('address') as string
  const city = formData.get('city') as string
  const zipCode = formData.get('zipCode') as string

  await prisma.profile.upsert({
    where: { userId: user.id },
    update: {
      ...(firstName ? { firstName } : {}),
      ...(lastName ? { lastName } : {}),
      ...(phone ? { phone } : {}),
      ...(address ? { address } : {}),
      ...(city ? { city } : {}),
      ...(zipCode ? { zipCode } : {}),
    },
    create: {
      userId: user.id,
      firstName: firstName || null,
      lastName: lastName || null,
      phone: phone || null,
      address: address || null,
      city: city || null,
      zipCode: zipCode || null,
    },
  })

  revalidatePath('/espace-proprietaire/compte')
  redirect('/espace-proprietaire/compte?success=1')
}
