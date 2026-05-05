export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { Role } from '@prisma/client'
import ProfileForm from '@/components/artisan/ProfileForm'
import CertificationUpload from '@/components/upload/CertificationUpload'

export default async function ProfilPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/connexion')

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: { artisan: true },
  })

  if (!dbUser || dbUser.role !== Role.ARTISAN) {
    redirect('/espace-proprietaire')
  }

  const artisan = dbUser.artisan

  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <ProfileForm artisan={artisan} userEmail={dbUser.email || ''} />

      {/* Certifications upload */}
      {artisan && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 mt-6">
          <h2 className="font-semibold text-slate-900 mb-4">Certifications et documents</h2>
          <p className="text-sm text-slate-500 mb-4">
            Téléchargez vos certifications RGE, assurances et autres documents justificatifs
          </p>
          <CertificationUpload
            artisanId={artisan.id}
            existingFiles={(artisan.certificationDocs as any) || []}
          />
        </div>
      )}
    </div>
  )
}
