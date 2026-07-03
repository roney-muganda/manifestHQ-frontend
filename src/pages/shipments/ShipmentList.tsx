// src/pages/shipments/ShipmentList.tsx
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { api } from '@/services/api';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { ShipmentCard } from '@/components/domain/ShipmentCard';
import { ShipmentCardSkeleton } from '@/components/ui/Skeleton';
import { Plus } from 'lucide-react';
import type { Shipment } from '@/types';

const FILTERS = [
  { label: 'Active', value: 'active' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
];

export function ShipmentList() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('active');

  const { data, isLoading } = useQuery({
    queryKey: ['shipments', filter],
    queryFn: () => api.get(`/api/shipments?status=${filter}`).then((r) => r.data),
  });

  // Helper to render the main content area
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <ShipmentCardSkeleton key={i} />)}
        </div>
      );
    }

    if (!data?.shipments || data.shipments.length === 0) {
      return (
        <div className="bg-card rounded-lg border border-dashed border-border p-12 flex flex-col items-center justify-center text-center">
          <p className="text-muted font-body text-sm">No {filter} shipments found.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {data.shipments.map((s: Shipment) => (
          <ShipmentCard 
            key={s.id} 
            shipment={s} 
            onClick={() => navigate(`/shipments/${s.id}`)} 
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Shipments"
        subtitle={`${data?.total ?? 0} shipment${data?.total !== 1 ? 's' : ''}`}
        action={
          <Button onClick={() => navigate('/shipments/new')}>
            <Plus className="w-4 h-4" /> New Shipment
          </Button>
        }
      />

      <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`h-9 px-4 rounded-full text-sm font-semibold font-body border transition-colors shrink-0 ${
              filter === f.value
                ? 'bg-midnight text-white border-midnight'
                : 'bg-card text-slate border-border hover:border-slate/40'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {renderContent()}
    </div>
  );
}