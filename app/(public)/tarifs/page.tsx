import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle, X, Star, Crown, Zap, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Tarifs Professionnels — RENOMAG pour les artisans RGE',
  description:
    'Découvrez nos offres pour les artisans RGE : accès aux leads qualifiés, profil optimisé SEO, gestion des devis et analytics.',
}

const PLANS = [
  {
    name: 'Essentiel',
    price: 49,
    period: '/mois',
    description: 'Pour démarrer et valider le concept',
    color: 'border-slate-200',
    badge: null,
    icon: <Star className="w-5 h-5 text-slate-500" />,
    features: [
      { label: 'Profil professionnel', included: true },
      { label: 'Jusqu\'à 5 leads/mois', included: true },
      { label: 'Fiche annuaire basique', included: true },
      { label: 'Messagerie intégrée', included: true },
      { label: 'Support email', included: true },
      { label: 'Badge "Vérifié"', included: false },
      { label: 'Mise en avant annuaire', included: false },
      { label: 'Analytics avancés', included: false },
      { label: 'Leads illimités', included: false },
      { label: 'Support téléphonique', included: false },
    ],
    cta: 'Commencer',
    ctaVariant: 'btn-secondary' as const,
  },
  {
    name: 'Pro',
    price: 149,
    period: '/mois',
    description: 'Pour les artisans qui veulent croître',
    color: 'border-primary-500 ring-2 ring-primary-500',
    badge: 'Populaire',
    icon: <Crown className="w-5 h-5 text-primary-600" />,
    features: [
      { label: 'Profil professionnel', included: true },
      { label: 'Jusqu\'à 20 leads/mois', included: true },
      { label: 'Fiche annuaire enrichie', included: true },
      { label: 'Messagerie intégrée', included: true },
      { label: 'Support prioritaire', included: true },
      { label: 'Badge "Vérifié"', included: true },
      { label: 'Mise en avant annuaire', included: true },
      { label: 'Analytics standard', included: true },
      { label: 'Leads illimités', included: false },
      { label: 'Support téléphonique', included: false },
    ],
    cta: 'Démarrer Pro',
    ctaVariant: 'btn-primary' as const,
  },
  {
    name: 'Premium',
    price: 349,
    period: '/mois',
    description: 'Pour les leaders du marché',
    color: 'border-accent-400',
    badge: 'Meilleure valeur',
    icon: <Zap className="w-5 h-5 text-accent-600" />,
    features: [
      { label: 'Profil professionnel', included: true },
      { label: 'Leads illimités', included: true },
      { label: 'Fiche annuaire premium', included: true },
      { label: 'Messagerie intégrée', included: true },
      { label: 'Support dédié 7j/7', included: true },
      { label: 'Badge "Premium"', included: true },
      { label: 'Position prioritaire annuaire', included: true },
      { label: 'Analytics avancés + IA', included: true },
      { label: 'Gestionnaire de compte dédié', included: true },
      { label: 'Support téléphonique', included: true },
    ],
    cta: 'Démarrer Premium',
    ctaVariant: 'btn-accent' as const,
  },
]

const ADDONS = [
  {
    name: 'Pack Leads Booster',
    price: '99€',
    description: '10 leads supplémentaires en dehors de votre quota mensuel',
  },
  {
    name: 'Contenu SEO local',
    price: '199€/mois',
    description: '4 articles optimisés SEO sur votre spécialité et région',
  },
  {
    name: 'Campagne sponsorisée',
    price: 'À partir de 299€',
    description: 'Mise en avant sur la page d\'accueil et les pages de résultats',
  },
]

