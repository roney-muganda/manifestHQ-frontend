import { useState, useId } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { formatKES } from '@/lib/utils';
import { api } from '@/services/api';
import { Calculator as CalcIcon, Info } from 'lucide-react';
import { useAuthStore } from '@/store/authStore'; // Added to check auth state

const CATEGORIES = [
  'Electronics & Phones',
  'Household Appliances',
  'Clothing & Textiles',
  'Footwear',
  'Computer Equipment',
  'Solar & Electrical Equipment',
  'Furniture',
  'Other',
];

// UPDATED to exactly match the JSON from your backend screenshot
interface CalculatorResult {
  cif_value_kes: string;
  import_duty_kes: string;
  import_duty_rate_pct: string;
  vat_kes: string;
  idf_levy_kes: string;
  rdl_levy_kes: string;
  total_landed_cost_kes: string;
  effective_total_rate_pct: string;
}

export function Calculator() {
  const user = useAuthStore((state) => state.user); // Check if logged in
  
  const [cifUsd, setCifUsd] = useState('');
  const [category, setCategory] = useState('');
  const [mode, setMode] = useState<'sea' | 'air'>('sea');
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const categoryId = useId();

  async function calculate() {
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/api/calculator', {
        cif_usd: parseFloat(cifUsd),
        product_category: category,
        shipment_mode: mode,
      });
      setResult(data);
    } catch {
      setError('Calculation failed. Check your inputs and try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    // If logged in, we don't need min-h-screen because the dashboard layout handles it
    <div className={user ? "bg-surface" : "min-h-screen bg-surface"}>
      
      {/* Hide the public header if the user is logged in (sidebar handles nav) */}
      {!user && (
        <header className="bg-midnight px-6 py-4 flex items-center gap-3">
          <div className="w-6 h-6 rounded bg-teal flex items-center justify-center">
            <span className="text-midnight font-display font-bold text-xs">M</span>
          </div>
          <span className="font-display font-bold text-white">ManifestHQ</span>
          <span className="text-muted text-sm font-body ml-2">
            · KRA Duty Calculator
          </span>
        </header>
      )}

      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-teal-pale text-teal text-xs font-semibold font-body px-3 py-1.5 rounded-full mb-4">
            <CalcIcon className="w-3.5 h-3.5" />
            Free Tool · No account required
          </div>
          <h1 className="text-3xl font-display font-bold text-body mb-3">
            Kenya Import Duty Calculator
          </h1>
          <p className="text-slate font-body">
            Estimate your total landed cost before your goods arrive.
            Protect yourself from unexpected agent charges.
          </p>
        </div>

        <div className="bg-card rounded-xl border border-border p-6 space-y-5 shadow-md">
          <Input
            label="Declared Goods Value (CIF)"
            type="number"
            placeholder="e.g. 2500"
            prefix="USD $"
            mono
            value={cifUsd}
            onChange={(e) => setCifUsd(e.target.value)}
            hint="Use the Cost, Insurance & Freight value from your invoice."
          />

          <div>
            <label htmlFor={categoryId} className="text-sm font-semibold text-body font-body block mb-1.5">
              Product Category
            </label>
            <select
              id={categoryId}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-10 px-3 text-sm font-body text-body bg-card border border-border rounded-md outline-none focus:border-teal focus:ring-2 focus:ring-teal/15"
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold text-body font-body block mb-1.5">
              Shipment Mode
            </label>
            <div className="flex gap-2">
              {(['sea', 'air'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`flex-1 h-10 rounded-md text-sm font-semibold font-body border transition-all ${
                    mode === m
                      ? 'bg-midnight text-white border-midnight'
                      : 'bg-card text-slate border-border hover:border-border-strong'
                  }`}
                >
                  {m === 'sea' ? '🚢 Sea Freight' : '✈️ Air Freight'}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-500 font-body">{error}</p>
          )}

          <Button
            onClick={calculate}
            loading={loading}
            disabled={!cifUsd || !category}
            className="w-full"
            size="lg"
          >
            Calculate Landed Cost
          </Button>
        </div>

        {/* Results - UPDATED TO USE CORRECT BACKEND KEYS */}
        {result && (
          <div className="mt-6 bg-card rounded-xl border border-border overflow-hidden shadow-md">
            <div className="bg-midnight px-6 py-4">
              <p className="text-xs text-muted font-body uppercase tracking-wide">
                Estimated Total Landed Cost
              </p>
              <p className="text-3xl font-data font-semibold text-white mt-1">
                {formatKES(result.total_landed_cost_kes)}
              </p>
              <p className="text-xs text-muted font-body mt-1">
                Effective rate: {parseFloat(result.effective_total_rate_pct).toFixed(1)}% above invoice value
              </p>
            </div>

            <div className="divide-y divide-border">
              {[
                { label: 'CIF Value (KES equivalent)', value: result.cif_value_kes },
                { label: `Import Duty (${parseFloat(result.import_duty_rate_pct)}%)`, value: result.import_duty_kes },
                { label: 'VAT (16% on CIF + duty)', value: result.vat_kes },
                { label: 'IDF Levy (2.5% on CIF)', value: result.idf_levy_kes },
                { label: 'RDL Levy (2% on CIF)', value: result.rdl_levy_kes },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between px-6 py-3">
                  <span className="text-sm text-slate font-body">{label}</span>
                  <span className="text-sm font-data font-semibold text-body">
                    {formatKES(value)}
                  </span>
                </div>
              ))}
              <div className="flex items-center justify-between px-6 py-4 bg-teal-pale border-t border-teal/20">
                <span className="text-sm font-semibold text-teal font-body">
                  Total Landed Cost
                </span>
                <span className="text-base font-data font-bold text-teal">
                  {formatKES(result.total_landed_cost_kes)}
                </span>
              </div>
            </div>

            <div className="px-6 py-4 bg-amber-50 border-t border-amber-200 flex gap-2">
              <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-600 font-body leading-relaxed">
                This is an estimate based on standard KRA rates. Actual costs may differ
                based on your HS code classification, any KEBS inspection requirements,
                and KPA port handling charges.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}