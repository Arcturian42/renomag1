'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, ChevronDown, Zap, Phone } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  {
    label: 'Annuaire',
    href: '/annuaire',
    children: [
      { label: 'Trouver un artisan RGE', href: '/annuaire' },
      { label: 'Isolation', href: '/annuaire?specialite=isolation' },
      { label: 'Pompe à chaleur', href: '/annuaire?specialite=pac' },
      { label: 'Photovoltaïque', href: '/annuaire?specialite=solaire' },
      { label: 'Toutes les spécialités', href: '/annuaire' },
    ],
  },
  {
    label: 'Aides',
    href: '/aides',
    children: [
      { label: "MaPrimeRénov'", href: '/aides#maprimrenov' },
      { label: 'CEE', href: '/aides#cee' },
      { label: 'Éco-PTZ', href: '/aides#eco-ptz' },
      { label: 'Simulateur d\'aides', href: '/devis' },
    ],
  },
  { label: 'Blog', href: '/blog' },
  { label: 'Comment ça marche', href: '/comment-ca-marche' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-800">
              <Zap className="w-4 h-4 text-accent-400" />
            </div>
            <span className="font-display font-bold text-xl text-slate-900">
              RENO<span className="text-primary-700">MAG</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) =>
              link.children ? (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(link.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-600 hover:text-primary-800 rounded-md hover:bg-slate-50 transition-colors">
                    {link.label}
                    <ChevronDown
                      className={cn(
                        'w-3.5 h-3.5 transition-transform',
                        activeDropdown === link.label && 'rotate-180'
                      )}
                    />
                  </button>
                  {activeDropdown === link.label && (
                    <div className="absolute top-full left-0 mt-1 w-56 rounded-xl bg-white border border-slate-200 shadow-lg py-1.5 z-50">
                      {link.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className="block px-4 py-2 text-sm text-slate-700 hover:bg-primary-50 hover:text-primary-800 transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-primary-800 rounded-md hover:bg-slate-50 transition-colors"
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          {/* CTA buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="tel:+33123456789"
              className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-primary-800 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              01 23 45 67 89
            </a>
            <Link href="/connexion" className="btn-ghost text-xs py-2 px-3">
              Connexion
            </Link>
            <Link href="/devis" className="btn-accent text-xs py-2 px-4">
              Devis gratuit
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 rounded-md text-slate-600 hover:bg-slate-100"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-slate-200 py-3 space-y-1 pb-4">
            {NAV_LINKS.map((link) => (
              <div key={link.label}>
                <Link
                  href={link.href}
                  className="block px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
                {link.children && (
                  <div className="ml-4 space-y-1 mt-1">
                    {link.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        className="block px-4 py-2 text-xs text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-lg"
                        onClick={() => setMobileOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="pt-3 flex flex-col gap-2 px-4">
              <Link href="/connexion" className="btn-secondary text-center text-sm py-2.5">
                Connexion
              </Link>
              <Link href="/devis" className="btn-accent text-center text-sm py-2.5">
                Devis gratuit
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
