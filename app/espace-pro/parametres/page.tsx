import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ParametresClient from './ParametresClient'

export default async function EspaceProParametresPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/connexion')

  const { data: artisan } = await supabase
    .from('artisan_companies')
    .select('name, siret, address, city, zip_code')
    .eq('user_id', user.id)
    .single()

  return (
    <ParametresClient
      email={user.email ?? ''}
      companyName={artisan?.name ?? ''}
      siret={artisan?.siret ?? ''}
      address={artisan ? `${artisan.address}, ${artisan.zip_code} ${artisan.city}` : ''}
    />
  )
}
