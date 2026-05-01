import { getUsers } from '@/lib/data/dashboard'
import UsersTable from '@/components/dashboard/UsersTable'

export default async function UtilisateursPage() {
  const users = await getUsers()

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Utilisateurs</h1>
          <p className="text-slate-500 text-sm mt-1">
            {users.length} utilisateurs inscrits
          </p>
        </div>
      </div>

      <UsersTable users={users} />
    </div>
  )
}
