// src/components/domain/DemurrageTimer.tsx
import { AlertTriangle, Clock, CheckCircle2 } from 'lucide-react';
import { cn, calculateDemurrage, formatKES } from '@/lib/utils';
import { formatDistanceToNow, format } from 'date-fns';
import { useEffect, useState } from 'react';

export function DemurrageTimer({
  dischargedAt,
  freePeriodDays,
  dailyRate,
}: {
  dischargedAt: string;
  freePeriodDays: number;
  dailyRate: number;
}) {
  // Pass a function to useState (Lazy Initialization) to guarantee a pure render cycle
  const [currentTime, setCurrentTime] = useState(() => Date.now());

  // Re-render every minute by updating the exact time in state
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(Date.now()), 60000);
    return () => clearInterval(interval);
  }, []);

  const { daysInDemurrage, totalCost, isInDemurrage, freeEndsAt } =
    calculateDemurrage(dischargedAt, freePeriodDays, dailyRate);

  // Use the React-managed currentTime state
  const hoursUntilFreeEnds = (freeEndsAt.getTime() - currentTime) / 3600000;
  const isWarning = !isInDemurrage && hoursUntilFreeEnds < 48;
  const isCritical = isInDemurrage;

  return (
    <div className={cn(
      'flex items-start gap-3 p-3 rounded-lg text-sm font-body transition-colors',
      isCritical ? 'bg-red-pale border border-red/30' :
      isWarning  ? 'bg-amber-pale border border-amber/30' :
                   'bg-data-bg border border-border',
    )}>
      <div className={cn(
        'mt-0.5 shrink-0',
        isCritical ? 'text-red' :
        isWarning  ? 'text-amber' :
                     'text-muted',
      )}>
        {isCritical ? <AlertTriangle className="w-4 h-4" /> :
         isWarning  ? <Clock className="w-4 h-4" /> :
                      <CheckCircle2 className="w-4 h-4" />}
      </div>

      <div className="flex-1 min-w-0">
        {isCritical ? (
          <>
            <p className="font-semibold text-red text-xs tracking-tight">
              In demurrage — {daysInDemurrage} day{daysInDemurrage !== 1 ? 's' : ''}
            </p>
            <p className="text-red/80 text-xs mt-0.5">
              Storage cost accrued:{' '}
              <span className="font-data font-semibold">{formatKES(totalCost)}</span>
              {' '}at {formatKES(dailyRate)}/day
            </p>
          </>
        ) : isWarning ? (
          <>
            <p className="font-semibold text-amber text-xs tracking-tight">
              Free period ends {formatDistanceToNow(freeEndsAt, { addSuffix: true })}
            </p>
            <p className="text-amber/80 text-xs mt-0.5">
              Storage fees begin{' '}
              <span className="font-data font-semibold">
                {format(freeEndsAt, 'dd MMM · HH:mm')}
              </span>
            </p>
          </>
        ) : (
          <p className="text-muted text-xs">
            Free storage until{' '}
            <span className="font-data font-medium text-slate">
              {format(freeEndsAt, 'dd MMM · HH:mm')}
            </span>
          </p>
        )}
      </div>
    </div>
  );
}