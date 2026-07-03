import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { api } from '@/services/api';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { cn, smartDate } from '@/lib/utils';
import {
  AlertTriangle,
  Package,
  Info,
  MessageSquare,
  CheckCheck,
  ChevronRight,
  Inbox,
} from 'lucide-react';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  reference_id: string | null;
  created_at: string;
}

// ── Type config ───────────────────────────────────────────────

const typeConfig: Record<string, { 
  icon: React.ElementType; 
  iconBg: string; 
  iconColor: string; 
  label: string 
}> = {
  demurrage_warning: {
    icon: AlertTriangle,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-500',
    label: 'Demurrage',
  },
  milestone_update: {
    icon: Package,
    iconBg: 'bg-teal-pale',
    iconColor: 'text-teal',
    label: 'Milestone',
  },
  system: {
    icon: Info,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-500',
    label: 'System',
  },
  sms_failed: {
    icon: MessageSquare,
    iconBg: 'bg-red-50',
    iconColor: 'text-red-500',
    label: 'SMS',
  },
};

function getConfig(type: string) {
  return typeConfig[type] ?? typeConfig.system;
}

// ── Filter tabs ───────────────────────────────────────────────

const FILTERS = [
  { label: 'All',       value: 'all' },
  { label: 'Unread',    value: 'unread' },
  { label: 'Demurrage', value: 'demurrage_warning' },
  { label: 'Milestones',value: 'milestone_update' },
  { label: 'System',    value: 'system' },
];

// ── Skeleton ──────────────────────────────────────────────────

function NotificationSkeleton() {
  return (
    <div className="flex items-start gap-4 p-5 border-b border-border last:border-0">
      <Skeleton className="w-10 h-10 rounded-full shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3.5 w-48" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-3/4" />
        <Skeleton className="h-3 w-20 mt-1" />
      </div>
    </div>
  );
}

// ── Single row ────────────────────────────────────────────────

function NotificationRow({
  notification,
  onRead,
}: {
  notification: Notification;
  onRead: (id: string, referenceId: string | null) => void;
}) {
  const config = getConfig(notification.type);
  const Icon = config.icon;

  return (
    <button
      onClick={() => onRead(notification.id, notification.reference_id)}
      className={cn(
        'w-full text-left flex items-start gap-4 px-6 py-5',
        'border-b border-border last:border-0',
        'hover:bg-surface transition-colors duration-100 group',
        !notification.is_read && 'bg-teal-pale/20',
      )}
    >
      {/* Icon */}
      <div className={cn(
        'w-10 h-10 rounded-full flex items-center justify-center shrink-0',
        config.iconBg,
      )}>
        <Icon className={cn('w-4 h-4', config.iconColor)} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <p className={cn(
                'text-sm font-body leading-snug',
                notification.is_read
                  ? 'text-slate font-normal'
                  : 'text-body font-semibold',
              )}>
                {notification.title}
              </p>
              <span className={cn(
                'text-[10px] font-semibold font-body px-1.5 py-0.5 rounded-full',
                notification.type === 'demurrage_warning'
                  ? 'bg-amber-100 text-amber-700'
                  : notification.type === 'milestone_update'
                  ? 'bg-teal-pale text-teal'
                  : 'bg-surface text-slate',
              )}>
                {config.label}
              </span>
            </div>

            <p className="text-sm text-slate font-body mt-1 leading-relaxed">
              {notification.message}
            </p>

            <p className="text-[11px] font-data text-muted mt-2">
              {smartDate(notification.created_at)}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {!notification.is_read && (
              <span className="w-2 h-2 rounded-full bg-teal" />
            )}
            {notification.reference_id && (
              <ChevronRight className="w-4 h-4 text-muted group-hover:text-body transition-colors" />
            )}
          </div>
        </div>
      </div>
    </button>
  );
}

// ── Main page ─────────────────────────────────────────────────

export function Notifications() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('all');

  const { data, isLoading } = useQuery({
    queryKey: ['notifications', 'page', filter],
    queryFn: () =>
      api.get('/api/notifications/all', {
        params: {
          unread_only: filter === 'unread' ? true : undefined,
          type: !['all', 'unread'].includes(filter) ? filter : undefined,
          limit: 100,
        },
      }).then((r: { data: { notifications: Notification[]; unread_count: number } }) => r.data),
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

  function handleRead(id: string, referenceId: string | null) {
    markRead.mutate(id);
    if (referenceId) {
      navigate(`/shipments/${referenceId}`);
    }
  }

  const notifications: Notification[] = data?.notifications ?? [];
  const unreadCount: number = data?.unread_count ?? 0;

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader
        title="Notifications"
        subtitle={
          unreadCount > 0
            ? `${unreadCount} unread`
            : 'All caught up'
        }
        action={
          unreadCount > 0 ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => markAllRead.mutate()}
              loading={markAllRead.isPending}
            >
              <CheckCheck className="w-4 h-4" />
              Mark all read
            </Button>
          ) : undefined
        }
      />

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={cn(
              'h-9 px-4 rounded-full text-sm font-semibold font-body',
              'border transition-colors duration-150',
              filter === f.value
                ? 'bg-midnight text-white border-midnight'
                : 'bg-card text-slate border-border hover:border-border-strong',
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="bg-card rounded-(--r-lg) border border-border overflow-hidden">
        {isLoading && (
          <>
            {[...Array(5)].map((_, i) => <NotificationSkeleton key={i} />)}
          </>
        )}

        {!isLoading && notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-14 h-14 rounded-full bg-surface flex items-center justify-center">
              <Inbox className="w-6 h-6 text-muted" />
            </div>
            <p className="text-sm font-semibold text-body font-body">
              {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
            </p>
            <p className="text-sm text-muted font-body text-center max-w-xs">
              {filter === 'unread'
                ? 'You are all caught up.'
                : 'Notifications appear here when shipment milestones are updated, demurrage warnings fire, or SMS deliveries fail.'}
            </p>
          </div>
        )}

        {!isLoading && notifications.map((n) => (
          <NotificationRow
            key={n.id}
            notification={n}
            onRead={handleRead}
          />
        ))}
      </div>

      {/* Count footer */}
      {!isLoading && notifications.length > 0 && (
        <p className="text-xs text-muted font-body text-center">
          Showing {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  );
}