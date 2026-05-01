import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getUserRoleByEmail } from '@/app/actions/auth'

export async function GET() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user?.email) {
    return NextResponse.json({ role: null }, { status: 401 })
  }

  const role = await getUserRoleByEmail(user.email)
  return NextResponse.json({ role })
}
