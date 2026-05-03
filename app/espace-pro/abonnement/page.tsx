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
              Votre compte
            </span>
            <h2 className="text-2xl font-bold mt-1">
              {subscription?.plan === 'pro' ? 'Plan Pro' : 'Compte Gratuit'}
            </h2>
          </div>
          <div className="text-right">
            {subscription?.plan === 'pro' ? (
              <>
                <p className="text-3xl font-bold">19,99€</p>
                <p className="text-primary-300 text-sm">/mois TTC</p>
              </>
            ) : (
              <>
                <p className="text-3xl font-bold">Gratuit</p>
                <p className="text-primary-300 text-sm">Profil de base</p>
              </>
            )}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-5">
          <div className="bg-white/10 rounded-xl p-3">
            <p className="text-xl font-bold">{artisan?.credits ? (artisan.credits / 100).toFixed(0) : 0}€</p>
            <p className="text-primary-200 text-xs">Crédits disponibles</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <p className="text-xl font-bold">
              {subscription?.plan === 'pro' ? `${articlesThisMonth}/2` : `${articlesThisMonth}/0`}
            </p>
            <p className="text-primary-200 text-xs">Articles ce mois</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <p className="text-xl font-bold">
              {subscription?.plan === 'pro' ? '50' : '0'}
            </p>
            <p className="text-primary-200 text-xs">Crédits/mois inclus</p>
          </div>
        </div>
        {subscription?.plan === 'pro' ? (
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
        ) : (
          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-sm text-primary-100">
              ✓ Profil gratuit créé • Passez au Plan Pro pour plus de fonctionnalités
            </p>
          </div>
        )}
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

      {/* Available Plans */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
        <h2 className="font-semibold text-slate-900 mb-5">Offres disponibles</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {/* Free Account */}
          <div className="border-2 border-slate-200 rounded-xl p-5">
            <h3 className="font-bold text-slate-900 mb-2">Compte Gratuit</h3>
            <p className="text-2xl font-bold text-slate-900 mb-1">0€</p>
            <p className="text-sm text-slate-500 mb-4">Créez votre profil</p>
            <ul className="space-y-2 mb-5">
              {['Création de profil', 'Connexion à une entreprise', 'Accès aux leads gratuits'].map((f) => (
                <li key={f} className="text-sm text-slate-600 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-eco-600 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <button disabled className="btn-secondary w-full opacity-50 cursor-not-allowed">
              Plan actuel
            </button>
          </div>

          {/* Pro Plan */}
          <div className="border-2 border-primary-500 rounded-xl p-5 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded-full">
              RECOMMANDÉ
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Plan Pro</h3>
            <p className="text-2xl font-bold text-slate-900 mb-1">19,99€<span className="text-base font-normal text-slate-500">/mois</span></p>
            <p className="text-sm text-slate-500 mb-4">Tout pour développer votre activité</p>
            <ul className="space-y-2 mb-5">
              {[
                '50 crédits/mois inclus',
                '2 articles/mois sur le blog',
                '1 interview/trimestre',
                '10% de réduction sur les crédits',
                'Badge professionnel sur votre fiche',
                'Support prioritaire'
              ].map((f) => (
                <li key={f} className="text-sm text-slate-600 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary-600 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <button className="btn-primary w-full">
              {subscription?.plan === 'pro' ? 'Gérer mon abonnement' : 'Passer au Plan Pro'}
            </button>
          </div>
        </div>
      </div>

      {/* Additional Services */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
        <h2 className="font-semibold text-slate-900 mb-5">Services complémentaires</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {/* Promo Package */}
          <div className="border border-slate-200 rounded-lg p-4">
            <h4 className="font-semibold text-slate-900 mb-2">Pack Promotion</h4>
            <p className="text-xl font-bold text-slate-900 mb-1">5€<span className="text-sm font-normal text-slate-500">/semaine</span></p>
            <p className="text-sm text-slate-600 mb-3">
              Mettez en avant votre fiche dans l'annuaire
            </p>
            <button className="btn-secondary w-full text-sm">Activer</button>
          </div>

          {/* Additional Visibility */}
          <div className="border border-slate-200 rounded-lg p-4">
            <h4 className="font-semibold text-slate-900 mb-2">Visibilité Maximale</h4>
            <p className="text-xl font-bold text-slate-900 mb-1">5€<span className="text-sm font-normal text-slate-500">/semaine</span></p>
            <p className="text-sm text-slate-600 mb-3">
              Apparaissez en tête de liste dans votre zone
            </p>
            <button className="btn-secondary w-full text-sm">Activer</button>
          </div>

          {/* Additional Interview */}
          <div className="border border-slate-200 rounded-lg p-4">
            <h4 className="font-semibold text-slate-900 mb-2">Interview Supplémentaire</h4>
            <p className="text-xl font-bold text-slate-900 mb-1">60€<span className="text-sm font-normal text-slate-500">/unité</span></p>
            <p className="text-sm text-slate-600 mb-3">
              Article interview publié sur le blog
            </p>
            <button className="btn-secondary w-full text-sm">Commander</button>
          </div>
        </div>
      </div>
    </div>
  )
}
