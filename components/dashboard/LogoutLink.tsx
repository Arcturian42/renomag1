'use client'

import { LogOut } from 'lucide-react'

export default function LogoutLink() {
  return (
    <a
      href="/dashboard-prive?logout=1"
      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-all duration-150"
    >
      <LogOut className="w-4 h-4" />
      Déconnexion
    </a>
  )
}
