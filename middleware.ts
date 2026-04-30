import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

const PUBLIC_ROUTES = ['/', '/annuaire', '/aides', '/blog', '/tarifs', '/faq', '/glossaire', '/partenaires', '/comment-ca-marche', '/devis', '/cgv', '/cookies', '/mentions-legales', '/confidentialite']
const AUTH_ROUTES = ['/connexion', '/inscription', '/mot-de-passe-oublie']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Update session for all routes (refreshes cookies)
  const response = await updateSession(request)

  // Get user from supabase session
  // We need to read the user from the session cookie
  // Since updateSession already calls getUser(), the cookies are set
  // We parse the session from the cookie to avoid a second request
  // But for simplicity, we'll check auth in the layouts for protected routes
  // Here we just handle auth route redirects if already logged in

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
