export const dynamic = 'force-dynamic'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import {
  ClipboardList,
  Users,
  TrendingDown,
  FileCheck,
  ArrowRight,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react'

export default async function EspaceProprietaireDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/connexion')
  }

  let dbUser = null
  let profile = null
  let notifications: any[] = []
  let messages: any[] = []
  let leads: any[] = []

  try {
    dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: { profile: true },
    })

    if (!dbUser || dbUser.role === 'ARTISAN') {
      redirect('/espace-pro')
    }

    profile = dbUser.profile

    // Fetch notifications
    try {
      notifications = await prisma.notification.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
      })
    } catch (error) {
      console.error('Error fetching notifications:', error)
      notifications = []
    }

    // Fetch messages
    try {
      messages = await prisma.message.findMany({
        where: { OR: [{ senderId: user.id }, { receiverId: user.id }] },
      })
    } catch (error) {
      console.error('Error fetching messages:', error)
      messages = []
    }

    // Try to find leads by email as a proxy for projects
    if (dbUser.email) {
      try {
        leads = await prisma.lead.findMany({
          where: { email: dbUser.email },
          include: { artisan: true },
          orderBy: { createdAt: 'desc' },
        })
      } catch (error) {
        console.error('Error fetching leads:', error)
        leads = []
      }
    }
  } catch (error) {
    console.error('Error loading dashboard:', error)
    redirect('/connexion')
  }

  const displayName = profile?.firstName || user.email?.split('@')[0] || 'Propriétaire'
  const unreadNotifications = notifications.filter((n) => !n.read).length
  const unreadMessages = messages.filter((m) => m.receiverId === user.id && !m.read).length

  const matchedArtisans = leads.filter((l) => l.artisanId).map((l) => l.artisan)
  const uniqueArtisans = matchedArtisans.filter((a, i, arr) => arr.findIndex((t) => t?.id === a?.id) === i)

  const PROJECT_STATUS = [
    { label: 'Devis reçus', value: leads.filter((l) => l.status === 'QUALIFIED').length, icon: <FileCheck className="w-4 h-4" />, color: 'text-primary-600 bg-primary-50' },
    { label: 'Artisans matchés', value: uniqueArtisans.length, icon: <Users className="w-4 h-4" />, color: 'text-eco-600 bg-eco-50' },
    { label: 'Économies estimées', value: '0€', icon: <TrendingDown className="w-4 h-4" />, color: 'text-accent-600 bg-accent-50' },
    { label: 'Aides calculées', value: '0€', icon: <CheckCircle className="w-4 h-4" />, color: 'text-purple-600 bg-purple-50' },
  ]

  const TIMELINE = [
    {
      status: leads.length > 0 ? 'done' : 'pending',
      title: 'Demande de devis envoyée',
      date: leads.length > 0 ? new Date(leads[0].createdAt).toLocaleDateString('fr-FR') : 'À faire',
      detail: leads.length > 0 ? leads[0].projectType : 'Remplissez votre projet',
    },
    {
      status: uniqueArtisans.length > 0 ? 'done' : 'pending',
      title: `${uniqueArtisans.length} artisan${uniqueArtisans.length > 1 ? 's' : ''} sélectionné${uniqueArtisans.length > 1 ? 's' : ''}`,
      date: uniqueArtisans.length > 0 ? 'Terminé' : 'En attente',
      detail: uniqueArtisans.map((a) => a?.name).filter(Boolean).join(', ') || 'En attente de sélection',
    },
    {
      status: leads.some((l) => l.status === 'QUALIFIED') ? 'current' : 'pending',
      title: 'Devis en cours de réception',
      date: leads.some((l) => l.status === 'QUALIFIED') ? 'En cours' : 'À venir',
      detail: `${leads.filter((l) => l.status === 'QUALIFIED').length}/${uniqueArtisans.length} devis reçus`,
    },
    {
      status: 'pending',
      title: 'Choix de l\'artisan',
      date: 'À faire',
      detail: 'Comparer et choisir votre artisan',
    },
    {
      status: 'pending',
      title: 'Dépôt du dossier MaPrimeRénov\'',
      date: 'À venir',
      detail: 'Avant le début des travaux',
    },
    {
      status: 'pending',
      title: 'Réalisation des travaux',
      date: 'À venir',
      detail: 'Durée estimée : 3-5 jours',
    },
  ]

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Bonjour, {displayName} 👋</h1>
        <p className="text-slate-500 mt-1">
          {leads.length > 0
            ? `Votre projet de rénovation est en cours — ${leads.filter((l) => l.status === 'QUALIFIED').length} devis reçus sur ${uniqueArtisans.length}`
            : 'Commencez votre projet de rénovation énergétique'}
        </p>
      </div>

      {/* Welcome message for new homeowners */}
      {leads.length === 0 && (
        <div className="mb-8 bg-eco-50 border border-eco-200 rounded-xl p-6">
          <h2 className="text-lg font-bold text-eco-900 mb-2">Bienvenue sur RENOMAG ! 🏠</h2>
          <p className="text-sm text-eco-700 mb-4">
            Votre compte a été créé avec succès. Commencez par demander un devis gratuit pour votre projet de rénovation énergétique et bénéficiez des aides MaPrimeRénov'.
          </p>
          <a
            href="/devis"
            className="inline-flex items-center gap-2 px-4 py-2 bg-eco-600 hover:bg-eco-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Demander un devis gratuit
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {PROJECT_STATUS.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-4">
            <div className={`inline-flex items-center justify-center w-8 h-8 rounded-lg ${stat.color} mb-3`}>
              {stat.icon}
            </div>
            <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Project timeline */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-slate-900">Suivi de mon projet</h2>
            <Link
              href="/espace-proprietaire/mon-projet"
              className="text-xs text-primary-600 hover:text-primary-800 flex items-center gap-1"
            >
              Détails <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-4">
            {TIMELINE.map((item, idx) => (
              <div key={idx} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                      item.status === 'done'
                        ? 'bg-eco-500'
                        : item.status === 'current'
                        ? 'bg-primary-600 ring-4 ring-primary-100'
                        : 'bg-slate-200'
                    }`}
                  >
                    {item.status === 'done' ? (
                      <CheckCircle className="w-3 h-3 text-white" />
                    ) : item.status === 'current' ? (
                      <Clock className="w-3 h-3 text-white" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-slate-400" />
                    )}
                  </div>
                  {idx < TIMELINE.length - 1 && (
                    <div
                      className={`w-px flex-1 mt-1 ${
                        item.status === 'done' ? 'bg-eco-300' : 'bg-slate-200'
                      }`}
                      style={{ minHeight: '12px' }}
                    />
                  )}
                </div>
                <div className="pb-4">
                  <p
                    className={`text-sm font-medium ${
                      item.status === 'pending' ? 'text-slate-400' : 'text-slate-900'
                    }`}
                  >
                    {item.title}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">{item.date}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Devis received */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-slate-900">Devis reçus</h2>
              <Link
                href="/espace-proprietaire/artisans"
                className="text-xs text-primary-600 hover:text-primary-800 flex items-center gap-1"
              >
                Voir tous <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-3">
              {leads.filter((l) => l.artisan).length === 0 && (
                <p className="text-sm text-slate-500">Aucun devis pour le moment.</p>
              )}
              {leads.filter((l) => l.artisan).map((lead) => (
                <div
                  key={lead.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-900">{lead.artisan?.name || 'Artisan'}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {lead.status === 'QUALIFIED' ? 'Devis reçu' : 'En attente'}
                    </p>
                  </div>
                  {lead.status === 'QUALIFIED' ? (
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-900">{lead.budget || '—'}</p>
                    </div>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-amber-600">
                      <Clock className="w-3 h-3" />
                      En attente
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Alert */}
          {leads.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-800">Action requise</p>
                <p className="text-xs text-amber-700 mt-0.5">
                  Déposez votre dossier MaPrimeRénov&apos; avant de commencer les travaux. Votre
                  artisan peut vous aider.
                </p>
                <Link
                  href="/aides"
                  className="text-xs font-medium text-amber-700 hover:text-amber-900 mt-1.5 inline-flex items-center gap-1"
                >
                  En savoir plus <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          )}

          {/* Quick actions */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Actions rapides</h3>
            <div className="space-y-2">
              {[
                { label: 'Comparer les devis', href: '/espace-proprietaire/artisans', icon: '📋' },
                { label: 'Simuler mes aides', href: '/devis#simulateur', icon: '🧮' },
                { label: 'Contacter un artisan', href: '/espace-proprietaire/messages', icon: '💬' },
              ].map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <span>{action.icon}</span>
                  <span className="text-sm text-slate-700">{action.label}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 ml-auto" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
