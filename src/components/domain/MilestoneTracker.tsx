// src/components/domain/MilestoneTracker.tsx
import { Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import type { Milestone } from '@/types';

const STAGES = [
  { id: 1, short: 'Discharged',  label: 'Cargo Discharged',        icon: '⚓' },
  { id: 2, short: 'Filed',       label: 'Documents Lodged',        icon: '📋' },
  { id: 3, short: 'Inspected',   label: 'Under Inspection',        icon: '🔍' },
  { id: 4, short: 'Cleared',     label: 'Duties Paid & Released',  icon: '✅' },
  { id: 5, short: 'Delivered',   label: 'Arrived at Nairobi Hub',  icon: '🏭' },
];

export function MilestoneTracker({
  currentMilestone,
  milestones = [],
}: {
  currentMilestone: number;
  milestones: Milestone[];
}) {
  const getTimestamp = (stage: number) =>
    milestones.find((m) => m.stage === stage)?.created_at;

  return (
    <div className="relative">
      {/* Connector line */}
      <div className="
        absolute top-5 left-5 right-5 h-[2px]
        bg-border rounded-full
      ">
        <div
          className="h-full bg-teal rounded-full transition-all duration-700"
          // Math adjusted: divide by (stages - 1) to perfectly align with node centers
          style={{ width: `${Math.min((currentMilestone / (STAGES.length - 1)) * 100, 100)}%` }}
        />
      </div>

      {/* Stage nodes */}
      <div className="relative flex justify-between">
        {STAGES.map((stage) => {
          const isComplete = currentMilestone >= stage.id;
          const isCurrent  = currentMilestone === stage.id - 1;
          const timestamp  = getTimestamp(stage.id);

          return (
            <div key={stage.id} className="flex flex-col items-center gap-2 relative">
              {/* Node */}
              <div className={cn(
                'w-10 h-10 rounded-full border-2 flex items-center justify-center',
                'transition-all duration-300 z-10',
                'bg-card',
                isComplete
                  ? 'border-teal bg-teal'
                  : isCurrent
                  ? 'border-teal border-dashed'
                  : 'border-border',
              )}>
                {isComplete ? (
                  <Check className="w-4 h-4 text-white" strokeWidth={2.5} />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-teal animate-spin" />
                ) : (
                  <span className="text-base">{stage.icon}</span>
                )}
              </div>

              {/* Label block */}
              <div className="text-center max-w-[80px]">
                <p className={cn(
                  'text-[11px] font-semibold font-body leading-tight',
                  isComplete ? 'text-teal' : isCurrent ? 'text-body' : 'text-muted',
                )}>
                  {stage.short}
                </p>
                {timestamp ? (
                  <p className="text-[10px] font-data text-muted mt-0.5">
                    {format(new Date(timestamp), 'dd MMM HH:mm')}
                  </p>
                ) : (
                  <p className="text-[10px] text-border font-body mt-0.5">—</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}