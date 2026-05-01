export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { getPotentialLeads, assignLeadToArtisan } from '@/app/actions/matching'
import { MapPin, Calendar, ArrowRight, Zap } from 'lucide-react'
import Link from 'next/link'

export default async function LeadsPotentielsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/connexion')

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: { artisan: true },
  })

  if (!dbUser || dbUser.role !== 'ARTISAN' || !dbUser.artisan) {
    redirect('/espace-proprietaire')
  }

  const result = await getPotentialLeads(dbUser.artisan.id)
  const leads = result.success ? (result.data as any[]) : []

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Leads potentiels</h1>
        <p className="text-slate-500 mt-1">
          {leads.length} lead{leads.length > 1 ? 's' : ''} compatible{leads.length > 1 ? 's' : ''} avec votre profil
        </p>
      </div>

      {leads.length === 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
          <Zap className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-slate-900">Aucun lead potentiel</h3>
          <p className="text-slate-500 mt-1 max-w-md mx-auto">
            Les leads apparaissent ici quand ils correspondent à votre département ou vos spécialités.
            Complétez votre profil pour recevoir plus de leads.
          </p>
          <Link
            href="/espace-pro/profil"
            className="inline-block mt-4 text-sm font-medium text-primary-600 hover:text-primary-800"
          >
            Compléter mon profil →
          </Link>
        </div>
      )}

      <div className="grid gap-4">
        {leads.map((lead) => (
          <div
            key={lead.id}
            className="bg-white rounded-xl border border-slate-200 p-5 hover:border-primary-300 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-semibold text-slate-900">
                    {lead.firstName} {lead.lastName}
                  </h3>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs text-slate-500">{lead.projectType}</span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mb-3">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {lead.city || lead.department}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(lead.createdAt).toLocaleDateString('fr-FR')}
                  </span>
                  {lead.budget && (
                    <span className="font-medium text-slate-700">{lead.budget}</span>
                  )}
                  {lead.score && (
                    <span className="text-eco-600 font-medium">Score: {lead.score}/100</span>
                  )}
                </div>
                {lead.description && (
                  <p className="text-sm text-slate-600 line-clamp-2">{lead.description}</p>
                )}
              </div>
              <form
                action={async () => {
                  'use server'
                  await assignLeadToArtisan(lead.id, dbUser.artisan!.id)
                }}
                className="flex-shrink-0"
              >
                <button
                  type="submit"
                  className="btn-primary text-sm px-4 py-2 flex items-center gap-1.5"
                >
                  Récupérer
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
