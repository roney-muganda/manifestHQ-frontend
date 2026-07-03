// src/components/ui/Badge.tsx
import { cn } from '@/lib/utils';

type Variant = 'active' | 'completed' | 'warning' | 'danger' | 'neutral' | 'info';

const styles: Record<Variant, string> = {
  active:    'bg-teal-pale text-teal-dark border-teal/30',
  completed: 'bg-green-50 text-green-700 border-green-200',
  warning:   'bg-amber-50 text-amber-700 border-amber-200',
  danger:    'bg-red-50 text-red-600 border-red-200',
  neutral:   'bg-data-bg text-slate border-border',
  info:      'bg-blue-50 text-blue-700 border-blue-200',
};

export function Badge({
  children,
  variant = 'neutral',
  className,
}: {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 px-2.5 py-1',
      'text-xs font-semibold font-body rounded-md border',
      'leading-none whitespace-nowrap',
      styles[variant],
      className,
    )}>
      {children}
    </span>
  );
}