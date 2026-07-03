// src/components/domain/MilestoneUpdateModal.tsx
import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { api } from '@/services/api'; // Corrected import
import { Upload, FileText } from 'lucide-react';
import { getReadableError } from '@/lib/errors';

const STAGE_LABELS: Record<number, string> = {
  1: 'Cargo Discharged',
  2: 'Documents Lodged',
  3: 'Under Inspection',
  4: 'Duties Paid & Released',
  5: 'Arrived at Nairobi Hub',
};

export function MilestoneUpdateModal({
  open, onClose, shipmentId, stage, onSuccess,
}: {
  open: boolean; onClose: () => void;
  shipmentId: string; stage: number; onSuccess: () => void;
}) {
  const [notes, setNotes] = useState('');
  const [dutyAmount, setDutyAmount] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const requiresDuty = stage === 4;

  async function handleSubmit() {
    setError('');
    if (requiresDuty && !dutyAmount) {
      setError('Duty amount is required at this stage.');
      return;
    }
    setLoading(true);
    try {
      await api.post(`/api/milestones/${shipmentId}`, {
        stage,
        notes: notes || null,
        duty_amount_kes: requiresDuty ? dutyAmount : null,
      });

      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        await api.post(`/api/milestones/${shipmentId}/upload/${stage}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      onSuccess();
      onClose();
      // Reset form
      setNotes(''); setDutyAmount(''); setFile(null);
    } catch (err) {
      setError(getReadableError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={`Stage ${stage}: ${STAGE_LABELS[stage]}`}>
      <div className="space-y-4">
        <p className="text-sm text-slate font-body">
          All merchants on this shipment will receive an SMS update automatically.
        </p>

        {requiresDuty && (
          <Input
            label="Duty amount paid (required)"
            type="number"
            mono
            prefix="KES"
            required
            value={dutyAmount}
            onChange={(e) => setDutyAmount(e.target.value)}
            placeholder="45000"
          />
        )}

        <div>
          <label className="text-sm font-semibold text-body font-body block mb-1.5">Notes (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full px-3 py-2.5 text-sm font-body text-body bg-card border border-border rounded-md outline-none focus:border-teal resize-none transition-colors"
            placeholder="Any additional context for this update..."
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-body font-body block mb-1.5">Document (optional)</label>
          <label className="flex items-center gap-3 p-3 border border-dashed border-border rounded-md cursor-pointer hover:border-teal transition-colors">
            {file ? (
              <><FileText className="w-4 h-4 text-teal" /><span className="text-sm font-body text-body truncate">{file.name}</span></>
            ) : (
              <><Upload className="w-4 h-4 text-muted" /><span className="text-sm font-body text-muted">Upload PDF or image (max 10MB)</span></>
            )}
            <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png,.webp"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          </label>
        </div>

        {error && (
          <p className="text-sm text-red font-body bg-red-pale border border-red/30 rounded-md px-3 py-2">
            {error}
          </p>
        )}

        <div className="flex gap-3 justify-end pt-2">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} loading={loading}>Confirm Update</Button>
        </div>
      </div>
    </Modal>
  );
}