export default function TarifsPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-slate-900 text-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="badge-accent mx-auto w-fit mb-4">Offres Pros</div>
          <h1 className="text-4xl font-bold">Développez votre activité</h1>
          <p className="mt-4 text-slate-400 max-w-xl mx-auto">
            Choisissez l'offre adaptée à votre ambition. Sans engagement, résiliable à tout moment.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 bg-eco-900/50 border border-eco-700 rounded-full px-4 py-2">
            <span className="text-eco-400 text-sm font-medium">🎁 1 mois offert pour toute inscription avant le 31 mai 2024</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Pricing grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-2xl border-2 ${plan.color} p-7 flex flex-col`}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className={`px-4 py-1 rounded-full text-xs font-bold text-white ${
                    plan.name === 'Pro' ? 'bg-primary-700' : 'bg-accent-500'
                  }`}>
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                  {plan.icon}
                </div>
                <div>
                  <h2 className="font-bold text-slate-900">{plan.name}</h2>
                  <p className="text-xs text-slate-500">{plan.description}</p>
                </div>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold text-slate-900">{plan.price}€</span>
                <span className="text-slate-500 text-sm">{plan.period}</span>
                <p className="text-xs text-slate-400 mt-1">HT, sans engagement</p>
              </div>

              <ul className="space-y-2.5 flex-1 mb-7">
                {plan.features.map((feat) => (
                  <li key={feat.label} className="flex items-center gap-2.5">
                    {feat.included ? (
                      <CheckCircle className="w-4 h-4 text-eco-500 flex-shrink-0" />
                    ) : (
                      <X className="w-4 h-4 text-slate-300 flex-shrink-0" />
                    )}
                    <span
                      className={`text-sm ${
                        feat.included ? 'text-slate-700' : 'text-slate-400'
                      }`}
                    >
                      {feat.label}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href="/inscription?type=pro"
                className={`${plan.ctaVariant} text-center`}
              >
                {plan.cta}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>

        {/* Add-ons */}
        <div className="mb-16">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Options supplémentaires</h2>
          <div className="grid sm:grid-cols-3 gap-5">
            {ADDONS.map((addon) => (
              <div key={addon.name} className="bg-slate-50 rounded-xl border border-slate-200 p-5">
                <h3 className="font-semibold text-slate-900 mb-1">{addon.name}</h3>
                <p className="text-sm text-slate-500 mb-3">{addon.description}</p>
                <p className="text-lg font-bold text-primary-700">{addon.price}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ROI calculator */}
        <div className="bg-gradient-to-br from-primary-800 to-primary-900 rounded-2xl p-8 text-white mb-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-3">Calculez votre ROI</h2>
              <p className="text-primary-200">
                Un artisan qui convertit 2 leads/mois avec un panier moyen de 8 000€ génère
                <strong className="text-white"> 16 000€ de CA mensuel supplémentaire</strong>
                pour un abonnement à 149€/mois.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-4">
                {[
                  { value: 'x107', label: 'ROI potentiel' },
                  { value: '8 000€', label: 'Panier moyen' },
                  { value: '2h', label: 'Temps de réponse moyen' },
                  { value: '68%', label: 'Taux de conversion leads' },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white/10 rounded-xl p-3">
                    <div className="text-xl font-bold text-accent-400">{stat.value}</div>
                    <div className="text-xs text-primary-200">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center">
              <p className="text-primary-200 mb-4">Commencez à recevoir des leads qualifiés dès aujourd'hui</p>
              <Link
                href="/inscription?type=pro"
                className="btn-accent px-8 py-3"
              >
                Démarrer 30 jours offerts
              </Link>
              <p className="text-xs text-primary-300 mt-2">Sans carte bancaire requise</p>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="text-center">
          <h2 className="text-xl font-bold text-slate-900 mb-8">Ce que disent nos artisans partenaires</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                name: 'Marc D.',
                company: 'ThermoConfort Paris',
                quote: 'En 6 mois, RENOMAG m\'a apporté 23 chantiers qualifiés. Le ROI est exceptionnel.',
                savings: '+180K€ de CA',
              },
              {
                name: 'Isabelle F.',
                company: 'Soleil Énergie Bordeaux',
                quote: 'Les leads sont vraiment qualifiés. Les clients ont déjà fait leur devis de subventions.',
                savings: '+12 chantiers/mois',
              },
              {
                name: 'Thomas G.',
                company: 'Chaleur Plus Nantes',
                quote: 'L\'espace pro est très bien fait. Je gère tout depuis une seule interface.',
                savings: '3h économisées/semaine',
              },
            ].map((t) => (
              <div key={t.name} className="bg-slate-50 rounded-xl border border-slate-200 p-5 text-left">
                <p className="text-sm text-slate-600 italic mb-4">"{t.quote}"</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                    <p className="text-xs text-slate-400">{t.company}</p>
                  </div>
                  <span className="text-sm font-bold text-eco-600">{t.savings}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
