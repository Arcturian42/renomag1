'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import DashboardSidebar from '@/components/layout/DashboardSidebar'
import type { LucideIcon } from 'lucide-react'

type NavItem = {
  label: string
  href: string
  icon: LucideIcon
  badge?: number
}

type Props = {
  navItems: NavItem[]
  footerItems: NavItem[]
  title: string
  userInitials: string
  userName: string
  userRole: string
  children: React.ReactNode
}

export default function DashboardMobileWrapper({
  navItems,
  footerItems,
  title,
  userInitials,
  userName,
  userRole,
  children,
}: Props) {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-slate-950">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <DashboardSidebar
          navItems={navItems}
          footerItems={footerItems}
          title={title}
          userInitials={userInitials}
          userName={userName}
          userRole={userRole}
        />
      </div>

      {/* Mobile sidebar overlay */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-64">
            <DashboardSidebar
              navItems={navItems}
              footerItems={footerItems}
              title={title}
              userInitials={userInitials}
              userName={userName}
              userRole={userRole}
            />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setOpen(true)}
              className="p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="font-display font-bold text-white">
              RENO<span className="text-primary-400">MAG</span>
            </span>
          </div>
          <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-xs font-bold text-white">
            {userInitials}
          </div>
        </div>

        <main className="flex-1 bg-slate-50 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
