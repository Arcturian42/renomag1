import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { ARTICLES, CATEGORIES } from '@/lib/data/blog';
import { formatDateShort } from '@/lib/utils';
import { Clock, Search } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Blog Rénovation Énergétique — Guides et actualités',
  description: 'Découvrez nos guides pratiques sur la rénovation énergétique : MaPrimeRénov\', CEE, pompe à chaleur, isolation, panneaux solaires...',
};

export default async function BlogPage() {
  const supabase = await createClient();

  const { data: dbArticles } = await supabase
    .from('articles')
    .select('*, categories ( name, slug )')
    .eq('published', true)
    .order('created_at', { ascending: false });

  const { data: dbCategories } = await supabase.from('categories').select('name, slug');

  const hasDb = dbArticles && dbArticles.length > 0;
  const articles = hasDb ? dbArticles : ARTICLES;
  const categories = hasDb
    ? (dbCategories ?? []).map((c) => c.name)
    : CATEGORIES;

  const [featured, ...rest] = articles as typeof ARTICLES;

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-slate-900 text-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="badge-primary mb-4">Blog & Guides</div>
            <h1 className="text-4xl font-bold">
              Tout savoir sur la<br />
              <span className="text-accent-400">rénovation énergétique</span>
            </h1>
            <p className="mt-4 text-slate-400">Guides pratiques, actualités des aides et conseils d&apos;experts pour bien rénover.</p>
          </div>
          <div className="mt-8 flex max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher un article..."
                className="w-full rounded-l-xl bg-white/10 border border-white/20 px-4 pl-10 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent-400/50"
              />
            </div>
            <button className="btn-accent rounded-l-none rounded-r-xl px-5">Chercher</button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-wrap gap-2 mb-10">
          <button className="px-4 py-1.5 rounded-full text-sm font-medium bg-primary-800 text-white">Tous</button>
          {categories.map((cat) => (
            <button key={cat} className="px-4 py-1.5 rounded-full text-sm font-medium border border-slate-200 text-slate-600 hover:border-primary-300 hover:text-primary-700 transition-colors">
              {cat}
            </button>
          ))}
        </div>

        {featured && (
          <div className="mb-10">
            <Link
              href={`/blog/${(featured as { slug: string }).slug}`}
              className="group grid md:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-slate-200 hover:shadow-lg transition-shadow"
            >
              <div className="relative h-64 md:h-auto bg-slate-100">
                <Image
                  src={(featured as { image: string }).image ?? 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80'}
                  alt={(featured as { title: string }).title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  unoptimized
                />
                <div className="absolute top-4 left-4">
                  <span className="badge-accent text-sm px-3 py-1">À la une</span>
                </div>
              </div>
              <div className="bg-white p-8 flex flex-col justify-between">
                <div>
                  <span className="badge-primary mb-3">
                    {(featured as { category?: string; categories?: { name: string } }).category
                      ?? (featured as { categories?: { name: string } }).categories?.name
                      ?? 'Guide'}
                  </span>
                  <h2 className="text-2xl font-bold text-slate-900 group-hover:text-primary-700 transition-colors leading-snug mt-2">
                    {(featured as { title: string }).title}
                  </h2>
                  <p className="mt-3 text-slate-500 leading-relaxed">
                    {(featured as { excerpt?: string }).excerpt}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-6 pt-5 border-t border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-xs font-bold text-white">R</div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">Équipe RENOMAG</p>
                      <p className="text-xs text-slate-400">
                        {(featured as { publishedAt?: string; created_at?: string }).publishedAt
                          ? formatDateShort((featured as { publishedAt: string }).publishedAt)
                          : new Date((featured as unknown as { created_at: string }).created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    5 min
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((article) => {
            const a = article as {
              id: string; slug: string; title: string; excerpt?: string; image?: string;
              category?: string; categories?: { name: string }; publishedAt?: string; created_at?: string; readTime?: number;
            };
            return (
              <Link
                key={a.id}
                href={`/blog/${a.slug}`}
                className="group flex flex-col rounded-xl overflow-hidden border border-slate-200 hover:shadow-md hover:border-slate-300 transition-all"
              >
                <div className="relative h-44 bg-slate-100">
                  <Image
                    src={a.image ?? 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80'}
                    alt={a.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    unoptimized
                  />
                  <div className="absolute top-3 left-3">
                    <span className="badge-primary text-xs">{a.category ?? a.categories?.name ?? 'Guide'}</span>
                  </div>
                </div>
                <div className="flex flex-col flex-1 p-5">
                  <h3 className="font-semibold text-slate-900 group-hover:text-primary-700 transition-colors leading-snug">{a.title}</h3>
                  <p className="mt-2 text-xs text-slate-500 line-clamp-2 leading-relaxed flex-1">{a.excerpt}</p>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 text-xs text-slate-400">
                    <span>{a.publishedAt ? formatDateShort(a.publishedAt) : new Date(a.created_at ?? '').toLocaleDateString('fr-FR')}</span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {a.readTime ?? 5} min
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
