import { NextRequest, NextResponse } from 'next/server'
import { verifyDashboardPassword, setDashboardSession } from '@/lib/dashboard-auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { password } = body

    if (!password || typeof password !== 'string') {
      return NextResponse.json({ error: 'Mot de passe requis' }, { status: 400 })
    }

    if (!verifyDashboardPassword(password)) {
      return NextResponse.json({ error: 'Mot de passe incorrect' }, { status: 401 })
    }

    setDashboardSession()
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
