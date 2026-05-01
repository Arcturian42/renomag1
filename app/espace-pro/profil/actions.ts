'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function saveProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Non authentifié' }

  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string
  const companyName = formData.get('companyName') as string
  const siret = formData.get('siret') as string
  const phone = formData.get('phone') as string
  const website = formData.get('website') as string
  const address = formData.get('address') as string
  const zipCode = formData.get('zipCode') as string
  const city = formData.get('city') as string
  const department = formData.get('department') as string
  const description = formData.get('description') as string
  const specialtyIds: string[] = JSON.parse((formData.get('specialtyIds') as string) || '[]')
  const certificationIds: string[] = JSON.parse((formData.get('certificationIds') as string) || '[]')

  // Update profile
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ first_name: firstName, last_name: lastName, phone })
    .eq('id', user.id)

  if (profileError) return { error: profileError.message }

  // Check if artisan company exists
  const { data: existing } = await supabase
    .from('artisan_companies')
    .select('id')
    .eq('user_id', user.id)
    .single()

  let artisanId: string

  if (existing) {
    const { error } = await supabase
      .from('artisan_companies')
      .update({ name: companyName, siret, phone, website, address, zip_code: zipCode, city, department, description })
      .eq('id', existing.id)
    if (error) return { error: error.message }
    artisanId = existing.id
  } else {
    const { data, error } = await supabase
      .from('artisan_companies')
      .insert({ user_id: user.id, name: companyName, siret, phone, website, address, zip_code: zipCode, city, department, description })
      .select('id')
      .single()
    if (error) return { error: error.message }
    artisanId = data.id

    // Set role to ARTISAN if not already
    await supabase.from('profiles').update({ role: 'ARTISAN' }).eq('id', user.id)
  }

  // Sync specialties
  await supabase.from('artisan_specialties').delete().eq('artisan_id', artisanId)
  if (specialtyIds.length > 0) {
    await supabase.from('artisan_specialties').insert(
      specialtyIds.map((specialty_id) => ({ artisan_id: artisanId, specialty_id }))
    )
  }

  // Sync certifications
  await supabase.from('artisan_certifications').delete().eq('artisan_id', artisanId)
  if (certificationIds.length > 0) {
    await supabase.from('artisan_certifications').insert(
      certificationIds.map((certification_id) => ({ artisan_id: artisanId, certification_id }))
    )
  }

  revalidatePath('/espace-pro/profil')
  revalidatePath('/espace-pro')
  return { success: true }
}
