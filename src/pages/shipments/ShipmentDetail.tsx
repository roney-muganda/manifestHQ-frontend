// src/pages/shipments/ShipmentDetail.tsx
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { PageHeader } from '@/components/layout/PageHeader';
import { MilestoneTracker } from '@/components/domain/MilestoneTracker';
import { DemurrageTimer } from '@/components/domain/DemurrageTimer';
import { SMSLogTimeline } from '@/components/domain/SMSLogTimeline';
import { MilestoneUpdateModal } from '@/components/domain/MilestoneUpdateModal';
import { ConfirmModal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useUIStore } from '@/store/uiStore';
import { ArrowLeft, ChevronRight, Send, XCircle } from 'lucide-react';
import { getReadableError } from '@/lib/errors';
import type { Shipment } from '@/types';

export function ShipmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showToast } = useUIStore();

  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const { data: shipment, isLoading } = useQuery({
    queryKey: ['shipment', id],
    queryFn: () => api.get(`/api/shipments/${id}`).then((r) => r.data),
    refetchInterval: 30000,
  });

  async function resendLink(phone: string) {
    try {
      await api.post('/api/merchants/resend-tracking-link', { phone });
      showToast('Tracking link resent successfully.', 'success');
    } catch (err) {
      showToast(getReadableError(err), 'error');
    }
  }

  async function handleCancel() {
    setCancelling(true);
    try {
      await api.delete(`/api/shipments/${id}`, { data: { reason: 'Cancelled by agent' } });
      showToast('Shipment cancelled.', 'info');
      queryClient.invalidateQueries({ queryKey: ['shipments'] });
      navigate('/shipments');
    } catch (err) {
      showToast(getReadableError(err), 'error');
    } finally {
      setCancelling(false);
    }
  }

  if (isLoading || !shipment) {
    return <div className="h-64 flex items-center justify-center text-muted">Loading...</div>;
  }

  const s = shipment as Shipment;
  const nextStage = s.current_milestone + 1;
  const canUpdate = s.status === 'active' && nextStage <= 5;

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/shipments')}
        className="flex items-center gap-1.5 text-sm text-slate font-body hover:text-body transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to shipments
      </button>

      <PageHeader
        title={s.reference_no}
        subtitle={`${s.product_category} · ${s.port_of_entry}`}
        action={
          <div className="flex items-center gap-3">
            <Badge variant={s.status === 'completed' ? 'completed' : s.status === 'cancelled' ? 'neutral' : 'active'}>
              {s.status}
            </Badge>
            {s.status === 'active' && (
              <button onClick={() => setShowCancelModal(true)} className="text-red text-sm font-body flex items-center gap-1 hover:opacity-80 transition-opacity">
                <XCircle className="w-4 h-4" /> Cancel
              </button>
            )}
          </div>
        }
      />

      <div className="bg-card rounded-lg border border-border p-6">
        <MilestoneTracker currentMilestone={s.current_milestone} milestones={s.milestones} />
      </div>

      {s.cargo_discharged_at && s.status === 'active' && (
        <DemurrageTimer
          dischargedAt={s.cargo_discharged_at}
          freePeriodDays={s.free_period_days}
          dailyRate={s.daily_demurrage_rate}
        />
      )}

      {canUpdate && (
        <Button onClick={() => setShowMilestoneModal(true)} size="lg" className="w-full sm:w-auto">
          Update to Stage {nextStage}
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-xs font-semibold text-muted uppercase tracking-wide mb-4">
            Merchants ({s.merchants?.length ?? 0})
          </h3>
          <div className="space-y-3">
            {s.merchants?.map((m) => (
              <div key={m.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-semibold text-body">{m.name || 'Unnamed merchant'}</p>
                  <p className="text-xs font-data text-muted">{m.phone}</p>
                </div>
                <button
                  onClick={() => resendLink(m.phone)}
                  className="flex items-center gap-1 text-xs text-teal font-semibold hover:underline"
                >
                  <Send className="w-3 h-3" /> Resend link
                </button>
              </div>
            ))}
          </div>
        </div>

        <SMSLogTimeline shipmentId={id!} />
      </div>

      <MilestoneUpdateModal
        open={showMilestoneModal}
        onClose={() => setShowMilestoneModal(false)}
        shipmentId={id!}
        stage={nextStage}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['shipment', id] });
          showToast('Milestone updated. Merchants notified.', 'success');
        }}
      />

      <ConfirmModal
        open={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancel}
        title="Cancel this shipment?"
        message="This action will notify all merchants and cannot be undone."
        confirmLabel="Cancel Shipment"
        variant="danger"
        loading={cancelling}
      />
    </div>
  );
}