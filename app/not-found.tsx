import Link from 'next/link'
import { Zap, Home, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Logo */}
        <Link href="/" className="inline-flex items-center gap-2 mb-8">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary-800 shadow-lg">
            <Zap className="w-6 h-6 text-accent-400" />
          </div>
          <span className="font-display font-bold text-3xl text-slate-900">
            RENO<span className="text-primary-700">MAG</span>
          </span>
        </Link>

        {/* 404 */}
        <div className="mb-8">
          <h1 className="text-8xl md:text-9xl font-bold text-primary-800 mb-4">404</h1>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
            Page introuvable
          </h2>
          <p className="text-lg text-slate-600 max-w-md mx-auto">
            Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-700 hover:bg-primary-800 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
          >
            <Home className="w-4 h-4" />
            Retour à l'accueil
          </Link>
          <Link
            href="/annuaire"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-primary-700 font-semibold rounded-xl border-2 border-primary-700 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <Search className="w-4 h-4" />
            Annuaire des artisans
          </Link>
        </div>

        {/* Helper text */}
        <p className="mt-12 text-sm text-slate-500">
          Besoin d'aide ? Contactez-nous à{' '}
          <a href="mailto:contact@renomag.fr" className="text-primary-700 hover:underline font-medium">
            contact@renomag.fr
          </a>
        </p>
      </div>
    </div>
  )
}
