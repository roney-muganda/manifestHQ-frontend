// src/components/ui/Input.tsx
import { cn } from '@/lib/utils';
import { forwardRef, useId } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  prefix?: string;   // e.g. "+254" for phone fields
  mono?: boolean;    // Use JetBrains Mono for data inputs
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label, error, hint, prefix, mono = false, className, id, ...props
}, ref) => {
  const generatedId = useId();
  const inputId = id || generatedId;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-semibold text-body font-body">
          {label}
        </label>
      )}
      <div className={cn(
        'flex items-center rounded-md border bg-card',
        'transition-colors duration-150',
        'focus-within:border-teal focus-within:ring-2 focus-within:ring-teal/15',
        error ? 'border-red' : 'border-border',
      )}>
        {prefix && (
          <span className="pl-3 pr-2 text-sm font-data font-semibold text-slate border-r border-border">
            {prefix}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={cn(error && errorId, hint && !error && hintId) || undefined}
          className={cn(
            'flex-1 px-3 py-2.5 text-sm bg-transparent outline-none text-body',
            'placeholder:text-muted',
            mono ? 'font-data' : 'font-body',
            prefix && 'pl-2.5',
            className,
          )}
          {...props}
        />
      </div>
      {error && (
        <p id={errorId} className="text-xs text-red font-body">{error}</p>
      )}
      {hint && !error && (
        <p id={hintId} className="text-xs text-muted font-body">{hint}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';