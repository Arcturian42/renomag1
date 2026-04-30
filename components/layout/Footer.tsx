import Link from 'next/link'
import { Zap, Mail, Phone, MapPin, Twitter, Linkedin, Facebook } from 'lucide-react'

const FOOTER_LINKS = {
  Particuliers: [
    { label: 'Trouver un artisan RGE', href: '/annuaire' },
    { label: 'Obtenir un devis gratuit', href: '/devis' },
    { label: "Aides MaPrimeRénov'", href: '/aides' },
    { label: 'Simulateur d\'aides', href: '/devis#simulateur' },
    { label: 'Comment ça marche', href: '/comment-ca-marche' },
  ],
  Professionnels: [
    { label: 'Rejoindre RENOMAG', href: '/inscription?type=pro' },
    { label: 'Nos offres', href: '/tarifs' },
    { label: 'Espace pro', href: '/espace-pro' },
    { label: 'Certifications RGE', href: '/blog?tag=RGE' },
    { label: 'Partenaires', href: '/partenaires' },
  ],
  Ressources: [
    { label: 'Blog', href: '/blog' },
    { label: 'Guide MaPrimeRénov\'', href: '/blog/maprimrenov-2024-tout-savoir' },
    { label: 'Guide CEE', href: '/blog/cee-certificats-economies-energie-2024' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Glossaire', href: '/glossaire' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-700">
                <Zap className="w-4 h-4 text-accent-400" />
              </div>
              <span className="font-display font-bold text-xl text-white">
                RENO<span className="text-primary-400">MAG</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              La plateforme de référence pour connecter les particuliers aux meilleurs
              artisans RGE et maximiser leurs aides à la rénovation énergétique.
            </p>
            <div className="mt-6 space-y-2">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Phone className="w-3.5 h-3.5 text-primary-400" />
                <a href="tel:+33123456789" className="hover:text-white transition-colors">
                  01 23 45 67 89
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Mail className="w-3.5 h-3.5 text-primary-400" />
                <a href="mailto:contact@renomag.fr" className="hover:text-white transition-colors">
                  contact@renomag.fr
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-primary-400" />
                <span>Paris, France</span>
              </div>
            </div>
            <div className="mt-6 flex items-center gap-4">
              <a
                href="https://twitter.com/renomag"
                className="text-slate-400 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com/company/renomag"
                className="text-slate-400 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com/renomag"
                className="text-slate-400 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                {category}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} RENOMAG. Tous droits réservés.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/mentions-legales" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
              Mentions légales
            </Link>
            <Link href="/confidentialite" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
              Confidentialité
            </Link>
            <Link href="/cgv" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
              CGV
            </Link>
            <Link href="/cookies" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
              Cookies
            </Link>
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-8 flex flex-wrap items-center gap-6 opacity-50">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="text-lg">🇫🇷</span>
            <span>Made in France</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="text-lg">🔒</span>
            <span>Données sécurisées</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="text-lg">✅</span>
            <span>Artisans vérifiés</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="text-lg">🏆</span>
            <span>Certifiés RGE</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
