import { requireRole } from '@/lib/auth/server-auth'
import { Role } from '@prisma/client'
import AdminLayoutClient from '@/components/layout/AdminLayoutClient'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireRole('/admin', [Role.ADMIN])

  return <AdminLayoutClient>{children}</AdminLayoutClient>
}
