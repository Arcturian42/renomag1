import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ProfilForm from './ProfilForm'

export default async function ProfilPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/connexion')

  const { data: profile } = await supabase
    .from('profiles')
    .select('first_name, last_name, phone')
    .eq('id', user.id)
    .single()

  const { data: artisan } = await supabase
    .from('artisan_companies')
    .select('*')
    .eq('user_id', user.id)
    .single()

  const { data: specialties } = await supabase
    .from('specialties')
    .select('id, name, slug')
    .order('name')

  const { data: certifications } = await supabase
    .from('certifications')
    .select('id, name, code')
    .order('name')

  const { data: artisanSpecialties } = artisan
    ? await supabase
        .from('artisan_specialties')
        .select('specialty_id')
        .eq('artisan_id', artisan.id)
    : { data: [] }

  const { data: artisanCertifications } = artisan
    ? await supabase
        .from('artisan_certifications')
        .select('certification_id')
        .eq('artisan_id', artisan.id)
    : { data: [] }

  return (
    <ProfilForm
      userId={user.id}
      profile={profile ?? { first_name: null, last_name: null, phone: null }}
      artisan={artisan ?? null}
      allSpecialties={specialties ?? []}
      allCertifications={certifications ?? []}
      selectedSpecialtyIds={(artisanSpecialties ?? []).map((s) => s.specialty_id)}
      selectedCertificationIds={(artisanCertifications ?? []).map((c) => c.certification_id)}
    />
  )
}
