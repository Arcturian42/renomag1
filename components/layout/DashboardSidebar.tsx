'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Zap } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type NavItem = {
  label: string
  href: string
  icon: LucideIcon
  badge?: number
}

type DashboardSidebarProps = {
  navItems: NavItem[]
  title: string
  subtitle?: string
  userInitials?: string
  userName?: string
  userRole?: string
  footerItems?: NavItem[]
}

export default function DashboardSidebar({
  navItems,
  title,
  userInitials = 'U',
  userName = 'Utilisateur',
  userRole = 'Membre',
  footerItems = [],
}: DashboardSidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="flex flex-col w-64 min-h-screen bg-slate-900 text-white">
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-5 border-b border-slate-800">
        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary-700">
          <Zap className="w-3.5 h-3.5 text-accent-400" />
        </div>
        <span className="font-display font-bold text-lg text-white">
          RENO<span className="text-primary-400">MAG</span>
        </span>
      </div>

      {/* Nav label */}
      <div className="px-4 pt-5 pb-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 px-2">
          {title}
        </p>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-primary-700/30 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className={cn('w-4 h-4', isActive ? 'text-primary-400' : '')} />
                {item.label}
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="flex items-center justify-center min-w-[20px] h-5 rounded-full bg-accent-500 text-white text-xs font-bold px-1.5">
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer items */}
      {footerItems.length > 0 && (
        <div className="px-3 pb-2 space-y-0.5 border-t border-slate-800 pt-4">
          {footerItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150',
                  isActive
                    ? 'bg-primary-700/30 text-white'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                )}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            )
          })}
        </div>
      )}

      {/* User profile */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800 cursor-pointer transition-colors">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-xs font-bold text-white">
            {userInitials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">{userName}</p>
            <p className="text-xs text-slate-400 truncate">{userRole}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
