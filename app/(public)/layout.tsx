import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let navUser = null
  if (user) {
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: { profile: true },
    })
    if (dbUser) {
      navUser = {
        email: user.email!,
        role: dbUser.role,
        firstName: dbUser.profile?.firstName || undefined,
        lastName: dbUser.profile?.lastName || undefined,
      }
    }
  }

  return (
    <>
      <Navbar user={navUser} />
      <main>{children}</main>
      <Footer />
    </>
  )
}
