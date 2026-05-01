'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function saveProfileInfo(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Non authentifié' }

  const { error } = await supabase
    .from('profiles')
    .update({
      first_name: formData.get('firstName') as string,
      last_name: formData.get('lastName') as string,
      phone: formData.get('phone') as string,
    })
    .eq('id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/espace-proprietaire/compte')
  return { success: true }
}
