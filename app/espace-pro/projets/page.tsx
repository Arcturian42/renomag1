export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { getProjectsByArtisan } from '@/app/actions/projects'
import { FolderKanban, MapPin, Calendar, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const PROJECT_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  QUOTE_REQUESTED: { label: 'Devis demandé', color: 'bg-primary-100 text-primary-700' },
  QUOTES_RECEIVED: { label: 'Devis reçus', color: 'bg-amber-100 text-amber-700' },
  QUOTE_ACCEPTED: { label: 'Devis accepté', color: 'bg-purple-100 text-purple-700' },
  WORK_SCHEDULED: { label: 'Travaux planifiés', color: 'bg-blue-100 text-blue-700' },
  IN_PROGRESS: { label: 'En cours', color: 'bg-eco-100 text-eco-700' },
  COMPLETED: { label: 'Terminé', color: 'bg-slate-100 text-slate-700' },
  REVIEWED: { label: 'Avis laissé', color: 'bg-accent-100 text-accent-700' },
  CANCELLED: { label: 'Annulé', color: 'bg-red-100 text-red-700' },
}

export default async function ProjetsPage() {
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

  const result = await getProjectsByArtisan(dbUser.artisan.id)
  const projects = result.success ? (result.data as any[]) : []

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Mes projets</h1>
        <p className="text-slate-500 mt-1">
          {projects.length} projet{projects.length > 1 ? 's' : ''} en cours
        </p>
      </div>

      {projects.length === 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
          <FolderKanban className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-slate-900">Aucun projet</h3>
          <p className="text-slate-500 mt-1 max-w-md mx-auto">
            Les projets apparaissent ici quand un devis est accepté par un client.
          </p>
          <Link
            href="/espace-pro/leads"
            className="inline-block mt-4 text-sm font-medium text-primary-600 hover:text-primary-800"
          >
            Voir mes leads →
          </Link>
        </div>
      )}

      <div className="grid gap-4">
        {projects.map((project) => {
          const status = PROJECT_STATUS_LABELS[project.status] || { label: project.status, color: 'bg-slate-100 text-slate-700' }
          return (
            <div
              key={project.id}
              className="bg-white rounded-xl border border-slate-200 p-5 hover:border-primary-300 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-semibold text-slate-900">
                      {project.lead?.firstName} {project.lead?.lastName}
                    </h3>
                    <span className={`text-xs rounded-full px-2 py-0.5 font-medium ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mb-2">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {project.lead?.city || project.lead?.department}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(project.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                    {project.finalPrice && (
                      <span className="font-medium text-slate-700">{project.finalPrice}€</span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600">
                    {project.lead?.projectType}
                  </p>
                </div>
                <Link
                  href={`/espace-pro/projets/${project.id}`}
                  className="flex-shrink-0 text-sm font-medium text-primary-600 hover:text-primary-800 flex items-center gap-1"
                >
                  Détails
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
