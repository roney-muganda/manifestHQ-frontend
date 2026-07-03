// src/components/domain/SMSLogTimeline.tsx
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { MessageSquare, Check, Clock, X } from 'lucide-react';
import { smartDate, cn } from '@/lib/utils';
import type { SMSLogEntry } from '@/types';

const statusConfig = {
  delivered: { icon: Check, color: 'text-green' },
  sent:      { icon: Clock, color: 'text-amber' },
  pending:   { icon: Clock, color: 'text-muted' },
  failed:    { icon: X,     color: 'text-red' },
};

export function SMSLogTimeline({ shipmentId }: { shipmentId: string }) {
  const { data } = useQuery({
    queryKey: ['sms-log', shipmentId],
    queryFn: () => api.get(`/api/shipments/${shipmentId}/sms-log`).then((r) => r.data),
  });

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h3 className="text-sm font-semibold text-muted font-body uppercase tracking-wide mb-4 flex items-center gap-2">
        <MessageSquare className="w-3.5 h-3.5" /> SMS Activity
      </h3>
      <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
        {(!data?.logs || data.logs.length === 0) && (
          <p className="text-sm text-muted font-body">No SMS sent yet.</p>
        )}
        {data?.logs?.map((log: SMSLogEntry) => {
          const c = statusConfig[log.status] ?? statusConfig.pending;
          const Icon = c.icon;
          return (
            <div key={log.id} className="flex items-start gap-3 pb-3 border-b border-border last:border-0">
              <Icon className={cn('w-3.5 h-3.5 mt-1 shrink-0', c.color)} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-data text-muted">{log.recipient_phone}</p>
                <p className="text-sm text-body font-body line-clamp-2 leading-relaxed">{log.message_body}</p>
              </div>
              <span className="text-[11px] text-muted font-body shrink-0 pl-2">
                {smartDate(log.created_at)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}