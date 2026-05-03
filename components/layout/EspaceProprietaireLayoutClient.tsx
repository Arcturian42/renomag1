'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import SignOutButton from '@/components/layout/SignOutButton'
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  MessageSquare,
  Settings,
  Bell,
  Zap,
} from 'lucide-react'

interface EspaceProprietaireLayoutClientProps {
  children: React.ReactNode
  userName?: string
  userInitials?: string
  userRole?: string
  unreadMessages?: number
  unreadNotifications?: number
  matchedArtisans?: number
}

export default function EspaceProprietaireLayoutClient({
  children,
  userName = 'Particulier',
  userInitials = 'PA',
  userRole = 'Particulier',
  unreadMessages = 0,
  unreadNotifications = 0,
  matchedArtisans = 0,
}: EspaceProprietaireLayoutClientProps) {
  const pathname = usePathname()

  const navItems = [
    { label: 'Tableau de bord', href: '/espace-proprietaire', icon: LayoutDashboard },
    { label: 'Mon projet', href: '/espace-proprietaire/mon-projet', icon: ClipboardList },
    { label: 'Artisans matchés', href: '/espace-proprietaire/artisans', icon: Users, badge: matchedArtisans },
    { label: 'Messages', href: '/espace-proprietaire/messages', icon: MessageSquare, badge: unreadMessages },
    { label: 'Notifications', href: '/espace-proprietaire/notifications', icon: Bell, badge: unreadNotifications },
    { label: 'Mon compte', href: '/espace-proprietaire/compte', icon: Settings },
    { label: 'Paramètres', href: '/espace-proprietaire/parametres', icon: Settings },
  ]

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 min-h-screen bg-slate-900 text-white flex flex-col">
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
            Espace Particulier
          </p>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-700/30 text-white'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-primary-400' : ''}`} />
                  {item.label}
                </div>
                {(item.badge ?? 0) > 0 && (
                  <span className="flex items-center justify-center min-w-[20px] h-5 rounded-full bg-accent-500 text-white text-xs font-bold px-1.5">
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="px-3 pb-2 space-y-0.5 border-t border-slate-800 pt-4">
          <SignOutButton />
        </div>

        {/* User profile */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 p-2 rounded-lg">
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

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
