// src/components/layout/PageHeader.tsx
export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between flex-wrap gap-4 mb-2">
      <div>
        <h1 className="text-2xl font-display font-bold text-body tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-muted font-body mt-1">
            {subtitle}
          </p>
        )}
      </div>
      {action && (
        <div className="shrink-0">
          {action}
        </div>
      )}
    </div>
  );
}