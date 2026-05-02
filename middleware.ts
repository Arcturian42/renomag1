import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Role-based route protection (Edge-compatible, no Prisma)
const ROLE_ROUTES: Record<string, string[]> = {
  '/admin': ['ADMIN'],
  '/espace-pro': ['ARTISAN'],
  '/espace-proprietaire': ['USER', 'ADMIN'],
}

function getRedirectForRole(role: string | undefined): string {
  if (role === 'ADMIN') return '/admin'
  if (role === 'ARTISAN') return '/espace-pro'
  return '/espace-proprietaire'
}

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(
          cookiesToSet: { name: string; value: string; options: CookieOptions }[]
        ) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value)
          })
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // Check if route requires auth
  const protectedRoutes = Object.keys(ROLE_ROUTES)
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  )

  // Not authenticated on protected route → redirect to login
  if (isProtected && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/connexion'
    const redirectResponse = NextResponse.redirect(url)
    // Preserve Supabase session cookies
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value, cookie)
    })
    return redirectResponse
  }

  // Authenticated on protected route → check role from Prisma via API
  if (user && isProtected) {
    try {
      const roleUrl = new URL('/api/auth/role', request.url)
      const roleRes = await fetch(roleUrl.toString(), {
        headers: {
          cookie: request.headers.get('cookie') || '',
        },
      })

      let userRole: string | null = null
      if (roleRes.ok) {
        const data = await roleRes.json()
        userRole = data.role
      }

      // Fallback to metadata if API fails
      if (!userRole) {
        userRole = (user.user_metadata?.role as string) || null
      }

      for (const [route, allowedRoles] of Object.entries(ROLE_ROUTES)) {
        if (pathname.startsWith(route)) {
          if (!userRole || !allowedRoles.includes(userRole)) {
            // No role or wrong role → redirect appropriately
            if (!userRole) {
              // No role found, redirect to login
              const url = request.nextUrl.clone()
              url.pathname = '/connexion'
              const redirectResponse = NextResponse.redirect(url)
              supabaseResponse.cookies.getAll().forEach((cookie) => {
                redirectResponse.cookies.set(cookie.name, cookie.value, cookie)
              })
              return redirectResponse
            }
            // Wrong role → redirect to their appropriate space (avoid loop)
            const redirectPath = getRedirectForRole(userRole)
            if (redirectPath !== pathname) {
              const url = request.nextUrl.clone()
              url.pathname = redirectPath
              const redirectResponse = NextResponse.redirect(url)
              supabaseResponse.cookies.getAll().forEach((cookie) => {
                redirectResponse.cookies.set(cookie.name, cookie.value, cookie)
              })
              return redirectResponse
            }
          }
          break
        }
      }
    } catch {
      // If role check fails, fallback to metadata
      const userRole = (user.user_metadata?.role as string) || null
      for (const [route, allowedRoles] of Object.entries(ROLE_ROUTES)) {
        if (pathname.startsWith(route)) {
          if (!userRole || !allowedRoles.includes(userRole)) {
            // No role or wrong role → redirect appropriately
            if (!userRole) {
              // No role found, redirect to login
              const url = request.nextUrl.clone()
              url.pathname = '/connexion'
              return NextResponse.redirect(url)
            }
            // Wrong role → redirect to their appropriate space (avoid loop)
            const redirectPath = getRedirectForRole(userRole)
            if (redirectPath !== pathname) {
              const url = request.nextUrl.clone()
              url.pathname = redirectPath
              return NextResponse.redirect(url)
            }
          }
          break
        }
      }
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
