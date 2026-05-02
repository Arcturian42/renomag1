export const dynamic = 'force-dynamic'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { CheckCircle, CreditCard, ArrowRight, TrendingUp, Zap } from 'lucide-react'
import { simulateTopUpForm } from '@/app/actions/billing'

export default async function AbonnementPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/connexion')
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: { artisan: { include: { subscription: true } }, profile: true },
  })

  if (!dbUser || dbUser.role !== 'ARTISAN') {
    redirect('/espace-proprietaire')
  }

  const artisan = dbUser.artisan
  const subscription = artisan?.subscription

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const leadsThisMonth = artisan
    ? await prisma.lead.count({
        where: {
          artisanId: artisan.id,
          createdAt: { gte: startOfMonth },
        },
      })
    : 0

  const messagesSent = await prisma.message.count({
    where: {
      senderId: user.id,
      createdAt: { gte: startOfMonth },
    },
  })

  const planName = subscription?.plan || 'Pro'
  const planPrice = '19,99€'
  const articlesThisMonth = artisan
    ? await prisma.article.count({
        where: {
          authorId: artisan.id,
          createdAt: { gte: startOfMonth },
        },
      })
    : 0
  const articlesQuota = subscription?.articlesQuota ?? 1

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Abonnement</h1>
        <p className="text-slate-500 mt-1">Gérez votre offre et vos paiements</p>
      </div>

      {/* Current plan */}
      <div className="bg-primary-800 rounded-2xl p-6 text-white mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-primary-300 text-xs font-semibold uppercase tracking-wider">
              Offre actuelle
            </span>
            <h2 className="text-2xl font-bold mt-1">Plan {planName}</h2>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">{planPrice}</p>
            <p className="text-primary-300 text-sm">/mois HT</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-5">
          <div className="bg-white/10 rounded-xl p-3">
            <p className="text-xl font-bold">{artisan?.credits ? artisan.credits / 100 : 0}€</p>
            <p className="text-primary-200 text-xs">Crédits disponibles</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <p className="text-xl font-bold">{articlesThisMonth}/{articlesQuota}</p>
            <p className="text-primary-200 text-xs">Articles ce mois</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <p className="text-xl font-bold">
              {subscription?.expiresAt
                ? new Date(subscription.expiresAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })
                : '—'}
            </p>
            <p className="text-primary-200 text-xs">Prochain renouvellement</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/espace-pro/articles/nouveau"
            className="flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white text-sm font-semibold rounded-xl px-4 py-2.5 transition-colors"
          >
            <TrendingUp className="w-4 h-4" />
            Publier un article
          </Link>
          <button className="text-sm text-primary-200 hover:text-white transition-colors">
            Gérer l&apos;abonnement
          </button>
        </div>
      </div>

      {/* Usage */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
        <h2 className="font-semibold text-slate-900 mb-5">Utilisation ce mois</h2>
        <div className="space-y-5">
          {[
            { label: 'Leads achetés', used: leadsThisMonth, max: 999, color: 'bg-primary-500' },
            { label: 'Articles publiés', used: articlesThisMonth, max: articlesQuota, color: 'bg-eco-500' },
            { label: 'Messages envoyés', used: messagesSent, max: 100, color: 'bg-accent-500' },
          ].map((item) => (
            <div key={item.label}>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-slate-700 font-medium">{item.label}</span>
                <span className="text-slate-500">
                  {item.used}/{item.max === 999 ? '∞' : item.max}
                </span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${item.color}`}
                  style={{ width: `${Math.min((item.used / (item.max === 999 ? Math.max(item.used, 1) : item.max)) * 100, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dev / test top-up */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
        <h2 className="font-semibold text-slate-900 mb-5 flex items-center gap-2">
          <Zap className="w-4 h-4 text-slate-500" />
          Recharger mes crédits (test)
        </h2>
        <form action={simulateTopUpForm} className="flex items-center gap-3">
          <p className="text-sm text-slate-600 flex-1">
            Ajouter 100€ de crédits et activer l&apos;abonnement Pro pour tester l&apos;achat de leads.
          </p>
          <button
            type="submit"
            className="flex items-center gap-2 bg-eco-500 hover:bg-eco-600 text-white text-sm font-semibold rounded-xl px-4 py-2.5 transition-colors"
          >
            <Zap className="w-4 h-4" />
            Recharger 100€
          </button>
        </form>
      </div>

      {/* Billing history */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
        <h2 className="font-semibold text-slate-900 mb-5 flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-slate-500" />
          Historique de paiements
        </h2>
        <div className="space-y-2">
          {subscription ? (
            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors">
              <div>
                <p className="text-sm font-medium text-slate-900">{planName} — En cours</p>
                <p className="text-xs text-slate-400">#INV-{subscription.id.slice(0, 8)}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-slate-900">{planPrice}</span>
                <span className="badge-rge">Actif</span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500">Aucun paiement enregistré.</p>
          )}
        </div>
      </div>

      {/* Plan info */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg mb-1">Votre abonnement Pro</h3>
            <p className="text-primary-200 text-sm">
              Publiez des articles, améliorez votre visibilité et développez votre notoriété.
            </p>
            <div className="mt-3 space-y-1">
              {['✓ 1 article/mois sur le blog', '✓ Fiche entreprise optimisée', '✓ Visibilité prioritaire'].map((f) => (
                <p key={f} className="text-xs text-primary-200">{f}</p>
              ))}
            </div>
          </div>
          <div className="text-right flex-shrink-0 ml-6">
            <p className="text-2xl font-bold">19,99€</p>
            <p className="text-primary-200 text-xs mb-3">/mois TTC</p>
            <Link
              href="/espace-pro/articles/nouveau"
              className="flex items-center gap-2 bg-white text-primary-700 font-semibold rounded-xl px-4 py-2.5 text-sm hover:bg-primary-50 transition-colors"
            >
              Publier
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
