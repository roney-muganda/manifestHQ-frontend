// src/components/layout/TopBar.tsx
import { Bell, Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { useState } from 'react';
// Note: This will show a TS error until we create it
import { NotificationDropdown } from '@/components/domain/NotificationDropdown';

export function TopBar() {
  const [showNotifications, setShowNotifications] = useState(false);

  const { data } = useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: () => api.get('/api/notifications?unread_only=true').then((r) => r.data),
    refetchInterval: 30000,
  });

  const unreadCount = data?.unread_count ?? 0;

  return (
    <header className="h-14 border-b border-border bg-card flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-2 text-sm text-muted font-body">
        <Search className="w-4 h-4" />
        <span className="hidden sm:inline">Search shipments by reference...</span>
      </div>

      <div className="relative">
        <button
          onClick={() => setShowNotifications((s) => !s)}
          className="relative w-9 h-9 rounded-full hover:bg-surface flex items-center justify-center transition-colors"
        >
          <Bell className="w-4 h-4 text-slate" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
        {showNotifications && (
          <NotificationDropdown onClose={() => setShowNotifications(false)} />
        )}
      </div>
    </header>
  );
}