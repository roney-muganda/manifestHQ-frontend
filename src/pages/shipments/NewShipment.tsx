// src/pages/shipments/NewShipment.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/services/api';
import { PageHeader } from '@/components/layout/PageHeader';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Plus, Trash2 } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import { getReadableError } from '@/lib/errors';

interface MerchantRow {
  phone: string;
  name: string;
  allocation_description: string;
}

const CATEGORIES = [
  'Electronics & Phones', 'Household Appliances', 'Clothing & Textiles',
  'Footwear', 'Computer Equipment', 'Solar & Electrical Equipment',
  'Furniture', 'Other',
];

export function NewShipment() {
  const navigate = useNavigate();
  const { showToast } = useUIStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    reference_no: '',
    port_of_entry: 'mombasa',
    product_category: '',
    free_period_days: 4,
    daily_demurrage_rate: '3500',
    is_lcl: false,
  });

  const [merchants, setMerchants] = useState<MerchantRow[]>([
    { phone: '', name: '', allocation_description: '' },
  ]);

  function updateMerchant(idx: number, field: keyof MerchantRow, value: string) {
    setMerchants((m) => m.map((row, i) => (i === idx ? { ...row, [field]: value } : row)));
  }

  function addMerchant() {
    setMerchants((m) => [...m, { phone: '', name: '', allocation_description: '' }]);
  }

  function removeMerchant(idx: number) {
    setMerchants((m) => m.filter((_, i) => i !== idx));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/api/shipments', {
        ...form,
        merchants: merchants.filter((m) => m.phone.trim()),
      });
      showToast('Shipment created. Merchants have been notified.', 'success');
      navigate(`/shipments/${data.id}`);
    } catch (err) {
      setError(getReadableError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader title="New Shipment" subtitle="Add a shipment and its merchants to start tracking." />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-card rounded-lg border border-border p-6 space-y-4">
          <h3 className="text-xs font-semibold text-muted uppercase tracking-wide">Shipment Details</h3>

          <Input
            label="Container ID or Air Waybill Number"
            required
            mono
            placeholder="MSKU1234567"
            value={form.reference_no}
            onChange={(e) => setForm((f) => ({ ...f, reference_no: e.target.value.toUpperCase() }))}
          />

          <div>
            <label className="text-sm font-semibold text-body block mb-1.5">Port of Entry</label>
            <div className="flex gap-2">
              {[{ v: 'mombasa', l: 'Mombasa' }, { v: 'jkia', l: 'JKIA' }, { v: 'other', l: 'Other' }].map((p) => (
                <button
                  key={p.v}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, port_of_entry: p.v }))}
                  className={`flex-1 h-10 rounded-md text-sm font-semibold border transition-colors ${
                    form.port_of_entry === p.v ? 'bg-midnight text-white border-midnight' : 'bg-card text-slate border-border hover:border-slate/40'
                  }`}
                >
                  {p.l}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-body block mb-1.5">Product Category</label>
            <select
              required
              value={form.product_category}
              onChange={(e) => setForm((f) => ({ ...f, product_category: e.target.value }))}
              className="w-full h-10 px-3 text-sm text-body bg-card border border-border rounded-md outline-none focus:border-teal transition-colors"
            >
              <option value="">Select category</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Free storage (days)" type="number" mono value={form.free_period_days}
              onChange={(e) => setForm((f) => ({ ...f, free_period_days: Number(e.target.value) }))} />
            <Input label="Daily storage rate" type="number" mono prefix="KES" value={form.daily_demurrage_rate}
              onChange={(e) => setForm((f) => ({ ...f, daily_demurrage_rate: e.target.value }))} />
          </div>

          <label className="flex items-center gap-2 text-sm text-body cursor-pointer">
            <input type="checkbox" checked={form.is_lcl} onChange={(e) => setForm((f) => ({ ...f, is_lcl: e.target.checked }))} className="w-4 h-4 accent-teal" />
            Consolidated (LCL) shipment
          </label>
        </div>

        <div className="bg-card rounded-lg border border-border p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-muted uppercase tracking-wide">Merchants</h3>
            <button type="button" onClick={addMerchant} className="text-sm text-teal font-semibold flex items-center gap-1 hover:underline">
              <Plus className="w-3.5 h-3.5" /> Add merchant
            </button>
          </div>

          {merchants.map((m, idx) => (
            <div key={idx} className="p-4 bg-surface rounded-md space-y-3 border border-border/50">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted">Merchant {idx + 1}</span>
                {merchants.length > 1 && (
                  <button type="button" onClick={() => removeMerchant(idx)} className="text-red hover:opacity-70">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input label="Phone" required prefix="+254" value={m.phone}
                  onChange={(e) => updateMerchant(idx, 'phone', e.target.value)} placeholder="712345678" />
                <Input label="Name" value={m.name}
                  onChange={(e) => updateMerchant(idx, 'name', e.target.value)} placeholder="Optional" />
              </div>
              {form.is_lcl && (
                <Input label="Allocation" value={m.allocation_description}
                  onChange={(e) => updateMerchant(idx, 'allocation_description', e.target.value)} placeholder="e.g. 50 units" />
              )}
            </div>
          ))}
        </div>

        {error && <p className="text-sm text-red bg-red-pale border border-red/30 rounded-md px-3 py-2">{error}</p>}

        <div className="flex gap-3">
          <Button type="submit" loading={loading} size="lg">Create Shipment</Button>
          <Button type="button" variant="secondary" size="lg" onClick={() => navigate('/shipments')}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}