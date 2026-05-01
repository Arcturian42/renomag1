import Link from 'next/link'
import { getFeaturedArtisans } from '@/lib/data/db'
import ArtisanCard from './ArtisanCard'
import { ArrowRight } from 'lucide-react'

export default async function FeaturedArtisans() {
  const featured = await getFeaturedArtisans()

  return (
    <section className="py-20 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="badge-primary mb-3">Artisans en vedette</div>
            <h2 className="text-2xl font-bold text-slate-900">
              Les meilleurs artisans RGE
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Sélectionnés pour leur expertise et la qualité de leur service
            </p>
          </div>
          <Link
            href="/annuaire"
            className="hidden sm:flex items-center gap-2 text-sm font-medium text-primary-700 hover:text-primary-900 transition-colors"
          >
            Voir tous les artisans
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((artisan) => (
            <ArtisanCard key={artisan.id} artisan={artisan} />
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link href="/annuaire" className="btn-secondary">
            Voir tous les artisans
          </Link>
        </div>
      </div>
    </section>
  )
}
