// src/components/ui/Toast.tsx
import { useUIStore } from '@/store/uiStore'; // Fixed import name
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

// Adjusted to use semantic theme colors
const config = {
  success: { icon: CheckCircle2, bg: 'bg-green-pale', border: 'border-green/30', text: 'text-green', iconColor: 'text-green' },
  error:   { icon: XCircle,      bg: 'bg-red-pale',   border: 'border-red/30',   text: 'text-red',   iconColor: 'text-red' },
  info:    { icon: Info,         bg: 'bg-data-bg',    border: 'border-border',   text: 'text-slate', iconColor: 'text-slate' },
};

export function ToastContainer() {
  const { toasts, dismissToast } = useUIStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => {
        const c = config[toast.variant];
        const Icon = c.icon;
        return (
          <div
            key={toast.id}
            className={cn(
              'flex items-start gap-3 p-4 rounded-md border shadow-md',
              // Note: animate-in requires tailwindcss-animate plugin or custom keyframes
              'animate-in slide-in-from-bottom-2 fade-in duration-200',
              c.bg, c.border,
            )}
          >
            <Icon className={cn('w-5 h-5 shrink-0 mt-0.5', c.iconColor)} />
            <p className={cn('text-sm font-body flex-1', c.text)}>{toast.message}</p>
            <button onClick={() => dismissToast(toast.id)} className={cn('hover:opacity-70 transition-opacity', c.iconColor)}>
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}