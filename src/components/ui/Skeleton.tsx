// src/components/ui/Skeleton.tsx
import { cn } from '@/lib/utils';

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn(
      'bg-slate/20 rounded animate-pulse',
      className,
    )} />
  );
}

export function ShipmentCardSkeleton() {
  return (
    <div className="bg-card rounded-lg border border-border p-5">
      <Skeleton className="h-1 -mx-5 -mt-5 mb-5 rounded-t-lg" />
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Skeleton className="w-9 h-9 rounded-md shrink-0" />
          <div className="space-y-2">
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
        <Skeleton className="h-6 w-24 rounded-md" />
      </div>
      <Skeleton className="h-1.5 w-full rounded-full mb-4" />
      <div className="flex gap-4 pt-4 border-t border-border">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-28 ml-auto" />
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-card rounded-lg border border-border p-5">
            <Skeleton className="h-3 w-24 mb-3" />
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-3 w-32" />
          </div>
        ))}
      </div>
      {/* Shipment cards */}
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => <ShipmentCardSkeleton key={i} />)}
      </div>
    </div>
  );
}