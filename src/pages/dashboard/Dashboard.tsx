// src/pages/dashboard/Dashboard.tsx
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { ShipmentCard } from '@/components/domain/ShipmentCard';
import { DashboardSkeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/layout/PageHeader';
import { useNavigate } from 'react-router-dom';
import { Plus, AlertCircle } from 'lucide-react';
// We will define the generic Shipment type soon, so we use any temporarily or ignore it if inferred
import type { Shipment } from '@/types'; 

function StatCard({ label, value, sub, variant = 'default' }: {
  label: string; value: string | number;
  sub?: string; variant?: 'default' | 'warning' | 'danger';
}) {
  return (
    <div className="bg-card rounded-lg border border-border p-5">
      <p className="text-xs font-semibold text-muted font-body uppercase tracking-wide mb-2">
        {label}
      </p>
      <p className={`text-3xl font-data font-semibold mb-1 ${
        variant === 'danger'  ? 'text-red' :
        variant === 'warning' ? 'text-amber' :
        'text-body'
      }`}>
        {value}
      </p>
      {sub && <p className="text-xs text-muted font-body">{sub}</p>}
    </div>
  );
}

export function Dashboard() {
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api.get('/api/dashboard').then((r) => r.data),
    refetchInterval: 60000,   // Refresh every minute
  });

  if (isLoading) return <DashboardSkeleton />;

  const criticalCount = data?.shipments?.filter(
    (s: Shipment) => s.demurrage_status === 'critical'
  ).length ?? 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle={new Date().toLocaleDateString('en-KE', {
          weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
        })}
        action={
          <Button onClick={() => navigate('/shipments/new')}>
            <Plus className="w-4 h-4" />
            New Shipment
          </Button>
        }
      />

      {/* Critical alert banner */}
      {criticalCount > 0 && (
        <div className="flex items-center gap-3 p-4 bg-red-pale border border-red/30 rounded-md">
          <AlertCircle className="w-5 h-5 text-red shrink-0" />
          <p className="text-sm text-red font-body">
            <span className="font-semibold">
              {criticalCount} shipment{criticalCount !== 1 ? 's' : ''} in demurrage
            </span>
            {' '}— storage fees are accruing daily. Update milestone status or contact the port agent.
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Active Shipments"
          value={data?.stats?.active ?? 0}
          sub="Currently in clearance"
        />
        <StatCard
          label="In Demurrage"
          value={data?.stats?.in_demurrage ?? 0}
          sub="Storage fees accruing"
          variant={data?.stats?.in_demurrage > 0 ? 'danger' : 'default'}
        />
        <StatCard
          label="Completed This Month"
          value={data?.stats?.completed_month ?? 0}
          sub={`${data?.stats?.sms_sent_month ?? 0} SMS sent`}
        />
      </div>

      {/* Shipment list */}
      <div>
        <h2 className="text-sm font-semibold text-muted font-body uppercase tracking-wide mb-3">
          Active Shipments
        </h2>
        {data?.shipments?.length === 0 ? (
          <div className="bg-card rounded-lg border border-dashed border-border p-12 flex flex-col items-center justify-center">
            <p className="text-muted font-body text-sm">No active shipments.</p>
            <Button
              variant="secondary"
              size="sm"
              className="mt-4"
              onClick={() => navigate('/shipments/new')}
            >
              <Plus className="w-4 h-4" />
              Create your first shipment
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {data?.shipments?.map((shipment: Shipment) => (
              <ShipmentCard
                key={shipment.id}
                shipment={shipment}
                onClick={() => navigate(`/shipments/${shipment.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}