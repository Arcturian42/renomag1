import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const department = searchParams.get('department');
  const specialty = searchParams.get('specialty');
  const featured = searchParams.get('featured');
  const limit = parseInt(searchParams.get('limit') ?? '20');

  const supabase = await createClient();

  let query = supabase
    .from('artisan_companies')
    .select(`
      *,
      artisan_specialties (
        specialties ( id, name, slug )
      ),
      artisan_certifications (
        certifications ( id, name, code )
      ),
      reviews ( rating )
    `)
    .order('is_featured', { ascending: false })
    .limit(limit);

  if (department) {
    query = query.eq('department', department);
  }

  if (featured === 'true') {
    query = query.eq('is_featured', true);
  }

  const { data: artisans, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const enriched = (artisans ?? []).map((a) => ({
    ...a,
    specialties: a.artisan_specialties?.map((as: { specialties: unknown }) => as.specialties) ?? [],
    certifications: a.artisan_certifications?.map((ac: { certifications: unknown }) => ac.certifications) ?? [],
    averageRating:
      a.reviews && a.reviews.length > 0
        ? a.reviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / a.reviews.length
        : null,
    reviewCount: a.reviews?.length ?? 0,
  }));

  return NextResponse.json({ artisans: enriched });
}
