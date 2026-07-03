// src/components/domain/ShipmentCard.tsx
import { Package, MapPin, Users, Clock } from 'lucide-react';
import { cn, smartDate } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
// We will build DemurrageTimer next
import { DemurrageTimer } from './DemurrageTimer';
// We will define this type later
import type { Shipment } from '@/types';

const MILESTONE_LABELS = [
  'Not started',
  'Cargo Discharged',
  'Documents Lodged',
  'Under Inspection',
  'Duties Paid & Released',
  'Arrived at Nairobi Hub',
];

const PORT_LABELS: Record<string, string> = {
  mombasa: 'Mombasa Port',
  jkia: 'JKIA',
  other: 'Other',
};

export function ShipmentCard({
  shipment,
  onClick,
}: {
  shipment: Shipment;
  onClick: () => void;
}) {
  // Prevent dividing by zero or going out of bounds
  const progress = Math.min(Math.max((shipment.current_milestone / 5) * 100, 0), 100);
  const isCompleted = shipment.status === 'completed';
  const isCancelled = shipment.status === 'cancelled';

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-left bg-card rounded-lg border',
        'transition-all duration-200 group',
        'hover:border-teal/40 hover:shadow-md',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal',
        isCompleted ? 'border-green' : 'border-border',
        isCancelled && 'opacity-60',
      )}
    >
      {/* Card top strip — colour-coded by urgency */}
      <div className={cn(
        'h-1 rounded-t-lg',
        isCompleted    ? 'bg-green' :
        isCancelled    ? 'bg-muted' :
        shipment.demurrage_status === 'critical' ? 'bg-red' :
        shipment.demurrage_status === 'warning'  ? 'bg-amber' :
        'bg-teal'
      )} />

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-9 h-9 rounded-md flex items-center justify-center shrink-0',
              isCompleted ? 'bg-green-pale' : 'bg-teal-pale',
            )}>
              <Package className={cn(
                'w-4 h-4',
                isCompleted ? 'text-green' : 'text-teal'
              )} />
            </div>
            <div>
              {/* Reference number — always monospace */}
              <p className="text-sm font-data font-semibold text-body tracking-wide">
                {shipment.reference_no}
              </p>
              <p className="text-xs text-muted font-body mt-0.5">
                {shipment.product_category}
              </p>
            </div>
          </div>
          <Badge variant={
            isCompleted ? 'completed' :
            isCancelled ? 'neutral' :
            shipment.demurrage_status === 'critical' ? 'danger' :
            shipment.demurrage_status === 'warning'  ? 'warning' :
            'active'
          }>
            {isCompleted ? 'Completed' :
             isCancelled ? 'Cancelled' :
             MILESTONE_LABELS[shipment.current_milestone]}
          </Badge>
        </div>

        {/* Progress bar */}
        {!isCancelled && (
          <div className="mb-4">
            <div className="h-1.5 bg-data-bg rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-700',
                  isCompleted ? 'bg-green' : 'bg-teal'
                )}
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between mt-1.5">
              <span className="text-[11px] text-muted font-body">
                Step {shipment.current_milestone} of 5
              </span>
              <span className="text-[11px] font-data text-slate">
                {Math.round(progress)}%
              </span>
            </div>
          </div>
        )}

        {/* Demurrage timer — only if cargo discharged and not complete */}
        {shipment.cargo_discharged_at && !isCompleted && !isCancelled && (
          <DemurrageTimer
            dischargedAt={shipment.cargo_discharged_at}
            freePeriodDays={shipment.free_period_days}
            dailyRate={shipment.daily_demurrage_rate}
          />
        )}

        {/* Footer row */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-1.5 text-[11px] text-muted font-body">
            <MapPin className="w-3 h-3" />
            {PORT_LABELS[shipment.port_of_entry] || shipment.port_of_entry}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-muted font-body">
            <Users className="w-3 h-3" />
            {shipment.merchant_count} merchant{shipment.merchant_count !== 1 ? 's' : ''}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-muted font-body ml-auto">
            <Clock className="w-3 h-3" />
            {smartDate(shipment.updated_at)}
          </div>
        </div>
      </div>
    </button>
  );
}