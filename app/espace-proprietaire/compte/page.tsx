import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import CompteClient from './CompteClient'

export default async function ProprietaireComptePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/connexion')

  const { data: profile } = await supabase
    .from('profiles')
    .select('first_name, last_name, phone, address, zip_code')
    .eq('id', user.id)
    .single()

  return (
    <CompteClient
      email={user.email ?? ''}
      firstName={profile?.first_name ?? ''}
      lastName={profile?.last_name ?? ''}
      phone={profile?.phone ?? ''}
      zipCode={profile?.zip_code ?? ''}
    />
  )
}
