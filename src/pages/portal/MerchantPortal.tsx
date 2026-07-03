// src/pages/portal/MerchantPortal.tsx
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Package, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';

interface PortalMilestone {
  stage: number;
  created_at: string;
}

interface PortalShipment {
  reference_no: string;
  product_category: string;
  current_milestone: number;
  milestones: PortalMilestone[];
  allocation_description?: string;
}

interface PortalData {
  merchant: { name: string };
  shipments: PortalShipment[];
}

const STAGES = [
  { id: 1, label: 'Cargo Discharged' },
  { id: 2, label: 'Documents Lodged' },
  { id: 3, label: 'Under Inspection' },
  { id: 4, label: 'Duties Paid & Released' },
  { id: 5, label: 'Arrived at Nairobi Hub' },
];

export function MerchantPortal() {
  const { token } = useParams();

  const { data, isLoading, isError } = useQuery<PortalData>({
    queryKey: ['portal', token],
    queryFn: () => api.get(`/api/merchants/portal/${token}`).then((r) => r.data),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-teal border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center px-6 text-center">
        <div>
          <p className="text-lg font-display font-bold text-body mb-2 tracking-tight">Link expired</p>
          <p className="text-sm text-slate font-body">
            This tracking link is no longer valid. Ask your clearing agent to send you a new one.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface pb-12">
      <header className="bg-midnight px-5 py-5">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-teal flex items-center justify-center">
            <span className="text-midnight font-display font-bold text-xs">M</span>
          </div>
          <span className="font-display font-bold text-white tracking-tight">ManifestHQ</span>
        </div>
        <p className="text-sm text-slate font-body mt-2">
          Hi {data.merchant.name || 'there'}, here's your shipment status.
        </p>
      </header>

      <main className="px-4 space-y-4 mt-4">
        {data.shipments.map((s) => (
          <div key={s.reference_no} className="bg-card rounded-xl shadow-md overflow-hidden border border-border">
            <div className="px-5 py-4 border-b border-border flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-teal-pale flex items-center justify-center shrink-0">
                <Package className="w-4 h-4 text-teal" />
              </div>
              <div>
                <p className="font-data font-semibold text-base text-body">{s.reference_no}</p>
                <p className="text-sm text-muted font-body">{s.product_category}</p>
              </div>
            </div>

            <div className="px-5 py-5 space-y-4">
              {STAGES.map((stage) => {
                const milestone = s.milestones.find((m) => m.stage === stage.id);
                const isDone = s.current_milestone >= stage.id;
                const isCurrent = s.current_milestone === stage.id - 1;

                return (
                  <div key={stage.id} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-teal" />
                      ) : (
                        <div className={`w-5 h-5 rounded-full border-2 ${isCurrent ? 'border-teal border-dashed' : 'border-border'}`} />
                      )}
                      {stage.id < 5 && <div className={`w-0.5 h-8 ${isDone ? 'bg-teal' : 'bg-border'}`} />}
                    </div>
                    <div className="pb-2">
                      <p className={`text-base font-semibold font-body ${isDone ? 'text-body' : 'text-muted'}`}>
                        {stage.label}
                      </p>
                      {milestone && (
                        <p className="text-sm text-muted font-body mt-0.5">
                          {format(new Date(milestone.created_at), 'dd MMM yyyy · HH:mm')}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {s.allocation_description && (
              <div className="px-5 py-4 bg-surface border-t border-border">
                <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-1">Your goods</p>
                <p className="text-sm text-body font-body">{s.allocation_description}</p>
              </div>
            )}
          </div>
        ))}
      </main>
    </div>
  );
}