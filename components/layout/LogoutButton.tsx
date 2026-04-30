'use client';

import { LogOut } from 'lucide-react';
import { logout } from '@/app/actions/auth';

export default function LogoutButton() {
  return (
    <form action={logout}>
      <button
        type="submit"
        className="flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-all duration-150"
      >
        <LogOut className="w-4 h-4" />
        Déconnexion
      </button>
    </form>
  );
}
