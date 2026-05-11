'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { validateLength } from '@/lib/validation'

export async function updateArtisanProfile(formData: FormData) {
  'use server'

  try {
    console.log('[updateArtisanProfile] Starting profile update')

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      console.error('[updateArtisanProfile] No user found')
      redirect('/connexion')
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: { artisan: true },
    })

    if (!dbUser?.artisan) {
      console.error('[updateArtisanProfile] No artisan found for user')
      redirect('/espace-pro')
    }

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

    // Server-side validation
    if (name && !validateLength(name, 'name').valid) {
      redirect('/espace-pro/profil?error=1')
    }
    if (phone && !validateLength(phone, 'phone').valid) {
      redirect('/espace-pro/profil?error=1')
    }
    if (email && !validateLength(email, 'email').valid) {
      redirect('/espace-pro/profil?error=1')
    }
    if (address && !validateLength(address, 'address').valid) {
      redirect('/espace-pro/profil?error=1')
    }
    if (city && !validateLength(city, 'city').valid) {
      redirect('/espace-pro/profil?error=1')
    }
    if (zipCode && !validateLength(zipCode, 'zipCode').valid) {
      redirect('/espace-pro/profil?error=1')
    }
    if (description && !validateLength(description, 'description').valid) {
      redirect('/espace-pro/profil?error=1')
    }

    console.log('[updateArtisanProfile] Updating artisan:', dbUser.artisan.id)

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

    console.log('[updateArtisanProfile] ✅ Profile updated successfully')

    revalidatePath('/espace-pro/profil')
    revalidatePath('/annuaire')
    redirect('/espace-pro/profil?success=1')
  } catch (error) {
    console.error('[updateArtisanProfile] ❌ Error:', error)
    // If it's a redirect, re-throw it
    if (error && typeof error === 'object' && 'digest' in error) {
      throw error
    }
    // Otherwise redirect with error
    redirect('/espace-pro/profil?error=1')
  }
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

  // Server-side validation
  if (firstName && !validateLength(firstName, 'name').valid) {
    redirect('/espace-proprietaire/compte?error=1')
  }
  if (lastName && !validateLength(lastName, 'name').valid) {
    redirect('/espace-proprietaire/compte?error=1')
  }
  if (phone && !validateLength(phone, 'phone').valid) {
    redirect('/espace-proprietaire/compte?error=1')
  }
  if (address && !validateLength(address, 'address').valid) {
    redirect('/espace-proprietaire/compte?error=1')
  }
  if (city && !validateLength(city, 'city').valid) {
    redirect('/espace-proprietaire/compte?error=1')
  }
  if (zipCode && !validateLength(zipCode, 'zipCode').valid) {
    redirect('/espace-proprietaire/compte?error=1')
  }

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

export async function updateArtisanBillingInfo(formData: FormData) {
  'use server'

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      redirect('/connexion')
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: { artisan: true },
    })

    if (!dbUser?.artisan) {
      redirect('/espace-pro')
    }

    const siret = formData.get('siret') as string
    const billingAddress = formData.get('billingAddress') as string
    const tvaNumber = formData.get('tvaNumber') as string

    await prisma.artisanCompany.update({
      where: { id: dbUser.artisan.id },
      data: {
        ...(siret ? { siret } : {}),
        ...(billingAddress ? { billingAddress } : {}),
        ...(tvaNumber ? { tvaNumber } : {}),
      },
    })

    revalidatePath('/espace-pro/parametres')
    redirect('/espace-pro/parametres?success=billing')
  } catch (error) {
    console.error('[updateArtisanBillingInfo] Error:', error)
    // If it's a redirect, re-throw it
    if (error && typeof error === 'object' && 'digest' in error) {
      throw error
    }
    redirect('/espace-pro/parametres?error=billing')
  }
}
