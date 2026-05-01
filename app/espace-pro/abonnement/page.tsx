export const dynamic = 'force-dynamic'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { CheckCircle, CreditCard, ArrowRight, TrendingUp } from 'lucide-react'

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
  const planPrice = subscription?.plan?.toLowerCase().includes('premium') ? '349€' : '149€'
  const isPremium = subscription?.plan?.toLowerCase().includes('premium')
  const quotaMax = isPremium ? 999 : 20
  const overQuota = leadsThisMonth > quotaMax && !isPremium

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
            <p className="text-xl font-bold">{leadsThisMonth}/{quotaMax === 999 ? '∞' : quotaMax}</p>
            <p className="text-primary-200 text-xs">Leads ce mois</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <p className="text-xl font-bold">{subscription?.status || 'Actif'}</p>
            <p className="text-primary-200 text-xs">Statut</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <p className="text-xl font-bold">
              {subscription?.expiresAt
                ? new Date(subscription.expiresAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })
                : '1er'}
            </p>
            <p className="text-primary-200 text-xs">Prochain renouvellement</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {!isPremium && (
            <Link
              href="/tarifs"
              className="flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white text-sm font-semibold rounded-xl px-4 py-2.5 transition-colors"
            >
              <TrendingUp className="w-4 h-4" />
              Passer à Premium
            </Link>
          )}
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
            { label: 'Leads reçus', used: leadsThisMonth, max: quotaMax, color: 'bg-primary-500', overQuota },
            { label: 'Messages envoyés', used: messagesSent, max: 100, color: 'bg-eco-500', overQuota: false },
            { label: 'Devis envoyés', used: Math.floor(leadsThisMonth * 0.5), max: 50, color: 'bg-accent-500', overQuota: false },
          ].map((item) => (
            <div key={item.label}>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-slate-700 font-medium">{item.label}</span>
                <span className={item.overQuota ? 'text-amber-600 font-semibold' : 'text-slate-500'}>
                  {item.used}/{item.max === 999 ? '∞' : item.max}
                </span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${item.overQuota ? 'bg-amber-400' : item.color}`}
                  style={{ width: `${Math.min((item.used / (item.max === 999 ? Math.max(item.used, 1) : item.max)) * 100, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
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

      {/* Upgrade CTA */}
      {!isPremium && (
        <div className="bg-gradient-to-r from-accent-500 to-accent-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg mb-1">Passez à Premium</h3>
              <p className="text-accent-100 text-sm">
                Leads illimités, position prioritaire, gestionnaire dédié
              </p>
              <div className="mt-3 space-y-1">
                {['✓ Leads illimités', '✓ Priorité dans l\'annuaire', '✓ Analytics IA'].map((f) => (
                  <p key={f} className="text-xs text-accent-100">{f}</p>
                ))}
              </div>
            </div>
            <div className="text-right flex-shrink-0 ml-6">
              <p className="text-2xl font-bold">349€</p>
              <p className="text-accent-100 text-xs mb-3">/mois HT</p>
              <Link
                href="/tarifs"
                className="flex items-center gap-2 bg-white text-accent-700 font-semibold rounded-xl px-4 py-2.5 text-sm hover:bg-accent-50 transition-colors"
              >
                Upgrader
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
