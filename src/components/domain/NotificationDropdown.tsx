// src/components/domain/NotificationDropdown.tsx
import { useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api'; // Path corrected
import { useNavigate } from 'react-router-dom';
import { cn, smartDate } from '@/lib/utils';
import {
  Bell,
  Package,
  AlertTriangle,
  Info,
  CheckCheck,
  Loader2,
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'order_update' | 'demurrage_warning' | 'milestone_update' | 'system' | string;
  title: string;
  message: string;
  is_read: boolean;
  reference_id: string | null;
  created_at: string;
}

const typeConfig = {
  demurrage_warning: {
    icon: AlertTriangle,
    iconBg: 'bg-amber-pale',
    iconColor: 'text-amber',
  },
  milestone_update: {
    icon: Package,
    iconBg: 'bg-teal-pale',
    iconColor: 'text-teal',
  },
  order_update: {
    icon: Package,
    iconBg: 'bg-surface', // Using surface for general updates to keep it clean
    iconColor: 'text-teal',
  },
  system: {
    icon: Info,
    iconBg: 'bg-surface',
    iconColor: 'text-slate',
  },
};

function getConfig(type: string) {
  return typeConfig[type as keyof typeof typeConfig] ?? typeConfig.system;
}

export function NotificationDropdown({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Close when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  const { data, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () =>
      api.get('/api/notifications?limit=20').then((r) => r.data),
  });

  const markRead = useMutation({
    mutationFn: (id: string) =>
      api.patch(`/api/notifications/${id}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const markAllRead = useMutation({
    mutationFn: () => api.patch('/api/notifications/mark-all-read'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  function handleNotificationClick(n: Notification) {
    if (!n.is_read) {
      markRead.mutate(n.id);
    }
    if (n.reference_id) {
      navigate(`/shipments/${n.reference_id}`);
    }
    onClose();
  }

  const notifications: Notification[] = data?.notifications ?? [];
  const unreadCount: number = data?.unread_count ?? 0;

  return (
    <div
      ref={ref}
      className="absolute right-0 top-11 z-50 w-80 bg-card rounded-lg border border-border shadow-lg overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-body" />
          <span className="text-sm font-semibold font-body text-body">
            Notifications
          </span>
          {unreadCount > 0 && (
            <span className="bg-red text-white text-[10px] font-bold font-data px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
              {unreadCount}
            </span>
          )}
        </div>

        {unreadCount > 0 && (
          <button
            onClick={() => markAllRead.mutate()}
            disabled={markAllRead.isPending}
            className="flex items-center gap-1 text-xs text-teal font-semibold font-body hover:underline disabled:opacity-50"
          >
            {markAllRead.isPending
              ? <Loader2 className="w-3 h-3 animate-spin" />
              : <CheckCheck className="w-3 h-3" />
            }
            Mark all read
          </button>
        )}
      </div>

      {/* List */}
      <div className="max-h-[400px] overflow-y-auto">
        {isLoading && (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-5 h-5 text-muted animate-spin" />
          </div>
        )}

        {!isLoading && notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 gap-2">
            <Bell className="w-8 h-8 text-border" />
            <p className="text-sm text-muted font-body">No notifications yet.</p>
          </div>
        )}

        {!isLoading && notifications.map((n) => {
          const config = getConfig(n.type);
          const Icon = config.icon;

          return (
            <button
              key={n.id}
              onClick={() => handleNotificationClick(n)}
              className={cn(
                'w-full text-left flex items-start gap-3 px-4 py-3',
                'border-b border-border last:border-0',
                'hover:bg-surface transition-colors duration-100',
                !n.is_read && 'bg-teal-pale/30',
              )}
            >
              {/* Icon */}
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5',
                config.iconBg,
              )}>
                <Icon className={cn('w-3.5 h-3.5', config.iconColor)} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={cn(
                    'text-sm font-body leading-snug',
                    n.is_read ? 'text-slate font-normal' : 'text-body font-semibold',
                  )}>
                    {n.title}
                  </p>
                  {!n.is_read && (
                    <span className="w-2 h-2 rounded-full bg-teal shrink-0 mt-1" />
                  )}
                </div>
                <p className="text-xs text-muted font-body mt-0.5 line-clamp-2 leading-relaxed">
                  {n.message}
                </p>
                <p className="text-[11px] text-muted font-data mt-1.5">
                  {smartDate(n.created_at)}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="px-4 py-2.5 border-t border-border bg-surface">
          <p className="text-xs text-muted font-body text-center">
            Showing latest notifications
          </p>
        </div>
      )}
    </div>
  );
}