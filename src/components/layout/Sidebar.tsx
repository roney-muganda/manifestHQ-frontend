// src/components/layout/Sidebar.tsx
import { NavLink } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { api } from '@/services/api';
import {
  LayoutDashboard, Package, Calculator,
  Bell, Settings, LogOut, ChevronRight
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

const navItems = [
  { label: 'Dashboard',    href: '/dashboard',     icon: LayoutDashboard },
  { label: 'Shipments',    href: '/shipments',     icon: Package },
  { label: 'Calculator',   href: '/app/calculator',    icon: Calculator },
  { label: 'Notifications',href: '/notifications', icon: Bell },
  { label: 'Settings',     href: '/settings',      icon: Settings },
];

export function Sidebar() {
  const { user, logout } = useAuthStore();

  // Poll for unread notifications every 30 seconds
  const { data: notifData } = useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: () =>
      api.get('/api/notifications?unread_only=true&limit=1')
         .then((r: { data: { unread_count: number } }) => r.data),
    refetchInterval: 30000,
  });

  const unreadCount = notifData?.unread_count ?? 0;

  return (
    <aside className="
      w-56 h-screen bg-midnight flex flex-col
      border-r border-white/5 shrink-0
    ">
      {/* Brand */}
      <div className="px-5 py-6 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="
            w-7 h-7 rounded-lg bg-teal
            flex items-center justify-center
          ">
            <span className="text-midnight font-display font-bold text-xs">M</span>
          </div>
          <span className="font-display font-bold text-white text-base tracking-tight">
            ManifestHQ
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ label, href, icon: Icon }) => (
          <NavLink
            key={href}
            to={href}
            className={({ isActive }) => cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg',
              'text-sm font-body font-medium transition-all duration-150 group',
              isActive
                ? 'bg-teal/10 text-teal'
                : 'text-muted hover:bg-white/5 hover:text-white',
            )}
          >
            {({ isActive }) => (
              <>
                <Icon className={cn(
                  'w-4 h-4 shrink-0 transition-colors',
                  isActive ? 'text-teal' : 'text-slate group-hover:text-white'
                )} />
                
                <span className="flex-1">{label}</span>

                {/* Conditional Badge vs Chevron */}
                {label === 'Notifications' && unreadCount > 0 ? (
                  <span className="
                    bg-red-500 text-white text-[10px] font-bold font-data
                    min-w-[18px] h-[18px] px-1 rounded-full
                    flex items-center justify-center
                  ">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                ) : isActive ? (
                  <ChevronRight className="w-3 h-3 text-teal opacity-60" />
                ) : null}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Agent info + logout */}
      <div className="px-3 py-4 border-t border-white/5">
        <div className="px-3 py-2.5 rounded-lg bg-white/5 mb-2">
          <p className="text-xs font-semibold text-white truncate">
            {user?.name || 'Loading...'}
          </p>
          <p className="text-[11px] text-slate mt-0.5 capitalize">
            {user?.role || 'Agent'} account
          </p>
        </div>
        <button
          onClick={logout}
          className="
            flex items-center gap-3 w-full px-3 py-2.5 rounded-lg
            text-sm font-body text-slate
            hover:bg-white/5 hover:text-red-500
            transition-all duration-150
          "
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}